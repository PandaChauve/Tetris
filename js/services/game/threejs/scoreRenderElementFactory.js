angular.module('angularApp.factories')
    .factory('scoreRenderElementFactory', ['systemConfig', function cubeRenderElementFactoryCreator(systemConfig) {
        "use strict";
		function MeshCache(){
			this.caches = {};
			this.create = function(txt){
				if(!this.caches[txt] || !this.caches[txt].length)
				{
					var t = new THREE.TextGeometry(txt, {
						size: 30,
						height: 2,
						curveSegments: 2,
						font: "helvetiker"
					});
					
					return new THREE.Mesh(t, matGen.get());
				}
				this.caches[txt].material = matGen.get();
				return this.caches[txt].pop();
			};
			this.release = function(mesh, txt){
				if(!this.caches[txt])
				{
					this.caches[txt] = [];
				}
				mesh.scale.set(1);
				this.caches[txt].push(mesh);
			}
		}
		function MaterialGenerator(){
			this.cache = [];
			for(var i = 0; i < 20; ++i)
			{				
				this.cache.push(new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff}));
			}
			this.get = function(){
				return this.cache[Math.floor(Math.random()*20)];
			}
		}
		
		var txtCache = new MeshCache();
		var matGen = new MaterialGenerator();

        function ScoreElement(){
			this.value = 0;
            this.mesh = null;
            this.particles = null;
        }

        ScoreElement.prototype.updateAttributes = function(att, pc) {
            //sin based element size variation removed due to performances issues
        };
        ScoreElement.prototype.updateVert = function(temp){
            for(var i = 0; i < temp.length; i+= 1){
                temp[i].multiplyScalar(1.02);
            }
        };

        ScoreElement.prototype.animate = function(percentLeft){
            var pc = percentLeft / 100;
            if(this.mesh){
                var scale = 1/ (1+Math.pow(100-percentLeft,2)/10000);
                this.mesh.scale.set( scale, scale, scale);
            }
            if(this.particles){
                pc*=0.7*12;
                var att = this.particles.material.attributes.size;
                this.updateAttributes(att, pc);

                var temp = this.particles.geometry.vertices;
                this.updateVert(temp);
                this.particles.geometry.verticesNeedUpdate = true;
                att.needsUpdate = true;
            }
        };

        ScoreElement.prototype.createScore = function createScore(v) {   
			this.value = v;
            this.createText(v);
            this.createParticles(v);
        };

        ScoreElement.prototype.createText = function(value){
			if(!systemConfig.get(systemConfig.Keys.scores)){return;}
			
			var rad = Math.floor(Math.random() * 12);
			var y = 260 + 85 * (Math.floor(rad / 2) % 6) - 80 * Math.random();
			var x = ((rad % 2) ? -225 : 175)- 50 * Math.random();

			var ret = txtCache.create(value);

			ret.position.setX(x);
			ret.position.setY(y);
			ret.position.setZ(-5);
			this.mesh = ret;
		};

        var sparkTexture = THREE.ImageUtils.loadTexture("resources/imgs/spark.png");
        var white = new THREE.Color(0xffffff);
        var vectorPool = [];
        function getVector(){
            if(vectorPool.length)
                return vectorPool.pop();
            return new THREE.Vector3();
        }
        ScoreElement.prototype.createParticles = function(value){
            if(!systemConfig.get(systemConfig.Keys.explosions)){return;}
			
            var color = Math.random() * 0xffffff;
			
            var y = 220 + 80 * Math.random();
            var x = -250 + 500 * Math.random();
			
            var attributes = {
                size: {type: 'f', value: []},
                customColor: {type: 'c', value: []}
            };
            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    amplitude: {type: "f", value: 1.0},
                    color: {type: "c", value: white},
                    texture: {type: "t", value: sparkTexture}
                },
                attributes: attributes,
                vertexShader: document.getElementById('vertexshader').textContent,
                fragmentShader: document.getElementById('fragmentshader').textContent,
                blending: THREE.AdditiveBlending,
                depthTest: true,
                transparent: true
            });


            var geometry = new THREE.Geometry();

            for (var i = 0; i < 100+value*30; i++) {
                var vertex = getVector();
                vertex.x = Math.random()*2-1;
                vertex.y = Math.random()*2-1;
                if(vertex.x*vertex.x+vertex.y*vertex.y>1) //the previous loop was not safe
                    continue;

                vertex.multiplyScalar(70);
                vertex.z = -50;
                geometry.vertices.push(vertex);
            }
            this.particles = new THREE.PointCloud(geometry, shaderMaterial);

            this.particles.position.setX(x);
            this.particles.position.setY(y);

            this.particles.attributes = attributes;
            var values_size = attributes.size.value;
            var values_color = attributes.customColor.value;
            var c = new THREE.Color(color);
            var vertices = this.particles.geometry.vertices;
            for (var v = 0; v < vertices.length; v += 1) {
                values_size[v] = 8;
                values_color[v] = c ;
            }
        };


        return {
            create: function(){return new ScoreElement();},
			free: function(obj){
				if(obj.mesh){
					txtCache.release(obj.mesh, obj.value);
					obj.mesh = null;
				}
				if(obj.particles){
                    for(var i = 0; i < obj.particles.geometry.vertices.length; ++i){
                        vectorPool.push(obj.particles.geometry.vertices.pop());
                    }
				}
			},
			clearCache: function(){
				txtCache = new MeshCache();
				matGen = new MaterialGenerator();
			}
        };
    }]);

