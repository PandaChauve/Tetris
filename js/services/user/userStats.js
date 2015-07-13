
angular.module('angularApp.factories')
    .factory('userStats', ['storage', 'gameStatsFactory', function userStatsFactory(storage, gameStatsFactory) {
        "use strict";
        function UserStats() {
            this.bestGameStats = {};
            this.totalGameStats = {};
            this.currentGame = gameStatsFactory.newGameStats();
        }

        UserStats.prototype.getCurrentGame = function(){
            return this.currentGame;
        };



        UserStats.prototype.addGame = function (game, map) {
            var isCampaign = map.indexOf("campaign") > -1;
            if (!this.bestGameStats.hasOwnProperty(map)) {
                this.bestGameStats[map] = gameStatsFactory.newGameStatsFrom(game);
            }
            else {
                this.bestGameStats[map].keepBest(game);
            }
            storage.set(storage.Keys.BestGameStats, this.bestGameStats, isCampaign);
            if(isCampaign){
                if (!this.totalGameStats.hasOwnProperty(map)) {
                    this.totalGameStats[map] = gameStatsFactory.newGameStatsFrom(game);
                }
                else {
                    this.totalGameStats[map].append(game);
                }
                storage.set(storage.Keys.TotalGameStats, this.totalGameStats, true);
            }

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


        UserStats.prototype.reload = function () {
            var bestGameStats = storage.get(storage.Keys.BestGameStats); //will only return flat data
            var totalGameStats = storage.get(storage.Keys.TotalGameStats); //will only return flat data
            if (bestGameStats !== null) {
                for(var idx in bestGameStats){
                    if (bestGameStats.hasOwnProperty(idx)) {
                        this.bestGameStats[idx] = gameStatsFactory.newGameStatsFrom(bestGameStats[idx]);
                    }
                }
            }
            if (totalGameStats !== null) {
                for(idx in totalGameStats){
                    if (totalGameStats.hasOwnProperty(idx)) {
                        this.totalGameStats[idx] = gameStatsFactory.newGameStatsFrom(totalGameStats[idx]);
                    }
                }
            }
            return this;
        };
        var ret = new UserStats();
        return ret.reload();
    }]);
