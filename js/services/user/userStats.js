
angular.module('angularApp.factories')
    .factory('userStats', ['storage', 'gameStatsFactory', function userStatsFactory(storage, gameStatsFactory) {
        "use strict";
        function UserStats() {
            this.points = {};
            this.bestGameStats = {};
            this.totalGameStats = {};
            this.currentGame = gameStatsFactory.newGameStats();
        }

        UserStats.prototype.getCurrentGame = function(){
            return this.currentGame;
        };


        UserStats.prototype.setMaxStat = function (score, map, stat) {
            if (!this[stat].hasOwnProperty(map)) {
                this[stat][map] = [score, 0, 0, 0, 0];
            }
            else {
                for (var i = 0; i < this[stat][map].length; i += 1) {
                    if (score >= this[stat][map][i]) {
                        this[stat][map].splice(i, 0, score);
                        this[stat][map].splice(this[stat][map].length - 1, 1);
                        break;
                    }
                }
            }

            storage.set("UserStats_" + stat, this[stat]);
        };

        UserStats.prototype.setMinStat = function (score, map, stat) {
            if (!this[stat].hasOwnProperty(map)) {
                this[stat][map] = [score, -1, -1, -1, -1];
            }
            else {
                for (var i = 0; i < this[stat][map].length; i += 1) {
                    if (score <= this[stat][map][i] || this[stat][map][i] === -1) {
                        this[stat][map].splice(i, 0, score);
                        this[stat][map].splice(this[stat][map].length - 1, 1);
                        break;
                    }
                }
            }

            storage.set("UserStats_" + stat, this[stat]);
        };

        UserStats.prototype.addGame = function (game, map) {
            if (!this.bestGameStats.hasOwnProperty(map)) {
                this.bestGameStats[map] = game;
            }
            else {
                this.bestGameStats[map].keepBest(game);
            }
            storage.set("UserStats_bestGameStats", this.bestGameStats);

            if (!this.totalGameStats.hasOwnProperty(map)) {
                this.totalGameStats[map] = game;
            }
            else {
                this.totalGameStats[map].append(game);
            }
            storage.set("UserStats_totalGameStats", this.totalGameStats);

            this.setMaxStat(game.score, map, "points");
        };

        UserStats.prototype.getBestGameStats = function (map) {
            if (this.bestGameStats.hasOwnProperty(map)) {
                return this.bestGameStats[map];
            }
            return gameStatsFactory.newGameStats();
        };

        UserStats.prototype.getTotalGameStats = function (map) {
            if (this.totalGameStats.hasOwnProperty(map)) {
                return this.totalGameStats[map];
            }
            return gameStatsFactory.newGameStats();
        };

        UserStats.prototype.getHighScore = function (map) {
            if (this.points.hasOwnProperty(map)) {
                return this.points[map];
            }
            return [0, 0, 0, 0, 0];
        };

        UserStats.GetUserStats = function () {
            var score = storage.get("UserStats_points"); //will only return flat data
            var bestGameStats = storage.get("UserStats_bestGameStats"); //will only return flat data
            var totalGameStats = storage.get("UserStats_totalGameStats"); //will only return flat data
            var ret = new UserStats();
            if (score !== null) {
                ret.points = score;
            }
            if (bestGameStats !== null) {
                for(var idx in bestGameStats){
                    if (bestGameStats.hasOwnProperty(idx)) {
                        ret.bestGameStats[idx] = gameStatsFactory.newGameStatsFrom(bestGameStats[idx]);
                    }
                }
            }
            if (totalGameStats !== null) {
                for(idx in totalGameStats){
                    if (totalGameStats.hasOwnProperty(idx)) {
                        ret.totalGameStats[idx] = gameStatsFactory.newGameStatsFrom(totalGameStats[idx]);
                    }
                }
            }
            return ret;
        };

        return UserStats.GetUserStats();
    }]);
