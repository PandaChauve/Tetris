angular.module('angularApp.factories')
    .factory('gameStatsFactory', ['TIC_PER_SEC', function gameStatsFactoryCreator(TIC_PER_SEC) {
        "use strict";
        function GameStats() {
            this.reset();
        }

        GameStats.prototype.reset = function reset(){
            this.score = 0;
            this.time = 0;
            this.blockDestroyed = 0;
            this.multilines = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.lineSizes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.gameCount = 0;
            this.swapCount = 0;
            this.actions = 0;
            this.apm = 0;
            this.efficiency = 0;
        };

        GameStats.prototype.addLines = function (series, score) { //no score logic here
            this.score += score;
            var ml = series.length - 2;
            if(ml >= this.multilines.length){
                ml = this.multilines.length -1;
            }
            this.multilines[ml] += 1;
            for (var i = 0; i < series.length; i += 1) { //for a given serie, remove duplicates
                var serie = [];
                $.each(series[i], function (j, el) {
                    if ($.inArray(el, serie) === -1) {
                        serie.push(el);
                    }
                });
                var idx = serie.length - 3;
                if(idx >= this.lineSizes.length){
                    idx = this.lineSizes.length -1;
                }
                this.lineSizes[idx] += 1;
                this.blockDestroyed += serie.length;
            }
        };

        GameStats.prototype.setTime = function setTime(tics) {
            this.time = tics;
            this.apm = this.actions/this.time*TIC_PER_SEC*60;
        };

        GameStats.prototype.setSwaps = function setSwaps (swp) {
            this.swapCount = swp;
            this.efficiency = this.score/this.swapCount;
        };
        GameStats.prototype.setActions = function setActions(swp) {
            this.actions = swp;
            this.apm = this.actions/this.time*TIC_PER_SEC*60;
        };

        GameStats.prototype.append = function append(otherGameStat) {
            this.gameCount += otherGameStat.gameCount;
            this.score += otherGameStat.score;
            this.time += otherGameStat.time;
            this.blockDestroyed += otherGameStat.blockDestroyed;
            this.swapCount += otherGameStat.swapCount;
            this.actions += otherGameStat.actions;
            for (var i = 0; i < this.multilines.length; i += 1) {
                this.multilines[i] += otherGameStat.multilines[i];
            }
            for (i = 0; i < this.lineSizes.length; i += 1) {
                this.lineSizes[i] += otherGameStat.lineSizes[i];
            }
            this.apm = this.actions/this.time*TIC_PER_SEC*60;
            this.efficiency = this.score/this.swapCount;
        };

        GameStats.prototype.keepBest = function keepBest(otherGameStat) {
            this.efficiency = (this.efficiency > otherGameStat.efficiency) ? this.efficiency : otherGameStat.efficiency;
            this.apm = (this.apm > otherGameStat.apm) ? this.apm : otherGameStat.apm;


            this.gameCount += otherGameStat.gameCount;
            this.score = (this.score > otherGameStat.score) ? this.score : otherGameStat.score;
            this.time = (this.time > otherGameStat.time) ? this.time : otherGameStat.time;
            this.blockDestroyed = (this.blockDestroyed > otherGameStat.blockDestroyed) ? this.blockDestroyed : otherGameStat.blockDestroyed;
            this.swapCount = (this.swapCount > otherGameStat.swapCount) ? this.swapCount : otherGameStat.swapCount;


            for (var i = 0; i < this.multilines.length && i < otherGameStat.multilines.length; i += 1) {
                this.multilines[i] = (this.multilines[i] > otherGameStat.multilines[i]) ? this.multilines[i] : otherGameStat.multilines[i];
            }
            for (i = 0; i < this.lineSizes.length && i < otherGameStat.lineSizes.length; i += 1) {
                this.lineSizes[i] = (this.lineSizes[i] > otherGameStat.lineSizes[i]) ? this.lineSizes[i] : otherGameStat.lineSizes[i];
            }
        };

        return {
            newGameStats : function newGameStats(){
                return new GameStats();
            },
            newGameStatsFrom : function newGameStatsFrom(c){
                var r = new GameStats();
                r.keepBest(c);
                return r;
            }
        };

    }]);
