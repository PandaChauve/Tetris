angular.module('angularApp.factories')
    .factory('threeRendererFactory', ['gameConstants', 'blockFactory', 'cubeRenderElementFactory', 'scoreRenderElementFactory', 'systemConfig', 
        function threeRendererFactoryCreator(gameConstants, blockFactory, cubeRenderElementFactory, scoreRenderElementFactory, systemConfig) {
            "use strict";

        function ThreeRenderer(cursors, type, scaleX, scaleY) {
            this.scale = {x : +scaleX, y : +scaleY};
            this.mode = +type;
            this.zoom = systemConfig.get(systemConfig.Keys.zoom) && gameConstants.columnCount < 8; //FIXME create a common function for this and the d&d
            if (cursors === undefined) {
                cursors = 1;
            }
            this.camera = this.createCamera();
            this.cursor = [this.createCursor(0x008080)];
            for (var i = 1; i < cursors; i += 1) {
                this.cursor.push(this.createCursor(0x800080));
            }
            this.offset = 0;
            this.id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();

            this.scene = this.createScene();
            this.type = type;
            this.cubeFactory = cubeRenderElementFactory.createFactory(this.type);
        }

        ThreeRenderer.prototype.clear = function () {
            for(var i = this.scene.children.length -1; i >= 0; i-=1){
                if(this.scene.children[i].customObject){
                    var obj = this.scene.children[i];
                    this.scene.remove(obj);
                    this.cubeFactory.releaseCube(obj);
                }
            }
            this.cubeFactory = cubeRenderElementFactory.createFactory(this.type);
			scoreRenderElementFactory.clearCache();
            this.scene = null;
            this.camera = null;
            this.renderer = null;
        };

        ThreeRenderer.prototype.createScene = function () {
            var scene = new THREE.Scene();

            var dLight = new THREE.PointLight(0xffffff, 0.5);
            dLight.position.set(0, 100, 800);
            scene.add(dLight);

            var dLight2 = new THREE.PointLight(0xffffff, 0.5);
            dLight2.position.set(600, -100, 800);
            scene.add(dLight2);

            for (var i = 0; i < this.cursor.length; i += 1) {
                scene.add(this.cursor[i]);
            }

            var geometry = new THREE.BoxGeometry(1000, 3, 3);
            var material = new THREE.MeshPhongMaterial({color: 0x330000, emissive: 0x990000});
            var line = new THREE.Mesh(geometry, material);
            line.position.set(0, (gameConstants.hiddenRowCount + gameConstants.displayedRowCount) * gameConstants.pixelPerBox -27, 10);
            scene.add(line);

            geometry = new THREE.BoxGeometry(1000, 3, 3);
            material = new THREE.MeshPhongMaterial({color: 0x003300, emissive: 0x009900});
            line = new THREE.Mesh(geometry, material);
            line.position.set(0, (gameConstants.hiddenRowCount) * gameConstants.pixelPerBox - gameConstants.pixelPerBox / 2 + 5, 10);
            scene.add(line);

            return scene;
        };

        ThreeRenderer.prototype.createCamera = function () {
            var camera = new THREE.PerspectiveCamera(this.zoom ? 62 : 75, this.zoom ? 448 / 650 : 448 / 600, 0.3, 1000);
            camera.position.z = 450;
            camera.position.x = -27;
            camera.position.y = this.zoom ? 390: 360;
            return camera;
        };

        ThreeRenderer.prototype.createRenderer = function (canvas) {
            var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: systemConfig.get(systemConfig.Keys.antialiasing)/*, preserveDrawingBuffer : true*/});
            renderer.setClearColor(0x000000);
			if(systemConfig.get(systemConfig.Keys.cssScaling))
			{				
				renderer.setSize(448*this.scale.x/2, 600*this.scale.y/2);
				$(canvas).addClass('scaledCanvas');
				$(canvas).closest(".gameResizer").css("width", 448*this.scale.x);
				$(canvas).closest(".gameResizer").css("height", 600*this.scale.y);
			}
			else{
				renderer.setSize(448*this.scale.x, 600*this.scale.y);				
			}
            return renderer;
        };

        function computeX(block, x) {
            if (block.state === blockFactory.EState.SwappedLeft) {
                return x + gameConstants.pixelPerBox / 100 * (100 - block.animationState);
            }
            if (block.state === blockFactory.EState.SwappedRight) {
                return x - gameConstants.pixelPerBox / 100 * (100 - block.animationState);
            }
            return x;
        }

        function computeZ(block) {
            var ret = 0;
            if (block.state === blockFactory.EState.SwappedLeft
                || block.state === blockFactory.EState.SwappedRight) {
                if (block.animationState < 51) {
                    ret = 2500 - (50 - block.animationState) * (50 - block.animationState);
                }
                else {
                    ret = 2500 - (block.animationState - 50) * (block.animationState - 50);
                }
                ret /= 80;
                if (block.state === blockFactory.EState.SwappedRight) {
                    ret = -ret;
                }
            }
            else if (block.state === blockFactory.EState.Disappearing) {
                ret = -block.animationState;
            }
            return ret;
        }
		
        ThreeRenderer.prototype.updateCube = function (x, block) {
			if (block.id === -1) {
				block.threeObject = this.cubeFactory.createCube(block.type);
				this.scene.add(block.threeObject);
				block.id = block.threeObject.id;
			}
            var cube = block.threeObject;
            cube.position.setY(block.verticalPosition + this.offset);
            cube.position.setX(computeX(block, x));
            cube.position.setZ(computeZ(block));
            this.cubeFactory.updateCubeDisplay(block);

            if (block.animationState > 100) {
                this.scene.remove(cube);
                this.cubeFactory.releaseCube(cube);
                block.id = -1;
                block.threeObject = null;
            }

        };

        ThreeRenderer.prototype.render = function () {
            this.renderer.render(this.scene, this.camera);
        };

        ThreeRenderer.prototype.linkDom = function (canvas) {
            this.renderer = this.createRenderer(canvas);
        };

        ThreeRenderer.prototype.unlinkDom = function () {
            this.renderer = null;
        };

        ThreeRenderer.prototype.createCursor = function (color) {
            var trackShape = new THREE.Shape();

            trackShape.absarc(72, -13, 10, -Math.PI / 2, 0, true);
            trackShape.lineTo(82, 0);
            trackShape.absarc(72, 13, 10, 0, Math.PI / 2, true);
            trackShape.lineTo(35, 20);
            trackShape.lineTo(35, 0);
            trackShape.absarc(-2, -13, 10, 3 * Math.PI / 2, Math.PI, true);
            trackShape.lineTo(-12, 0);
            trackShape.absarc(-2, 13, 10, Math.PI, Math.PI / 2, true);
            trackShape.lineTo(35, -20);

            return new THREE.PointCloud(trackShape.createPointsGeometry(), new THREE.PointCloudMaterial({
                color: color,
                size: 4
            }));
        };

        ThreeRenderer.prototype.drawCursorOn = function (x, y, cursorId) {
            if (cursorId === undefined) {
                cursorId = 0;
            }
            this.cursor[cursorId].position.set((x - (gameConstants.columnCount) / 2) * gameConstants.pixelPerBox - 10, y * (gameConstants.pixelPerBox - 0.5) + this.offset + 5, 7);

        };

        ThreeRenderer.prototype.freezeGame = function () {
            for (var i = 0; i < this.cursor.length; i += 1) {
                this.scene.remove(this.cursor[i]);
            }
            this.camera.position.z += 100;
            if(this.zoom)
                this.camera.position.y += 60;
            else
                this.camera.position.y += 100;
            this.render();
        };

        ThreeRenderer.prototype.renderTetris = function (tetris, points) {
            this.offset = tetris.groundPos;
            var block;
            for (var i = 0; i < gameConstants.columnCount; i += 1) {
                for (var j = 0; j < tetris.grid.container[i].length; j += 1) {
                    block = tetris.grid.container[i][j];
                    if (block.type !== blockFactory.EType.PlaceHolder) {
                        this.updateCube((i - gameConstants.columnCount / 2) * gameConstants.pixelPerBox, block);
                    }
                }
            }
            if (gameConstants.columnCount <= 6 && !this.zoom) { 
                for (i = 0; i < points.length; i += 1) {
                    if (!points[i].threeObject) {
                        points[i].threeObject = scoreRenderElementFactory.create();
                        points[i].threeObject.createScore(points[i].value);
                        if(points[i].threeObject.mesh)
							this.scene.add(points[i].threeObject.mesh);
                        if(points[i].threeObject.particles)
							this.scene.add(points[i].threeObject.particles);
                    }
                    if (points[i].opacity <= 0) {
                        if(points[i].threeObject.mesh)
							this.scene.remove(points[i].threeObject.mesh);
						
                        if(points[i].threeObject.particles)
							this.scene.remove(points[i].threeObject.particles);
						
						scoreRenderElementFactory.free(points[i].threeObject);						
						
                        points.splice(i, 1);
                        i -= 1;
                    }
                    else {
                        points[i].threeObject.animate(points[i].opacity);
                    }
                }
            }
            for (i = 0; i < tetris.cursor.length; i += 1) {
                this.drawCursorOn(tetris.cursor[i].x, tetris.cursor[i].y, i);
            }
            this.render();
        };

        return {
            newRenderer: function newRenderer(cursorsCount, type, scaleX, scaleY) {
                return new ThreeRenderer(cursorsCount, type || 0, scaleX || 1, scaleY || 1);
            }
        };
    }]);


