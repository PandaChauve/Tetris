angular.module('angularApp.factories')
    .factory('game', ['userInput', 'userStats', 'stateChecker', 'threeRendererFactory', 'tetrisFactory', 'TIC_PER_SEC','storage', 'systemConfig', 
        function gameFactory(userInput, userStats, stateChecker, threeRendererFactory, tetrisFactory, TIC_PER_SEC, storage, systemConfig) {
            "use strict";
            function Score() {
                this.scoreList = [];
                this.addTics = function (count) {
                    for (var i = 0; i < this.scoreList.length; i += 1) {
                        this.scoreList[i].opacity -= count / 4;
                    }
                };
                this.addScore = function (s) {
                    if (s < 1) {
                        return;
                    }
                    this.scoreList.push({
                        opacity: 100,
                        value: s,
                        object: null
                    });
                };
            }
			
			function createStat(){
				if(systemConfig.get(systemConfig.Keys.fps)){
					var ret = new Stats();
					ret.setMode(0);
					ret.domElement.style.position = 'absolute';
					ret.domElement.style.left = '0px';
					ret.domElement.style.top = '0px';

					document.body.appendChild( ret.domElement );
					return ret;
				}
				else{
					return {
						begin: function(){},
						end: function(){},
					}
				}
			}

            function Game() {
                this.last = {swaps:0, score:0, actions: 0, combo: 1, tics: 0};
                this.availableGrids = [];
                this.started = false;
                this.gridCount = 0;
                this.reset();
                this.scoreHandler = new Score();
				this.statCounter = createStat();
            }

            Game.prototype.setConfiguration = function (config, grid, cb, scope) {
                this.config = config;
                this.grid = grid;
                this.scope = scope;
                this.gridCount = this.config.tetris.length;
                stateChecker.reset(config.victory);
                if (cb === undefined) {
                    this.callback = null;
                }
                else {
                    this.callback = cb;
                }
                this.started = true;
                this.tryToStart();
            };

            Game.prototype.reset = function () {
                this.started = false;
                this.tetris = [];
                this.visual = [];
                this.tobefixed = [2, 2];
                this.startTime = null;
                this.pause = false;
                this.scoreHandler = new Score();
                this.last = {swaps:0, score:0, actions:0, combo:1, tics: 0};
            };

            Game.prototype.startNewGame = function startNewGame() {
                function findDom(a, n) {
                    for (var idx = 0; idx < a.length; idx += 1) {
                        if (a[idx].id == n) { //yes ==
                            return a[idx].node;
                        }
                    }
                }

                this.stopGame();
                this.reset();
                this.started = true;
                userStats.getCurrentGame().reset();
                userStats.getCurrentGame().gameCount += 1;

                for (var i = 0; i < this.gridCount; i += 1) {
                    this.tetris.push(tetrisFactory.newTetris(this.grid, this.config.tetris[i].cursors));
                    for (var j = 0; j < this.config.tetris[i].mappings.length; j += 1) {
                        this.tetris[i].keyBoardMappings.push(userInput.getMapping(this.config.tetris[i].mappings[j]));
                    }
                    this.visual.push(threeRendererFactory.newRenderer(this.config.tetris[i].cursors, storage.get(storage.Keys.CubeTheme), this.availableGrids[0].scaleX, this.availableGrids[0].scaleY)); //FIXME [0]
                    this.visual[i].linkDom(findDom(this.availableGrids, i));
                    this.visual[i].renderTetris(this.tetris[i], []); //first render before loop to get everything smooth
                }
                userInput.clear();
                this.id = requestAnimationFrame(this.createRenderingFct());

            };

            Game.prototype.stopGame = function stopGame() {
                this.started = false;
                window.cancelAnimationFrame(this.id);
                for (var i = 0; i < this.visual.length; i += 1) {
                    if (this.visual[i]) {
                        this.visual[i].clear();
                    }
                    this.visual[i] = null;
                }
                this.visual = [];
            };

            Game.prototype.createRenderingFct = function () {
                var that = this;
                return function (timestamp) {
                    that.render(timestamp);
                };
            };

            Game.prototype.tryToStart = function () {
                if (!this.started || this.gridCount > this.availableGrids.length) {
                    return;
                }
                this.startNewGame();
            };

            Game.prototype.linkToDom = function linkToDom(node, id, scaleX, scaleY) {
                this.availableGrids.push({
                    id: id,
                    node: node,
                    scaleX: scaleX,
                    scaleY: scaleY
                });

                this.tryToStart();

            };

            Game.prototype.unlinkToDom = function unlinkToDom(node, id) {
                this.started = false;
                for (var i = 0; i < this.availableGrids.length; i += 1) {
                    if (this.availableGrids[i].id === id) {
                        if (this.visual[id]) {
                            this.visual[id].clear();
                            this.visual[id] = null;
                        }
                        this.availableGrids.splice(i, 1);
                        break;
                    }
                }
            };

            Game.prototype.splitScreenQuickFix = function () {
                //FIXME this function is a quickfix for duel
                if (this.tetris.length === 2) {
                    while (this.tobefixed[0] < this.tetris[1].getScore() / 3) {
                        this.tobefixed[0] += 1;
                        this.tetris[0].randomFall();
                    }

                    while (this.tobefixed[1] < this.tetris[0].getScore() / 3) {
                        this.tobefixed[1] += 1;
                        this.tetris[1].randomFall();
                    }
                }
            };

            Game.prototype.togglePause = function () {
                if (!this.started) {
                    return false;
                }

                this.pause = !this.pause;

                if (this.pause) {
                    window.cancelAnimationFrame(this.id);
                }
                else {
                    this.id = requestAnimationFrame(this.createRenderingFct());
                    this.startTime = null;
                }
                userInput.clear();
                return this.pause;

            };

			
            Game.prototype.render = function (timestamp) {
				this.statCounter.begin();
                var i;

                if (this.startTime === null) {
                    this.startTime = timestamp - this.last.tics / TIC_PER_SEC * 1000;
                }
                var progress = timestamp - this.startTime;

                var continueGame = true;
                var count = 0;
                var tickret;
                while (this.last.tics < progress * TIC_PER_SEC / 1000 && continueGame) {
                    count += 1;
                    this.last.tics += 1;
                    for (i = 0; i < this.tetris.length; i += 1) {
                        tickret = this.tetris[i].oneTick();
                        stateChecker.check(this.tetris[i]);
                        if (stateChecker.defeat() || stateChecker.victory()) {
                            continueGame = false;
                            this.visual[i].freezeGame();
                        }
                    }
                    userInput.clear();

                    if(tickret.score != 0 ||this.last.combo !=  tickret.combo ){
                        this.last.score += tickret.score;
                        this.last.combo =  tickret.combo;
                    }
                    this.scoreHandler.addScore(tickret.score);
                }

                this.last.swaps = this.tetris[0].getSwaps();
                this.last.actions = this.tetris[0].getActions();
                this.scope.$broadcast('newTick', this.last);
                if(count > 1){
                    console.log("frame dropped : " + (count -1));
                }

                /* use that with the capture server
                // renderer set preserveDrawingBuffer : true
                // add this js <script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
                var canvas = document.getElementsByTagName('canvas')[0];
                var dataUrl = canvas.toDataURL();
                var socket = io.connect('http://localhost');
                socket.emit('image', dataUrl);
                */

                this.scoreHandler.addTics(count);

                if (continueGame) {
                    for (i = 0; i < this.tetris.length; i += 1) {
                        this.visual[i].renderTetris(this.tetris[i], this.scoreHandler.scoreList);
                    }
                    this.splitScreenQuickFix();
					this.statCounter.end();
                    this.id = requestAnimationFrame(this.createRenderingFct(this));
                }
                else if (this.callback !== null) {
                    this.callback(this);
                }
            };

            Game.prototype.slide = function(startX, startY, endX, endY){
                if(this.tetris.length != 1){
                    return;
                }
                this.tetris[0].slide(startX, startY, endX, endY);
            };

            return new Game();
        }]);
