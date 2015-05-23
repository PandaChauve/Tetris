
//FIXME split the directive part :)
angular.module('angularApp.factories')
    .factory('gameFactory', ['helpers', 'userInput', 'userStats', 'stateChecker', 'threeRendererFactory', 'tetrisFactory', 'TIC_PER_SEC',
        function gameFactoryCreator(helpers, userInput, userStats, stateChecker, threeRendererFactory, tetrisFactory, TIC_PER_SEC) {
            "use strict";
            function Game(config, grid, cb) {
                this.config = config;
                this.grid = grid;
                this.tetris = [];
                this.visual = [];
                stateChecker.reset(config.victory);
                this.tobefixed = [2, 2];
                this.stop = false;
                this.start = null;
                this.pause = false;
                this.tics = 0;
                userStats.getCurrentGame().reset();
                userStats.getCurrentGame().gameCount += 1;
                if (cb === undefined) {
                    this.callback = null;
                }
                else {
                    this.callback = cb;
                }
                this.init();
                this.id = requestAnimationFrame(this.createRenderingFct());
            }

            Game.prototype.stopGame = function stop() {
                window.cancelAnimationFrame(this.id);
                this.stop = true;
                for (var i = 0; i < this.visual.length; i += 1) {
                    this.visual[i].clear();
                    this.visual[i] = null;
                }
            };

            Game.prototype.createRenderingFct = function () {
                var that = this;
                return function (timestamp) {
                    that.render(timestamp);
                };
            };

            Game.prototype.init = function init() {
                for (var i = 0; i < this.config.tetris.length; i += 1) {
                    this.tetris.push(tetrisFactory.newTetris(this.grid, this.config.tetris[i].cursors, this.stats));
                    for (var j = 0; j < this.config.tetris[i].mappings.length; j += 1) {
                        this.tetris[i].keyBoardMappings.push(userInput.getMapping(this.config.tetris[i].mappings[j]));
                    }
                    this.visual.push(threeRendererFactory.newRenderer(this.config.tetris[i].cursors));
                    this.visual[i].linkDom(this.config.tetris[i].gameBox);
                    this.visual[i].renderTetris(this.tetris[i]); //first render before loop to get everything smooth
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

            Game.prototype.togglePause = function (force) {
                if (this.stop) {
                    return false;
                }
                if (force === undefined) {
                    this.pause = !this.pause;
                }
                else {
                    this.pause = force;
                }

                if (this.pause) {
                    window.cancelAnimationFrame(this.id);
                }
                else {
                    this.id = requestAnimationFrame(this.createRenderingFct());
                    this.start = null;
                }
                userInput.clear();
                return this.pause;

            };

            Game.prototype.render = function (timestamp) {
                var i;

                if (this.start === null) {
                    this.start = timestamp - this.tics / TIC_PER_SEC * 1000;
                }
                var progress = timestamp - this.start;
                $(".timeBox").html(helpers.timeFromTics(this.tics)); //FIXME middle of nowhere jquery

                var continueGame = true;
                var count = 0;
                while (this.tics < progress * TIC_PER_SEC / 1000 && continueGame && count < 10) {
                    count += 1;
                    this.tics += 1;
                    for (i = 0; i < this.tetris.length; i += 1) {
                        this.tetris[i].oneTick();

                        $("#" + this.config.tetris[i].scoreBox).html(this.tetris[i].getScore());
                        stateChecker.check(this.tetris[i]);
                        if (stateChecker.defeat() || stateChecker.victory()) {
                            continueGame = false;
                            this.visual[i].freezeGame();
                        }
                        else {
                            if (this.config.victory !== undefined && this.config.victory.swaps !== undefined) {
                                $("#" + this.config.tetris[i].swapBox).html(this.config.victory.swaps - this.tetris[i].getSwaps());
                            }
                            else {
                                $("#" + this.config.tetris[i].swapBox).html(this.tetris[i].getSwaps());
                            }
                        }
                    }
                    userInput.clear();
                }

                if (continueGame && !this.stop) {
                    for (i = 0; i < this.tetris.length; i += 1) {
                        this.visual[i].renderTetris(this.tetris[i]);
                    }
                    this.splitScreenQuickFix();
                    this.id = requestAnimationFrame(this.createRenderingFct(this));
                }
                else if (!continueGame) {
                    if (this.callback !== null) {
                        this.callback(this);
                    }
                }
            };

            return {
                newGame: function (config, grid, cb) {
                    return new Game(config, grid, cb);
                }
            };
        }]);
