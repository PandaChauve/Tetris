angular.module('angularApp.factories')
    .factory('cubeRenderElementFactory', ['gameConstants', 'blockFactory', 'storage', 'systemConfig',
        function cubeRenderElementFactoryCreator(gameConstants, blockFactory, storage, systemConfig) {
        "use strict";
        function CubeRenderer() {
            this.cube = null;
            this.textures = {};
            this.colors = [];
            this.cache = {'0':[],'1':[],'2':[],'3':[],'4':[],'5':[],'6':[]};

            this.hexColors = storage.get(storage.Keys.HexKeyColors) || [0x000080,0x005000, 0x404040, 0x601010, 0x9c3e03, 0x281a42];
        }

        CubeRenderer.prototype.getHexColor = function getHexColor(type) {
            return this.hexColors[type];
        };

        CubeRenderer.prototype.getColor = function getColor(c) {
            if (!this.colors[c]) {
                this.colors[c] = new THREE.Color(this.getHexColor(c));
            }
            return this.colors[c];
        };
        CubeRenderer.prototype.updateCubeDisplay = function updateCubeDisplay(block) {
            var cube = block.threeObject;
            if(block.type != cube.customColor){
                cube.material.color = this.getColor(block.type);
                cube.customColor = block.type;
            }
            if (block.state === blockFactory.EState.Disappearing) {
                var scale = 1/ (1+block.animationState*block.animationState*block.animationState/100000);
                cube.scale.set( scale, scale, scale);
            }

        };

        CubeRenderer.prototype.createTexture = function (color) {
            if (!this.textures[color]) {
				if(systemConfig.get(systemConfig.Keys.useLambertMaterial))
				{
					this.textures[color] = new THREE.MeshLambertMaterial({
						color: this.getHexColor(color),
						emissive: this.getHexColor(color)
					});					
				}
				else{
					this.textures[color] = new THREE.MeshPhongMaterial({
						color: this.getHexColor(color),
						emissive: this.getHexColor(color)
					});					
				}
            }
            return this.textures[color];
        };

        CubeRenderer.prototype.createGeometry = function (color) {
            if (!this.cube) {
                var size = gameConstants.pixelPerBox * (0.7);
                this.cube = new THREE.BoxGeometry(size, size, gameConstants.pixelPerBox / 5);
                this.cube.center();
            }
            return this.cube;
        };
        CubeRenderer.prototype.releaseCube = function(cube){
            cube.scale.set( 1, 1, 1);
            this.cache[cube.customColor].push(cube);
        };
        CubeRenderer.prototype.createCube = function (color) {
            if(this.cache[color].length > 0 ){
                return this.cache[color].pop();
            }
            var r = new THREE.Mesh(this.createGeometry(color), this.createTexture(color));
            r.customObject = true;
            r.customColor = color;
            return r;
        };

        function GlacesRenderer(i) {
            CubeRenderer.call( this );
        }

        GlacesRenderer.prototype = new CubeRenderer();
        GlacesRenderer.prototype.createGeometry = function (color) {
            if (!this.cube) {
                this.cube = new THREE.CylinderGeometry( gameConstants.pixelPerBox/2, gameConstants.pixelPerBox/3, gameConstants.pixelPerBox*0.8, 16 );
            }
            return this.cube;
        };

        function CupRenderer() {
            CubeRenderer.call( this );
        }

        CupRenderer.prototype = new CubeRenderer();
        CupRenderer.prototype.createGeometry = function (color) {
            if (!this.cube) {
                var points = [];
                for ( var i = 0; i < 50; i ++ ) {
                    points.push( new THREE.Vector3( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 5.5 +15, ( i - 5 ) * 0.7 ) );
                }
                this.cube = new THREE.LatheGeometry( points);
                this.cube.rotateX(Math.PI / 2);
            }
            this.cube.center();
            return this.cube;
        };

        CupRenderer.prototype.createCube = function (color) {
            if(this.cache[color].length > 0 ){
                return this.cache[color].pop();
            }
            var r = CubeRenderer.prototype.createCube.call(this, color);
            r.rotation.x = 1.6;
            return r;
        };

        function SubDivisionCubeRenderer(i) {
            CubeRenderer.call( this );
            this.divisions = i;
        }

        SubDivisionCubeRenderer.prototype = new CubeRenderer();
        SubDivisionCubeRenderer.prototype.createGeometry = function (color) {
            if (!this.cube) {
                var size = gameConstants.pixelPerBox * ((this.divisions == 0) ? 0.7 : 1);
                this.cube = new THREE.BoxGeometry(size, size, gameConstants.pixelPerBox / 5);
                var m = new THREE.SubdivisionModifier(this.divisions);
                m.modify(this.cube);
            }
            return this.cube;
        };

        function RandomCubeRenderer() {
            CubeRenderer.call( this );
            this.cubes = {};
        }

        RandomCubeRenderer.prototype = new CubeRenderer();
        RandomCubeRenderer.prototype.createGeometry = function (color) {
            if (!this.cubes[color]) {
                var size = gameConstants.pixelPerBox * ((color % 3) ? 1 : 0.7);
                this.cubes[color] = new THREE.BoxGeometry(size, size, gameConstants.pixelPerBox / 5);
                var m = new THREE.SubdivisionModifier(color % 3);
                m.modify(this.cubes[color]);
            }

            return this.cubes[color];
        };

        function LightCubeRenderer() {
            CubeRenderer.call( this );
            this.cubes = {};
        }

        LightCubeRenderer.prototype = new CubeRenderer();
        LightCubeRenderer.prototype.updateCubeDisplay = function updateCubeDisplay(block) {
            var att = block.threeObject.geometry.attributes.size.array;
            var time = Date.now() * 0.005;
            for (var i = 0; i < att.length; i++) {
                att[i] = 17 + 17 * Math.sin(0.1 * i + time);
            }
            block.threeObject.geometry.attributes.size.needsUpdate = true;
        };
        LightCubeRenderer.prototype.releaseCube = function(cube){
            this.cache[cube.customColor].push(cube);
        };

        LightCubeRenderer.prototype.createCube = function (color) {
            function createShaderGeometry(color){
                var amount = 300;
                var positions = new Float32Array( amount * 3 );
                var colors = new Float32Array( amount * 3 );
                var sizes = new Float32Array( amount );
                var vertex = new THREE.Vector3();
                for ( var i = 0; i < amount; i ++ ) {
                    vertex.x = Math.random() - 0.5;
                    vertex.y = Math.random() - 0.5;
                    vertex.z = Math.random() - 0.5;
                    vertex.multiplyScalar(gameConstants.pixelPerBox * 0.7);
                    vertex.toArray( positions, i * 3 );
                    color.toArray( colors, i * 3 );
                    sizes[ i ] = 17;
                }
                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
                geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
                geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
                return geometry;
            }
            function createShaderMaterial(){

                return new THREE.ShaderMaterial( {
                    uniforms: {
                        amplitude: { value: 1.0 },
                        color:     { value: new THREE.Color( 0xffffff ) },
                        texture:   { value: new THREE.TextureLoader().load( "resources/imgs/spark.png" ) }
                    },
                    vertexShader:   document.getElementById( 'vertexshader' ).textContent,
                    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
                    blending:       THREE.AdditiveBlending,
                    depthTest:      false,
                    transparent:    true
                });

            }

            if(this.cache[color].length > 0){
                return this.cache[color].pop();
            }
            if (!this.cubes[color]) {
                var shaderMaterial = createShaderMaterial();
                var geometry = createShaderGeometry(this.getColor(color));
                this.cubes[color] = new THREE.Points(geometry, shaderMaterial);
            }
            var ret = this.cubes[color].clone();
            ret.customObject = true;
            ret.customColor = color;
            return ret;
        };

        return {
            createFactory: function cubeRenderElementFactory(type) {
                switch (type) {
                    case 0:
                        return new CubeRenderer();
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        return new SubDivisionCubeRenderer(type - 1);
                    case 5:
                        return new RandomCubeRenderer();
                    case 6:
                        return new LightCubeRenderer();
                    case 7:
                        return new GlacesRenderer();
                    case 8:
                        return new CupRenderer();
                }
                return new CubeRenderer();
            }
        }
    }]);

