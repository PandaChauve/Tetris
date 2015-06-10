angular.module('angularApp.factories')
    .factory('scoreRenderElementFactory', ['storage', function cubeRenderElementFactoryCreator(storage) {
        "use strict";

        function ScoreElement(){
            this.mesh = null;
            this.particles = null;
        }
        ScoreElement.prototype.animate = function(percentLeft){
            var pc = percentLeft / 100;
            if(this.mesh){
                this.mesh.material.transparent = true;
                this.mesh.material.opacity = pc;
            }
            if(this.particles){
                pc*=0.7;
                var att = this.particles.material.attributes.size;
                var time = Date.now() * 0.01;
                for (var i = 0; i < att.value.length; i++) {
                    att.value[i] = (12 + 12 * Math.sin(i + time))*pc;
                }
                var temp = this.particles.geometry.vertices;
                for(i = 0; i < temp.length; i+= 1){
                    temp[i].multiplyScalar(1.02);
                }
                this.particles.geometry.verticesNeedUpdate = true;
                att.needsUpdate = true;
            }
        };

        ScoreElement.prototype.createScore = function createScore(v) {
            var rad = Math.floor(Math.random() * 12);
            var y = 220 + 85 * (Math.floor(rad / 2) % 6) + 40 - 80 * Math.random();
            var x = ((rad % 2) ? -225 : 175)- 50 * Math.random();

            if(!storage.get("scoreEffect")){

                var text3d = new THREE.TextGeometry(v, {
                    size: 30,
                    height: 2,
                    curveSegments: 2,
                    font: "helvetiker"
                });
                var color = Math.random() * 0xffffff;
                var textMaterial = new THREE.MeshBasicMaterial({color: color});
                var ret = new THREE.Mesh(text3d, textMaterial);

                ret.position.setX(x);
                ret.position.setY(y);
                ret.position.setZ(-5);
                this.mesh = ret;
            }

            y = 220 + 80 * Math.random();
            x = -250 + 500 * Math.random();

            this.createParticles(x,y,color, v);
        };

        ScoreElement.prototype.createParticles = function(x,y,color, value){
            if(storage.get("explosionEffect")){ return;}
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
                depthTest: true,
                transparent: true
            });

            var geometry = new THREE.Geometry();

            for (var i = 0; i < 100+value*30; i++) {
                var vertex = new THREE.Vector3();
                do{
                    vertex.x = Math.random()*2-1;
                    vertex.y = Math.random()*2-1;
                }
                while(vertex.x*vertex.x+vertex.y*vertex.y>1);
                vertex.multiplyScalar(70);
                vertex.z = -50;
                geometry.vertices.push(vertex);
            }
            this.particles = new THREE.PointCloud(geometry, shaderMaterial);

            this.particles.position.setX(x);
            this.particles.position.setY(y);

            this.particles.attributes = attributes;
            var vertices = this.particles.geometry.vertices;
            var values_size = attributes.size.value;
            var values_color = attributes.customColor.value;
            var c = new THREE.Color(color);
            for (var v = 0; v < vertices.length; v += 1) {
                values_size[v] = 8;
                values_color[v] = c ;
            }
        };


        return {
            create: function(){return new ScoreElement();}
        };
    }]);

