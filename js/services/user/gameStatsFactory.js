angular.module('angularApp.factories')
    .factory('gameStatsFactory', [function gameStatsFactoryCreator() {
        "use strict";
        function GameStats() {
            this.reset();
        }

        GameStats.prototype.reset = function reset(){
            this.score = 0;
            this.time = 0;
            this.blockDestroyed = 0;
            this.multilines = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.lineSizes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.gameCount = 0;
            this.swapCount = 0;
        };

        GameStats.prototype.addLines = function (series, score) { //no score logic here
            this.score += score;
            var ml = series.length - 2;
            this.multilines[ml] += 1;
            for (var i = 0; i < series.length; i += 1) { //for a given serie, remove duplicates
                var serie = [];
                $.each(series[i], function (j, el) {
                    if ($.inArray(el, serie) === -1) {
                        serie.push(el);
                    }
                });
                this.lineSizes[serie.length - 3] += 1;
                this.blockDestroyed += serie.length;
            }
        };

        GameStats.prototype.setTime = function (tics) {
            this.time = tics;
        };

        GameStats.prototype.setSwaps = function (swp) {
            this.swapCount = swp;
        };

        GameStats.prototype.append = function (otherGameStat) {
            this.gameCount += otherGameStat.gameCount;
            this.score += otherGameStat.score;
            this.time += otherGameStat.time;
            this.blockDestroyed += otherGameStat.blockDestroyed;
            this.swapCount += otherGameStat.swapCount;

            for (var i = 0; i < this.multilines.length; i += 1) {
                this.multilines[i] += otherGameStat.multilines[i];
            }
            for (i = 0; i < this.lineSizes.length; i += 1) {
                this.lineSizes[i] += otherGameStat.lineSizes[i];
            }
        };

        GameStats.prototype.keepBest = function (otherGameStat) {
            this.gameCount += otherGameStat.gameCount;
            this.score = (this.score > otherGameStat.score) ? this.score : otherGameStat.score;
            this.time = (this.time > otherGameStat.time) ? this.time : otherGameStat.time;
            this.blockDestroyed = (this.blockDestroyed > otherGameStat.blockDestroyed) ? this.blockDestroyed : otherGameStat.blockDestroyed;
            this.swapCount = (this.swapCount > otherGameStat.swapCount) ? this.swapCount : otherGameStat.swapCount;

            for (var i = 0; i < this.multilines.length; i += 1) {
                this.multilines[i] = (this.multilines[i] > otherGameStat.multilines[i]) ? this.multilines[i] : otherGameStat.multilines[i];
            }
            for (i = 0; i < this.lineSizes.length; i += 1) {
                this.lineSizes[i] = (this.lineSizes[i] > otherGameStat.lineSizes[i]) ? this.lineSizes[i] : otherGameStat.lineSizes[i];
            }
        };

        return {
            newGameStats : function(){
                return new GameStats();
            },
            newGameStatsFrom : function(c){
                var r = new GameStats();
                r.keepBest(c);
                return r;
            }
        };

    }]);