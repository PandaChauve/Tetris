/**
 * Created by panda on 11/05/2015.
 */

angular.module('angularApp.factories')
    .factory('achievements', ['storage', 'TIC_PER_SEC', 'SEC_PER_MIN', 'userStats', 'notifications',
        function achievementsFactory(storage, TIC_PER_SEC, SEC_PER_MIN, userStats, notifications) {
            'use strict';

            function AchievementsState() {
                this.container = storage.Get("UserAchievements") || [];
                for (var i = this.container.length; i < AchievementsState.List.enumSize; i += 1) {
                    this.container[i] = false;
                }
            }

            AchievementsState.prototype.isWon = function (key) {
                return this.container[key];
            };

            AchievementsState.prototype.check = function (game, gameName) {
                for (var i = 0; i < AchievementsState.List.enumSize; i += 1) {
                    this.checkIndividual(i, game, gameName);
                }
                storage.Set("UserAchievements", this.container);
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
                    case AchievementsState.List.Cheater :
                        return 1000;
                }
                throw "What are you doing here ?";
            };

            AchievementsState.prototype.checkMultiLines = function (key, game) {
                var size = 0;
                switch (key) {
                    case AchievementsState.List.Ambidextrous :
                        size = 1;
                        break;
                    case AchievementsState.List.Psychics :
                        size = 2;
                        break;
                    case AchievementsState.List.Sorcerer :
                        size = 3;
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
                if (this.container[key]) {
                    return;
                }

                switch (key) {
                    case AchievementsState.List.Beginner :
                    case AchievementsState.List.Expert :
                    case AchievementsState.List.Master :
                    case AchievementsState.List.God :
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
                    case AchievementsState.List.Psychics :
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

                //new one => notify !
                if (this.container[key]) {
                    notifications.notify("Gratz you unlocked : " + AchievementsState.List.getName(key));
                }
            };

            AchievementsState.List = {
                Beginner: 0,
                Expert: 1,
                Master: 2,
                God: 3,
                Cheater: 4,
                Ambidextrous: 5,
                Psychics: 6,
                Sorcerer: 7,
                Stubborn: 8,
                BiggerIsBetter: 9,
                Nostalgic: 10, //FIXME campaign
                enumSize: 11
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
                    case AchievementsState.List.Cheater :
                        return "Get 1000 points in sandbox";
                    case AchievementsState.List.Ambidextrous :
                        return "Get 2 series at once in any game mode";
                    case AchievementsState.List.Psychics :
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
