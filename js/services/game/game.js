angular.module('angularApp.factories')
    .factory('game', ['userInput', 'userStats', 'stateChecker', 'threeRendererFactory', 'tetrisFactory', 'TIC_PER_SEC','storage', 'systemConfig',
        function gameFactory(userInput, userStats, stateChecker, threeRendererFactory, tetrisFactory, TIC_PER_SEC, storage, systemConfig) {
            "use strict";
            function Score() {
                this.scoreList = [[],[],[],[]];
                this.addTics = function () {
                    for (var i = 0; i < this.scoreList.length; i += 1) {
                        for (var j = 0; j < this.scoreList[i].length; j += 1) {
                            this.scoreList[i][j].opacity -= 0.25;
                        }
                    }
                };
                this.addScore = function (s, i) {
                    if (s < 1) {
                        return;
                    }
                    this.scoreList[i].push({
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
						end: function(){}
					}
				}
			}

            function Game() {
                this.last = {swaps:0, score:0, actions: 0, combo: 1, tics: 0};
                this.availableGrids = [];
                this.gridCount = 0;
                this.reset();
                this.statCounter = createStat();
            }

            Game.prototype.setConfiguration = function (config, grid, cb, scope) {
                this.config = config;
                this.grid = grid;
                this.scope = scope;
                this.gridCount = this.config.tetris.length;
                this.checkerId = [];
                for(var i = 0; i < this.gridCount; ++i){
                    this.checkerId.push(stateChecker.create(config.victory));
                }

                if (cb === undefined) {
                    this.callback = null;
                }
                else {
                    this.callback = cb;
                }
                this.tryToStart();
            };

            Game.prototype.reset = function () {
                window.cancelAnimationFrame(this.id);
                this.id = -1;
                this.started = false;
                this.tetris = [];
                this.visual = [];
                this.tobefixed = [1, 1];
                this.startTime = null;
                this.pause = false;
                this.scoreHandler = new Score();
                this.last = {swaps:0, score:0, actions:0, combo:1, tics: 0};
				this.progress = 0;
				this.timeCounter = 0;
            };

            Game.prototype.startNewGame = function startNewGame() {
                function findDom(a, n) {
                    for (var idx = 0; idx < a.length; idx += 1) {
                        if (a[idx].id == n) { //yes ==
                            return a[idx].node;
                        }
                    }
                }
                this.reset();
                this.started = true;
                userStats.getCurrentGame().reset();
                userStats.getCurrentGame().gameCount += 1;

                for (var i = 0; i < this.gridCount; i += 1) {
                    this.tetris.push(tetrisFactory.newTetris(this.grid, this.config.tetris[i].cursors));
                    this.visual.push(threeRendererFactory.newRenderer(this.config.tetris[i].cursors, storage.get(storage.Keys.CubeTheme), this.availableGrids[0].scaleX, this.availableGrids[0].scaleY)); //FIXME [0]

                    this.visual[i].linkDom(findDom(this.availableGrids, i));
                    this.visual[i].renderTetris(this.tetris[i], []); //first render before loop to get everything smooth
                }

                switch(this.tetris.length) {
                    case 2 :
                        this.tetris[0].playersId = [0, 2];
                        this.tetris[1].playersId = [1, 3];
                        break;
                    case 4 :
                        this.tetris[0].playersId = [0];
                        this.tetris[1].playersId = [1];
                        this.tetris[2].playersId = [2];
                        this.tetris[3].playersId = [3];
                        break;
                    case 1 :
                    default :
                        this.tetris[0].playersId = [0, 1, 2, 3];
                        break;
                }
                userInput.clear();
				this.renderingFct = this.render.bind(this);
                this.id = requestAnimationFrame(this.renderingFct);

            };

            Game.prototype.stopGame = function stopGame() {
                this.started = false;
                window.cancelAnimationFrame(this.id);
                this.gridCount = 0;
                for(var i = 0; i < this.checkerId.length; ++i)
                    stateChecker.free(this.checkerId[i]);
                this.checkerId = [];
            };


            Game.prototype.tryToStart = function () {
                if (this.started || this.gridCount > this.availableGrids.length || this.gridCount == 0) {
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
                    while (this.tobefixed[0] < this.tetris[1].getDestroyed()/3 +this.tetris[1].getScore() / 10) {
                        this.tobefixed[0] += 2;
                        this.tetris[0].randomFall();
                    }

                    while (this.tobefixed[1] < this.tetris[0].getDestroyed() / 3 +this.tetris[0].getScore() / 10) {
                        this.tobefixed[1] += 2;
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
                    this.id = requestAnimationFrame(this.renderingFct);
                    this.startTime = null;
                }
                userInput.clear();
                return this.pause;

            };

			Game.prototype.computeTic = function(){
				var tickret;
                var losingPlayer = -1;
                for (var i = 0; i < this.tetris.length; i += 1) {
                    tickret = this.tetris[i].oneTick();
                    if(i == 0)
                        userStats.getCurrentGame().addLines(tickret.series, tickret.score); //FIXME not working on multi
                    stateChecker.check(this.checkerId[i], this.tetris[i]);
                    if(stateChecker.defeat(this.checkerId[i]) || stateChecker.victory(this.checkerId[i]))
                        losingPlayer = i;
                    this.scoreHandler.addScore(tickret.score, i);
                }
                userInput.clear();
				
				if(tickret.score != 0 ||this.last.combo !=  tickret.combo ){
					this.last.score += tickret.score;
					this.last.combo =  tickret.combo;
				}
				
			    if (losingPlayer != -1) {
                    this.visual[losingPlayer].freezeGame();
					return false;
				}
				return true;
			};

                /* use that with the capture server
                // renderer set preserveDrawingBuffer : true
                // add this js <script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
                var canvas = document.getElementsByTagName('canvas')[0];
                var dataUrl = canvas.toDataURL();
                var socket = io.connect('http://localhost');
                socket.emit('image', dataUrl);
                */
				
			var millisecpertic = 1000/TIC_PER_SEC;
            Game.prototype.render = function (timestamp) {
				this.statCounter.begin();

                if (this.startTime === null) {
                    this.startTime = timestamp - this.last.tics * millisecpertic;
                }
                this.progress = timestamp - this.startTime;
                var ret = true;
                while (this.timeCounter <= this.progress) {
                    ret = this.computeTic();
					this.last.tics += 1;
					this.timeCounter += millisecpertic;
					this.scoreHandler.addTics();
                }

                this.last.swaps = this.tetris[0].getSwaps();
                this.last.actions = this.tetris[0].getActions();
                this.scope.$broadcast('newTick', this.last);
                if (ret) {
                    for (var i = 0; i < this.tetris.length; i += 1) {
                        this.visual[i].renderTetris(this.tetris[i], this.scoreHandler.scoreList[i], stateChecker.getDangerLevel(this.checkerId[i]));
                    }
                    this.splitScreenQuickFix();
					this.statCounter.end();
                    this.id = requestAnimationFrame(this.renderingFct);
                }
                else if (this.callback !== null) {
                    this.callback(this);
                }
            };

            Game.prototype.slide = function(startX, startY, endX, endY){
                if(this.tetris.length != 1){
                    return false;
                }
                return this.tetris[0].slide(startX, startY, endX, endY);
            };

            Game.prototype.touchSwap = function(startX, startY){
                if(this.tetris.length != 1){
                    return false;
                }
                return this.tetris[0].touchSwap(startX, startY);
            };

            return new Game();
        }]);
