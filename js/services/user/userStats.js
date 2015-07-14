
angular.module('angularApp.factories')
    .factory('userStats', ['storage', 'gameStatsFactory', function userStatsFactory(storage, gameStatsFactory) {
        "use strict";
        function UserStats() {
            this.currentGame = gameStatsFactory.newGameStats();
        }

        UserStats.prototype.getCurrentGame = function(){
            return this.currentGame;
        };

        UserStats.prototype.addGame = function (game, map) {
            var isCampaign = map.indexOf("campaign") > -1;
            var best = this.getBestGameStats(map);
            best.keepBest(game);
            storage.set(storage.MKeys.BestGameStats+map, best, false);

            if(!isCampaign){
                var tot = this.getTotalGameStats(map);
                tot.append(game);
                storage.set(storage.MKeys.TotalGameStats+map, tot, false);
            }
            storage.flush();
        };

        UserStats.prototype.getBestGameStats = function (map) {
            var raw = storage.get(storage.MKeys.BestGameStats+map);
            if (raw) {
                return gameStatsFactory.newGameStatsFrom(raw);
            }
            return gameStatsFactory.newGameStats();
        };

        UserStats.prototype.getTotalGameStats = function (map) {
            var raw = storage.get(storage.MKeys.TotalGameStats+map);
            if (raw) {
                return gameStatsFactory.newGameStatsFrom(raw);
            }
            return gameStatsFactory.newGameStats();
        };

        return new UserStats();
    }]);
