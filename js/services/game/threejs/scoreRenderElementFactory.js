angular.module('angularApp.factories')
    .factory('scoreRenderElementFactory', ['systemConfig', function cubeRenderElementFactoryCreator(systemConfig) {
        "use strict";
        var loader = new THREE.FontLoader();
        var font = false;
        loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(f){
            font = f;
        });

        function MeshCache(matgen) {
            this.matGen = matgen;
            this.caches = {};
            this.create = function (txt) {
                if (!this.caches[txt] || !this.caches[txt].length) {
                    var t = new THREE.TextGeometry(txt, {
                        size: 30,
                        height: 2,
                        curveSegments: 2,
                        font: font
                    });

                    return new THREE.Mesh(t, this.matGen.get());
                }
                this.caches[txt].material = this.matGen.get();
                return this.caches[txt].pop();
            };
            this.release = function (mesh, txt) {
                if (!this.caches[txt]) {
                    this.caches[txt] = [];
                }
                mesh.scale.set(1);
                this.caches[txt].push(mesh);
            }
        }

        function MaterialGenerator() {
            this.cache = [];
            for (var i = 0; i < 20; ++i) {
                this.cache.push(new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff}));
            }
            this.get = function () {
                return this.cache[Math.floor(Math.random() * 20)];
            }
        }


        function ScoreElement(fact) {
            this.value = 0;
            this.mesh = null;
            this.particles = null;
            this.factory = fact;
        }

        ScoreElement.prototype.updateAttributes = function (att, pc) {
            //sin based element size variation removed due to performances issues
        };
        ScoreElement.prototype.updateVert = function (temp) {
            for (var i = 0; i < temp.length; i += 1) {
                temp[i]*=(1.02);
            }
        };

        ScoreElement.prototype.animate = function (percentLeft) {
            var pc = percentLeft / 100;
            if (this.mesh) {
                var scale = 1 / (1 + Math.pow(100 - percentLeft, 2) / 10000);
                this.mesh.scale.set(scale, scale, scale);
            }
            if (this.particles) {
                pc *= 0.7 * 12;
                var att = this.particles.geometry.attributes.size;
                this.updateAttributes(att, pc);

                var temp = this.particles.geometry.attributes.position.array;
                this.updateVert(temp);
                this.particles.geometry.attributes.position.needsUpdate = true;
                att.needsUpdate = true;
            }
        };

        ScoreElement.prototype.createScore = function createScore(v) {
            this.value = v;
            this.createText(v);
            this.createParticles(v);
        };

        ScoreElement.prototype.createText = function (value) {
            if (!systemConfig.get(systemConfig.Keys.scores)) {
                return;
            }

            var rad = Math.floor(Math.random() * 12);
            var y = 260 + 85 * (Math.floor(rad / 2) % 6) - 80 * Math.random();
            var x = ((rad % 2) ? -225 : 175) - 50 * Math.random();

            var ret = this.factory.txtCache.create(value);

            ret.position.setX(x);
            ret.position.setY(y);
            ret.position.setZ(-5);
            this.mesh = ret;
        };


        ScoreElement.prototype.createParticles = function (value) {
            if (!systemConfig.get(systemConfig.Keys.explosions)) {
                return;
            }

            var color = Math.random() * 0xffffff;

            var y = 220 + 80 * Math.random();
            var x = -250 + 500 * Math.random();

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    amplitude: {type: "f", value: 1.0},
                    color: {type: "c", value: new THREE.Color(0xffffff)},
                    texture: {type: "t", value: this.factory.sparkTexture}
                },
                vertexShader: document.getElementById('vertexshader').textContent,
                fragmentShader: document.getElementById('fragmentshader').textContent,
                blending: THREE.AdditiveBlending,
                depthTest: true,//FIXME
                transparent: true
            });


            var count = (100 + value * 30);
            var geometry = new THREE.BufferGeometry();
            var c = new THREE.Color(color);
            var colors = new Float32Array(3*count);
            var sizes = new Float32Array( count);
            geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
            geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

            var positions = new Float32Array(count*3 );


            for (var i = 0; i < 100 + value * 30; i++) {
                var vertex = new THREE.Vector3();
                do {
                    vertex.x = Math.random() * 2 - 1;
                    vertex.y = Math.random() * 2 - 1;
                }
                while(vertex.x * vertex.x + vertex.y * vertex.y > 1);

                vertex.multiplyScalar(70);
                vertex.z = -50;
                vertex.toArray( positions, i * 3 );
                c.toArray( colors, i * 3 );
                sizes[i] = 8;
            }
            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

            this.particles = new THREE.Points(geometry, shaderMaterial);

            this.particles.position.setX(x);
            this.particles.position.setY(y);

        };

        function factory(){
            var that = this;
            var loader = new THREE.TextureLoader();
            loader.load("resources/imgs/spark.png", function(t){that.sparkTexture = t});
            this.matGen = new MaterialGenerator();
            this.txtCache = new MeshCache(this.matGen);
            this.create = function () {
                return new ScoreElement(this);
            };
            this.free = function (obj) {
                if (obj.mesh) {
                    this.txtCache.release(obj.mesh, obj.value);
                    obj.mesh = null;
                }
            };
        }

        return {
            createFactory: function () {
                return new factory();
            }
        };
    }]);

