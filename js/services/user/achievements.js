/**
 * Created by panda on 11/05/2015.
 */

angular.module('angularApp.factories')
    .factory('achievements', ['$rootScope', 'storage', 'TIC_PER_SEC', 'SEC_PER_MIN', 'userStats', 'notify',
        function achievementsFactory($rootScope, storage, TIC_PER_SEC, SEC_PER_MIN, userStats, notify) {
            'use strict';

            function AchievementsState() {
                this.container = storage.get("UserAchievements") || [];
                for (var i = this.container.length; i < AchievementsState.List.enumSize; i += 1) {
                    this.container[i] = false;
                }
            }

            AchievementsState.prototype.isWon = function (key) {
                return this.container[key];
            };

            AchievementsState.prototype.check = function (game, gameName) {
                var newOne = false;
                for (var key = 0; key < AchievementsState.List.enumSize; key += 1) {
                    if (!this.container[key]) {
                        this.checkIndividual(key, game, gameName);

                        //new one => notify !
                        if (this.container[key]) {
                            newOne = true;
                            var sc = $rootScope.$new(true);
                            sc.picture = {
                                src: "Resources/imgs/placeholder.png",
                                alt: "Success !"
                            };
                            notify({
                                message: "Success unlocked : " + AchievementsState.List.getName(key),
                                scope: sc
                            });
                        }
                    }
                }
                if(newOne){
                    storage.set("UserAchievements", this.container);
                }
            };

            AchievementsState.prototype.keyToScore = function (key) {
                switch (key) {
                    case AchievementsState.List.Beginner :
                        return 10;
                    case AchievementsState.List.Expert :
                        return 80;
                    case AchievementsState.List.Master :
                        return 160;
                    case AchievementsState.List.God :
                        return 350;
                    case AchievementsState.List.Titan :
                        return 500;
                    case AchievementsState.List.Cheater :
                        return 1000;
                }
                throw "What are you doing here ?";
            };

            AchievementsState.prototype.checkMultiLines = function (key, game) {
                var size = 0;
                switch (key) {
                    case AchievementsState.List.Ambidextrous :
                        size = 0;
                        break;
                    case AchievementsState.List.Psychic :
                        size = 1;
                        break;
                    case AchievementsState.List.Sorcerer :
                        size = 2;
                        break;
                    default:
                        throw "What are you doing here ?";
                }
                for (; size < game.multilines.length; size += 1) {
                    if (game.multilines[size]) {
                        return true;
                    }
                }
                return false;
            };

            AchievementsState.prototype.checkIndividual = function (key, game, gameName) {
                //already done
                switch (key) {
                    case AchievementsState.List.Beginner :
                    case AchievementsState.List.Expert :
                    case AchievementsState.List.Master :
                    case AchievementsState.List.God :
                    case AchievementsState.List.Titan :
                        if (gameName === "classic") {
                            this.container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.Cheater :
                        if (gameName === "sandbox") {
                            this.container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.Ambidextrous :
                    case AchievementsState.List.Psychic :
                    case AchievementsState.List.Sorcerer :
                        this.container[key] = this.checkMultiLines(key, game);
                        break;
                    case AchievementsState.List.Stubborn :
                        this.container[key] = userStats.getTotalGameStats(gameName).time > TIC_PER_SEC * SEC_PER_MIN * 30; //30min
                        break;
                    case AchievementsState.List.BiggerIsBetter :
                        for (var size = 3; size < game.lineSizes.length; size += 1) {
                            if (game.lineSizes[size]) {
                                this.container[key] = true;
                                break;
                            }
                        }
                        break;
                }

            };

            AchievementsState.List = {
                Beginner: 0,
                Expert: 1,
                Master: 2,
                God: 3,
                Titan: 4,
                Cheater: 5,
                Ambidextrous: 6,
                Psychic: 7,
                Sorcerer: 8,
                Stubborn: 9,
                BiggerIsBetter: 10,
                Nostalgic: 11, //FIXME campaign
                enumSize: 12
            };

            AchievementsState.List.getName = function (key) {
                for (var name in AchievementsState.List) {
                    if (AchievementsState.List[name] === key) {
                        return name;
                    }
                }
                return "";
            };

            AchievementsState.List.getDescription = function (key) {
                switch (key) {
                    case AchievementsState.List.Beginner :
                        return "Get 10 points in classic";
                    case AchievementsState.List.Expert :
                        return "Get 80 points in classic";
                    case AchievementsState.List.Master :
                        return "Get 160 points in classic";
                    case AchievementsState.List.God :
                        return "Get 350 points in classic";
                    case AchievementsState.List.Titan :
                        return "An original God";
                    case AchievementsState.List.Cheater :
                        return "Get 1000 points in sandbox";
                    case AchievementsState.List.Ambidextrous :
                        return "Get 2 series at once in any game mode";
                    case AchievementsState.List.Psychic :
                        return "Get 3 series at once in any game mode";
                    case AchievementsState.List.Sorcerer :
                        return "Get 4 series at once in any game mode";
                    case AchievementsState.List.Stubborn :
                        return "Play for 30 minutes in any game mode";
                    case AchievementsState.List.BiggerIsBetter :
                        return "Create a line of 6 blocks in any game mode";
                    case AchievementsState.List.Nostalgic :
                        return "Not working yet :)";
                }
                return "";
            };
            AchievementsState.prototype.List = AchievementsState.List;

            return new AchievementsState();
        }]);
