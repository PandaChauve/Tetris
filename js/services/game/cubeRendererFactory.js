angular.module('angularApp.factories')
    .factory('cubeRendererFactory', ['gameConstants', 'blockFactory', function cubeRendererFactoryCreator(gameConstants, blockFactory) {
        "use strict";

        function CubeRenderer() {
            this.cube = null;
            this.textures = {};
            this.colors = [];
        }

        CubeRenderer.prototype.getHexColor = function getHexColor(type) {
            switch (type) {
                case 0:
                    return 0x000080;
                case 1:
                    return 0x005000;
                case 2:
                    return 0x404040;
                case 3:
                    return 0x601010;
                case 4:
                    return 0x9c3e03;
                case 5:
                    return 0x281a42;
            }
            return 0x000000;
        };

        CubeRenderer.prototype.getColor = function getColor(c) {
            if (!this.colors[c]) {
                this.colors[c] = new THREE.Color(this.getHexColor(c));
            }
            return this.colors[c];
        };
        CubeRenderer.prototype.updateCubeDisplay = function updateCubeDisplay(block) {
            var cube = block.threeObject;
            cube.material.color = this.getColor(block.type);
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
            return this.textures[color].clone();
        };

        CubeRenderer.prototype.createGeometry = function (color) {
            if (!this.cube) {
                var size = gameConstants.pixelPerBox * (0.7);
                this.cube = new THREE.BoxGeometry(size, size, gameConstants.pixelPerBox / 5);
            }
            return this.cube.clone();
        };

        CubeRenderer.prototype.createCube = function (color) {
            return new THREE.Mesh(this.createGeometry(color).clone(), this.createTexture(color).clone());
        };

        function SubDivisionCubeRenderer(i) {
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
            return this.cube.clone();
        };

        function RandomCubeRenderer(i) {
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

            return this.cubes[color].clone();
        };

        function LightCubeRenderer() {
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
        LightCubeRenderer.prototype.createCube = function (color) {
            if (!this.cubes[color]) {
                var attributes = {
                    size: {type: 'f', value: []},
                    customColor: {type: 'c', value: []}
                };
                var shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        amplitude: {type: "f", value: 1.0},
                        color: {type: "c", value: new THREE.Color(0xffffff)},
                        texture: {type: "t", value: THREE.ImageUtils.loadTexture("Resources/imgs/spark.png")}
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
            return this.cubes[color].clone();
        };

        return {
            create: function cubeRendererFactory(type) {
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
                }
                return new CubeRenderer();
            }
        }
    }]);

