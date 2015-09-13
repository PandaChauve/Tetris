angular.module('angularApp.factories')
    .factory('pixiRendererFactory', ['gameConstants', 'blockFactory',  'systemConfig', 'storage',
        function pixiRendererFactoryCreator(gameConstants, blockFactory, systemConfig, storage) {
            "use strict";

            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            }

            function Pixi(cursors){
                this.renderer = PIXI.autoDetectRenderer(448, 600,{backgroundColor : 0x000000, antialias:true});
                this.stage = new PIXI.Container();
                this.offset = 0;
                this.hexColors = storage.get(storage.Keys.HexKeyColors) || [0x000080,0x005000, 0x404040, 0x601010, 0x9c3e03, 0x281a42];
                this.cubeSize = gameConstants.pixelPerBox*0.9;
                this.cursor = [this.createCursor(0x008080)];
                for (var i = 1; i < cursors; i += 1) {
                    this.cursor.push(this.createCursor(0x800080));
                }
                this.boundaries = this.createBoundaries();
                this.stage.x += (5-gameConstants.columnCount/2)*this.cubeSize;
            }
            Pixi.prototype.getCube = function(color){ //add cache
                var graphics = new PIXI.Graphics();
                graphics.lineStyle(0);
                graphics.beginFill(this.hexColors[color], 0.5);
                graphics.drawRect(0, 0, this.cubeSize*0.8, this.cubeSize*0.8);
                graphics.endFill();
                this.stage.addChild(graphics);
                return graphics;
            };

            Pixi.prototype.releaseCube = function(cube)
            {
                this.stage.removeChild(cube);
            };


            Pixi.prototype.linkDom = function (canvas) {
                var node = $(canvas).parent();
                $(canvas).remove();
                node.append(this.renderer.view);
            };

            Pixi.prototype.freezeGame = function () {
                for (var i = 0; i < this.cursor.length; i += 1) {
                    this.stage.removeChild(this.cursor[i]);
                }

                this.renderer.render(this.stage);
            };

            Pixi.prototype.drawCursorOn = function(x,y, color){
                this.cursor[color].x = x * this.cubeSize;
                this.cursor[color].y = 600-(y * this.cubeSize);
            };

            Pixi.prototype.createCursor = function(color){
                var graphics = new PIXI.Graphics();
                graphics.lineStyle(4, color, 1);
                graphics.drawRect(0, 0, this.cubeSize*1.8, this.cubeSize*0.8);
                this.stage.addChild(graphics);
                return graphics;
            };

            Pixi.prototype.computeX = function(block, x) {
                if (block.state === blockFactory.EState.SwappedLeft) {
                    return x + this.cubeSize / 100 * (100 - block.animationState);
                }
                if (block.state === blockFactory.EState.SwappedRight) {
                    return x - this.cubeSize / 100 * (100 - block.animationState);
                }
                return x;
            };

            Pixi.prototype.createBoundaries = function(){

                var graphics = new PIXI.Graphics();
                graphics.lineStyle(4, 0x660000, 1);
                graphics.moveTo(-200,600-(gameConstants.hiddenRowCount + gameConstants.displayedRowCount-1)*this.cubeSize);
                graphics.lineTo(448, 600-(gameConstants.hiddenRowCount + gameConstants.displayedRowCount-1)*this.cubeSize);

                graphics.lineStyle(4, 0x006600, 1);
                graphics.moveTo(-200,600-(gameConstants.hiddenRowCount-1)*this.cubeSize);
                graphics.lineTo(448, 600-(gameConstants.hiddenRowCount-1 )*this.cubeSize);
                this.stage.addChild(graphics);
                return graphics;
            };

            Pixi.prototype.updateCube = function (x, block) {
                if (!block.threeObject) {
                    block.threeObject = this.getCube(block.type);
                }
                var cube = block.threeObject;
                cube.y= 600 -(block.verticalPosition)*0.9;//fixme *0.9 ...
                cube.x=(this.computeX(block, x*this.cubeSize));

                if(block.state === blockFactory.EState.Disappearing){
                    cube.alpha = 1-block.animationState/100;
                }

                if (block.animationState > 100) {
                    this.releaseCube(cube);
                    block.threeObject = null;
                }

            };
            Pixi.prototype.clear = function(){this.stage = new PIXI.Container()};
            Pixi.prototype.renderTetris = function (tetris, points, dangerLevel){
                this.renderer.backgroundColor =  Math.floor(0xff*dangerLevel/50)*256*256;
                this.stage.y = -tetris.groundPos*0.9;
                this.boundaries.y = tetris.groundPos*0.9;
                var block;
                for (var i = 0; i < gameConstants.columnCount; i += 1) {
                    for (var j = 0; j < tetris.grid.container[i].length; j += 1) {
                        block = tetris.grid.container[i][j];
                        if (block.type !== blockFactory.EType.PlaceHolder) {
                            this.updateCube(i, block);
                        }
                    }
                }

                for (i = 0; i < tetris.cursor.length; i += 1) {
                    this.drawCursorOn(tetris.cursor[i].x, tetris.cursor[i].y, i);
                }

                this.renderer.render(this.stage);
            };

            return {
                newRenderer : function(cursorsCount, type, scaleX, scaleY){
                    return new Pixi(cursorsCount);
                }
            };
        }]);