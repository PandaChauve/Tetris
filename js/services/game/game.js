angular.module('angularApp.factories')
    .factory('game', ['userInput', 'userStats', 'stateChecker', 'threeRendererFactory', 'tetrisFactory', 'TIC_PER_SEC',
        function gameFactory(userInput, userStats, stateChecker, threeRendererFactory, tetrisFactory, TIC_PER_SEC) {
            "use strict";
            function Score() {
                this.current = 0;
                this.scoreList = [];
                this.addTics = function (count) {
                    for (var i = 0; i < this.scoreList.length; i += 1) {
                        this.scoreList[i].opacity -= count / 4;
                    }
                };
                this.addScore = function (s) {
                    if (s === this.current) {
                        return;
                    }
                    this.scoreList.push({
                        opacity: 100,
                        value: (s - this.current),
                        object: null
                    });
                    this.current = s;
                };
            }

            function Game() {
                this.last = {swaps:0, score:0};
                this.availableGrids = [];
                this.started = false;
                this.gridCount = 0;
                this.reset();
                this.scoreHandler = new Score();
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
                this.tics = 0;
                this.scoreHandler = new Score();
                this.last = {swaps:0, score:0};
            };

            Game.prototype.startNewGame = function startNewGame() {
                function findDom(a, n) {
                    for (var idx = 0; idx < a.length; idx += 1) {
                        if (a[idx].id == n) {
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
                    this.tetris.push(tetrisFactory.newTetris(this.grid, this.config.tetris[i].cursors, this.stats));
                    for (var j = 0; j < this.config.tetris[i].mappings.length; j += 1) {
                        this.tetris[i].keyBoardMappings.push(userInput.getMapping(this.config.tetris[i].mappings[j]));
                    }
                    this.visual.push(threeRendererFactory.newRenderer(this.config.tetris[i].cursors));
                    this.visual[i].linkDom(findDom(this.availableGrids, i));
                    this.visual[i].renderTetris(this.tetris[i], []); //first render before loop to get everything smooth
                }
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

            Game.prototype.linkToDom = function linkToDom(node, id) {
                this.availableGrids.push({
                    id: id,
                    node: node
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
                var i;

                if (this.startTime === null) {
                    this.startTime = timestamp - this.tics / TIC_PER_SEC * 1000;
                }
                var progress = timestamp - this.startTime;
                this.scope.$broadcast('newTime', this.tics);

                var continueGame = true;
                var count = 0;
                while (this.tics < progress * TIC_PER_SEC / 1000 && continueGame) {
                    count += 1;
                    this.tics += 1;
                    for (i = 0; i < this.tetris.length; i += 1) {
                        this.tetris[i].oneTick();
                        stateChecker.check(this.tetris[i]);
                        if (stateChecker.defeat() || stateChecker.victory()) {
                            continueGame = false;
                            this.visual[i].freezeGame();
                        }
                    }
                    userInput.clear();
                }

                if(this.last.score < this.tetris[0].getScore()){ //avoid useless broadcast
                    this.last.score = this.tetris[0].getScore();
                    this.scope.$broadcast('newScore', this.last.score);
                }
                if(this.last.swaps < this.tetris[0].getSwaps()){//avoid useless broadcast
                    this.last.swaps = this.tetris[0].getSwaps();
                    this.scope.$broadcast('newSwaps', this.last.swaps);
                }
                this.scoreHandler.addScore(this.tetris[0].getScore());
                this.scoreHandler.addTics(count);

                if (continueGame) {
                    for (i = 0; i < this.tetris.length; i += 1) {
                        this.visual[i].renderTetris(this.tetris[i], this.scoreHandler.scoreList);
                    }
                    this.splitScreenQuickFix();
                    this.id = requestAnimationFrame(this.createRenderingFct(this));
                }
                else if (this.callback !== null) {
                    this.callback(this);
                }
            };

            return new Game();
        }]);
