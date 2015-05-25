angular.module('angularApp.factories')
    .factory('gridEvaluator', ['gameConstants','userStats','blockFactory', function gridEvaluatorFactory(gameConstants, userStats,blockFactory) {
        "use strict";

        var GridEvaluator = function () {
            this.series = [];
            this.falling = 0;
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
                            this.falling += 1;
                        }
                    } else if (colorCount > 3) { // animationState
                        container[i][j].setState(blockFactory.EState.Disappearing);
                        this.series[serie].push(container[i][j].id);
                        if(container[i][j].wasFalling){
                            this.falling += 1;
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
            var index;
            for (index in container[i]) {
                if (container[i].hasOwnProperty(index) && container[i][index].verticalPosition === gameConstants.pixelPerBox * j) {
                    return parseInt(index);
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
                        if(container[i][realJ].wasFalling || container[i][realJP].wasFalling || container[i][realJPP].wasFalling ){
                            this.falling += 1;
                        }

                    } else if (colorCount > 3) {
                        container[i][realJ].setState(blockFactory.EState.Disappearing);
                        this.series[serie].push(container[i][realJ].id);
                        if(container[i][realJ].wasFalling){
                            this.falling += 1;
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
            var multi = this.series.length + this.falling;
            if(this.falling)
                console.log(this.falling);
            var score = 0;
            for (var i = 0; i < this.series.length; i += 1) {
                score += (this.series[i].length - 2) * multi;
            }
            return score;
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
                        this.series[existingSerie] = this.series[existingSerie].concat(this.series[i]);
                        this.series.splice(i, 1);
                        break;
                    }
                }
            }
        };

        GridEvaluator.prototype.evaluate = function (container) {
            //vertical evaluation does not count block that start disappearing => call it before horizontal evaluation
            this.series = [];
            this.falling = 0;
            this.evaluateVertical(container);
            this.evaluateHorizontal(container);
            this.mergeSeries();
            userStats.getCurrentGame().addLines(this.series, this.getScore()); //FIXME will do but i'dl like an event system
            return this.getScore();
        };

        return new GridEvaluator();
    }]);
