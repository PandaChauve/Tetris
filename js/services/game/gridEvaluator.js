angular.module('angularApp.factories')
    .factory('gridEvaluator', ['gameConstants','userStats','blockFactory', function gridEvaluatorFactory(gameConstants, userStats,blockFactory) {
        "use strict";

        var GridEvaluator = function () {
            this.series = [];
            this.falling = 0;
            this.lastTriger = 0;
            this.combo = 1;
        };

        GridEvaluator.prototype.evaluateColumn = function (container, i) {
            var colorCount = 0;
            var color = null;
            var serie = -1;
            for (var j = gameConstants.hiddenRowCount; j < container[i].length; j += 1) {
                if (container[i][j].state !== blockFactory.EState.Blocked) {
                    //only use fixed blocks
                    colorCount = 0;
                    color = null;
                    //don't stop here we can create a line on a disappearing block !
                } else if (container[i][j].type !== color) {
                    //New color reset
                    color = container[i][j].type;
                    colorCount = 1;
                } else {
                    colorCount += 1;

                    if (colorCount === 3) //color this one and the 2 previous
                    {
                        container[i][j].setState(blockFactory.EState.Disappearing);
                        container[i][j - 1].setState(blockFactory.EState.Disappearing);
                        container[i][j - 2].setState(blockFactory.EState.Disappearing);
                        this.series.push([]);
                        serie = this.series.length - 1;
                        this.series[serie].push(container[i][j].id);
                        this.series[serie].push(container[i][j - 1].id);
                        this.series[serie].push(container[i][j - 2].id);
                        if(container[i][j].wasFalling || container[i][j-1].wasFalling || container[i][j-2].wasFalling ){
                            this.series[serie].falling = true;
                        }
                    } else if (colorCount > 3) { // animationState
                        container[i][j].setState(blockFactory.EState.Disappearing);
                        this.series[serie].push(container[i][j].id);
                        if(container[i][j].wasFalling){
                            this.series[serie].falling = true;
                        }
                    }
                }
            }
        };

        GridEvaluator.prototype.evaluateVertical = function (container) {
            //vertical check
            for (var i = 0; i < gameConstants.columnCount; i += 1) {
                this.evaluateColumn(container, i);
            }
        };

        GridEvaluator.prototype.findBlockIndex = function (container, i, j) {
            var target = gameConstants.pixelPerBox * j;
            for (var z = gameConstants.hiddenRowCount; z < container[i].length; z+=1) {
                if (container[i][z].verticalPosition === target) {
                    return z;
                }
            }
            return -1;
        };

        GridEvaluator.prototype.evaluateLine = function (container, j) {
            var i, color, colorCount, realJ = -1, realJP = -1, realJPP = -1;
            colorCount = 0;
            color = null;
            var serie = -1;
            for (i = 0; i < gameConstants.columnCount; i += 1) {
                //keep previous ones to avoid finding them again
                realJPP = realJP;
                realJP = realJ;
                realJ = this.findBlockIndex(container, i, j);

                if (realJ === -1) {
                    colorCount = 0;
                    continue;
                }

                var block = container[i][realJ];
                if (block.state === blockFactory.EState.Blocked ||
                    (block.state === blockFactory.EState.Disappearing && block.animationState === 0)) {
                    if (block.type !== color) {
                        color = container[i][realJ].type;
                        colorCount = 0;
                    }

                    colorCount += 1;

                    if (colorCount === 3) //color this one and the 2 previous
                    {
                        container[i][realJ].setState(blockFactory.EState.Disappearing);
                        container[i - 1][realJP].setState(blockFactory.EState.Disappearing);
                        container[i - 2][realJPP].setState(blockFactory.EState.Disappearing);

                        this.series.push([]);
                        serie = this.series.length - 1;
                        this.series[serie].push(container[i][realJ].id);
                        this.series[serie].push(container[i - 1][realJP].id);
                        this.series[serie].push(container[i - 2][realJPP].id);
                        if(container[i][realJ].wasFalling || container[i-1][realJP].wasFalling || container[i-2][realJPP].wasFalling ){
                            this.series[serie].falling = true;
                        }

                    } else if (colorCount > 3) {
                        container[i][realJ].setState(blockFactory.EState.Disappearing);
                        this.series[serie].push(container[i][realJ].id);
                        if(container[i][realJ].wasFalling){
                            this.series[serie].falling = true;
                        }
                    }
                }
                else {
                    colorCount = 0;
                }
            }
        };

        GridEvaluator.prototype.evaluateHorizontal = function (container) {
            //horizontal (this one is tricky)
            for (var j = gameConstants.hiddenRowCount; j < gameConstants.displayedRowCount + gameConstants.hiddenRowCount; j += 1) {
                this.evaluateLine(container, j);
            }
        };

        GridEvaluator.prototype.getScore = function () {
            var multi = this.series.length ;
            var score = 0;
            for (var i = 0; i < this.series.length; i += 1) {

                score += Math.pow(this.series[i].length - 2, 1.5)*(this.series[i].falling ? 1.5 : 1);
            }
            return Math.ceil(score*(0.5 + Math.pow(multi, 1.5)/2));
        };

        GridEvaluator.prototype.getSerie = function (id, max) {
            for (var i = max - 1; i >= 0; i -= 1) {
                for (var j = 0; j < this.series[i].length; j += 1) {
                    if (this.series[i][j] === id) {
                        return i;
                    }
                }
            }
            return -1;
        };

        GridEvaluator.prototype.mergeSeries = function () {
            for (var i = this.series.length - 1; i >= 0; i -= 1) {
                for (var j = 0; j < this.series[i].length; j += 1) {
                    var existingSerie = this.getSerie(this.series[i][j], i);
                    if (existingSerie !== -1) {
                        var fall = this.series[existingSerie].falling || this.series[i].falling;
                        this.series[existingSerie] = this.series[existingSerie].concat(this.series[i]);
                        this.series[existingSerie].falling = fall;
                        this.series.splice(i, 1);
                        break;
                    }
                }
            }
        };

        GridEvaluator.prototype.evaluate = function (container) {
            //vertical evaluation does not count block that start disappearing => call it before horizontal evaluation
            this.lastTriger-= 1;
            if(this.lastTriger <= 0){
                this.combo = 1;
            }
            this.series = [];
            this.evaluateVertical(container);
            this.evaluateHorizontal(container);
            this.mergeSeries();
            var score = this.getScore();
            var scoreCpy = score;
            score *= this.combo;

            if(scoreCpy >= this.combo){
                this.lastTriger = 120; //FIXME magic number
                this.combo += 1;
            }
            userStats.getCurrentGame().addLines(this.series, score); //FIXME will do but i'd like an event system
            return {score: score, combo: this.combo};
        };

        return new GridEvaluator();
    }]);
