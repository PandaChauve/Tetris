angular.module('angularApp.factories')
    .factory('cubeRenderElementFactory', ['gameConstants', 'blockFactory', 'storage',  function cubeRenderElementFactoryCreator(gameConstants, blockFactory, storage) {
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
                cube.material.opacity = Math.max(1 - block.animationState / 100, 0);
                cube.material.transparent = true;
            }

        };

        CubeRenderer.prototype.createTexture = function (color) {
            if (!this.textures[color]) {
                this.textures[color] = new THREE.MeshPhongMaterial({
                    color: this.getHexColor(color),
                    emissive: this.getHexColor(color)
                });
            }
            return this.textures[color];
        };

        CubeRenderer.prototype.createGeometry = function (color) {
            if (!this.cube) {
                var size = gameConstants.pixelPerBox * (0.7);
                this.cube = new THREE.BoxGeometry(size, size, gameConstants.pixelPerBox / 5);
            }
            return this.cube;
        };
        CubeRenderer.prototype.releaseCube = function(cube){
            cube.material.opacity = 1;
            this.cache[cube.customColor].push(cube);
        };
        CubeRenderer.prototype.createCube = function (color) {
            if(this.cache[color].length > 0 ){
                return this.cache[color].pop();
            }
            var r = new THREE.Mesh(this.createGeometry(color), this.createTexture(color).clone());
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
                    points.push( new THREE.Vector3( Math.sin( i * 0.2 ) * Math.sin( i * 0.1 ) * 5.5 +15, 0, ( i - 5 ) * 0.7 ) );
                }
                this.cube = new THREE.LatheGeometry( points);
            }THREE.GeometryUtils.center( this.cube );
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
            var att = block.threeObject.material.attributes;
            var time = Date.now() * 0.005;
            for (var i = 0; i < att.size.value.length; i++) {
                att.size.value[i] = 17 + 17 * Math.sin(0.1 * i + time);
            }
            att.size.needsUpdate = true;
        };
        LightCubeRenderer.prototype.releaseCube = function(cube){
            cube.material.opacity = 1;
            this.cache[cube.customColor].push(cube);
        };
        LightCubeRenderer.prototype.createCube = function (color) {
            if(this.cache[color].length > 0){
                return this.cache[color].pop();
            }
            if (!this.cubes[color]) {
                var attributes = {
                    size: {type: 'f', value: []},
                    customColor: {type: 'c', value: []}
                };
                var shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        amplitude: {type: "f", value: 1.0},
                        color: {type: "c", value: new THREE.Color(0xffffff)},
                        texture: {type: "t", value: THREE.ImageUtils.loadTexture("resources/imgs/spark.png")}
                    },
                    attributes: attributes,
                    vertexShader: document.getElementById('vertexshader').textContent,
                    fragmentShader: document.getElementById('fragmentshader').textContent,
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    transparent: true
                });

                var geometry = new THREE.Geometry();

                for (var i = 0; i < 300; i++) {
                    var vertex = new THREE.Vector3();
                    vertex.x = Math.random() - 0.5;
                    vertex.y = Math.random() - 0.5;
                    vertex.z = Math.random() - 0.5;
                    vertex.multiplyScalar(gameConstants.pixelPerBox * 0.7);
                    geometry.vertices.push(vertex);
                }
                this.cubes[color] = new THREE.PointCloud(geometry, shaderMaterial);
                this.cubes[color].attributes = attributes;
                var vertices = this.cubes[color].geometry.vertices;
                var values_size = attributes.size.value;
                var values_color = attributes.customColor.value;

                for (var v = 0; v < vertices.length; v += 1) {
                    values_size[v] = 17;
                    values_color[v] = this.getColor(color);
                }
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

