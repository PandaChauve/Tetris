/**
 * Created by panda on 11/05/2015.
 */

angular.module('angularApp.factories')
    .factory('achievements', ['$rootScope', 'storage', 'TIC_PER_SEC', 'SEC_PER_MIN', 'userStats', 'notify',
        function achievementsFactory($rootScope, storage, TIC_PER_SEC, SEC_PER_MIN, userStats, notify) {
            'use strict';

            function getContainer(){
                var r = storage.get(storage.Keys.Achievements) || [];
                for (var i = r.length; i < AchievementsState.List.enumSize; i += 1) {
                    r[i] = false;
                }
                return r;
            }

            function AchievementsState() {
            }


            AchievementsState.prototype.isWon = function (key) {
                return getContainer()[key];
            };

            AchievementsState.prototype.check = function (game, gameName) {
                var newOne = false;
                var container = getContainer();
                for (var key = 0; key < AchievementsState.List.enumSize; key += 1) {
                    if (!container[key]) {
                        this.checkIndividual(key, game, gameName, container);

                        //new one => notify !
                        if (container[key]) {
                            newOne = true;
                            var sc = $rootScope.$new(true);
                            sc.picture = {
                                src: "./resources/imgs/achievements/"+AchievementsState.List.getName(key)+".png",
                                alt: "Success !"
                            };
                            notify({
                                message: "New Success: " + AchievementsState.List.getName(key),
                                scope: sc
                            });
                        }
                    }
                }
                if(newOne){
                    storage.set(storage.Keys.Achievements, container);
                }
            };

            AchievementsState.prototype.keyToScore = function (key) {
                switch (key) {
                    case AchievementsState.List.Beginner :
                        return 60;
                    case AchievementsState.List.Expert :
                        return 160;
                    case AchievementsState.List.Master :
                        return 300;
                    case AchievementsState.List.God :
                    case AchievementsState.List.XXS :
                    case AchievementsState.List.XXL :
                        return 500;
                    case AchievementsState.List.Titan :
                    case AchievementsState.List.SuperTeam :
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

            AchievementsState.prototype.keyToMap = function(key){
                switch(key){
                    case AchievementsState.List.Nostalgic :
                        return "campaign/tetrisAttack/1/ta_1_10";
                    case AchievementsState.List.RetroGamer :
                        return "campaign/tetrisAttack/3/ta_3_10";
                    case AchievementsState.List.Dinosaur :
                        return "campaign/tetrisAttack/6/ta_6_10";
                    case AchievementsState.List.Flash :
                        return "campaign/timeLimit/timelimit_10";
                    case AchievementsState.List.Pacman :
                        return "campaign/arcade/arcade_10";
                    case AchievementsState.List.Sherlock :
                        return "campaign/puzzle/puzzle_10";
                }
            };

            AchievementsState.prototype.checkIndividual = function (key, game, gameName, container) {
                //already done
                switch (key) {
                    case AchievementsState.List.Beginner :
                    case AchievementsState.List.Expert :
                    case AchievementsState.List.Master :
                    case AchievementsState.List.God :
                    case AchievementsState.List.Titan :
                        if (gameName === "classic") {
                            container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.Cheater :
                        if (gameName === "sandbox") {
                            container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.XXL :
                        if (gameName === "ultralarge") {
                            container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.XXS :
                        if (gameName === "small") {
                            container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.SuperTeam :
                        if (gameName === "ultralargecoop") {
                            container[key] = game.score >= this.keyToScore(key);
                        }
                        break;
                    case AchievementsState.List.Destroyer :
                            container[key] = userStats.getTotalGameStats(gameName).blockDestroyed >= 10000;                        
                        break;
                    case AchievementsState.List.Restless :
                            container[key] = userStats.getTotalGameStats(gameName).swapCount >= 100000;                        
                        break;
                    case AchievementsState.List.Veteran :
                            container[key] = userStats.getTotalGameStats(gameName).gameCount > 99;                        
                        break;
                    case AchievementsState.List.Ambidextrous :
                    case AchievementsState.List.Psychic :
                    case AchievementsState.List.Sorcerer :
                        container[key] = this.checkMultiLines(key, game);
                        break;
                    case AchievementsState.List.Stubborn :
                        container[key] = userStats.getTotalGameStats(gameName).time > TIC_PER_SEC * SEC_PER_MIN * 30; //30min
                        break;
                    case AchievementsState.List.Tenacious :
                        container[key] = userStats.getTotalGameStats(gameName).time > TIC_PER_SEC * SEC_PER_MIN * 180; //3h
                        break;
                    case AchievementsState.List.BiggerIsBetter :
                        for (var size = 3; size < game.lineSizes.length; size += 1) {
                            if (game.lineSizes[size]) {
                                container[key] = true;
                                break;
                            }
                        }
                        break;
                    case AchievementsState.List.Nostalgic :
                    case AchievementsState.List.RetroGamer :
                    case AchievementsState.List.Dinosaur :
                    case AchievementsState.List.Flash :
                    case AchievementsState.List.Pacman :
                    case AchievementsState.List.Sherlock :
                        container[key] = storage.get(storage.MKeys.UserMap+this.keyToMap(key));
                        break;
                }

            };
            AchievementsState.List = {
                Beginner: 0, //points
                Expert: 1, //points
                Master: 2, //points
                God: 3,//points
                Titan: 4,//points
                Cheater: 5,//points
                Ambidextrous: 6,//lines
                Psychic: 7,//lines
                Sorcerer: 8,//lines
                Stubborn: 9,//time
                BiggerIsBetter: 10, //length
                Nostalgic: 11, //ta 1
                RetroGamer: 12, //ta 3
                Dinosaur: 13, //ta 6
                Flash : 14, // time attack
                Pacman: 15, //arcade
                Sherlock: 16, //puzzle
                Tenacious: 17, //time
                XXL: 18, //points
                XXS: 19, //points
                SuperTeam: 20, //points
                Destroyer: 21, //blocks
                Restless: 22, //swaps
                Veteran: 23, //swaps

                enumSize: 24
            };

            AchievementsState.List.Ordered = [
                AchievementsState.List.Beginner,
                AchievementsState.List.Expert,
                AchievementsState.List.Master,
                AchievementsState.List.God,
                AchievementsState.List.Titan,
                AchievementsState.List.XXL,
                AchievementsState.List.XXS,
                AchievementsState.List.Cheater,
                AchievementsState.List.SuperTeam,
                AchievementsState.List.Ambidextrous,
                AchievementsState.List.Psychic,
                AchievementsState.List.Sorcerer,
                AchievementsState.List.BiggerIsBetter,
                AchievementsState.List.Nostalgic,
                AchievementsState.List.RetroGamer,
                AchievementsState.List.Dinosaur,
                AchievementsState.List.Flash,
                AchievementsState.List.Pacman,
                AchievementsState.List.Sherlock,
                AchievementsState.List.Destroyer,
                AchievementsState.List.Stubborn,
                AchievementsState.List.Tenacious,
                AchievementsState.List.Restless,
                AchievementsState.List.Veteran
            ];
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
                        return "Get 60 points in classic";
                    case AchievementsState.List.Expert :
                        return "Get 160 points in classic";
                    case AchievementsState.List.Master :
                        return "Get 300 points in classic";
                    case AchievementsState.List.God :
                        return "Get 500 points in classic";
                    case AchievementsState.List.XXL :
                        return "Get 500 points in wide";
                    case AchievementsState.List.XXS :
                        return "Get 500 points in narrow";
                    case AchievementsState.List.SuperTeam :
                        return "Get 1000 points in coop";
                    case AchievementsState.List.Titan :
                        return "As good as the game master, the mighty Panda !";
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
                    case AchievementsState.List.Tenacious :
                        return "Play for 3 hours in any game mode";
                    case AchievementsState.List.BiggerIsBetter :
                        return "Create a line of 6 blocks in any game mode";
                    case AchievementsState.List.Nostalgic :
                        return "Finish the first Tetris Attack campaign";
                    case AchievementsState.List.RetroGamer :
                        return "Finish the third Tetris Attack campaign";
                    case AchievementsState.List.Dinosaur :
                        return "Finish the last Tetris Attack campaign";
                    case AchievementsState.List.Flash :
                        return "Finish the time attack campaign";
                    case AchievementsState.List.Pacman :
                        return "Finish the tutorial campaign";
                    case AchievementsState.List.Sherlock :
                        return "Finish the challenge campaign";
                    case AchievementsState.List.Destroyer :
                        return "Destroy 10000 blocks in any game mode";
                    case AchievementsState.List.Restless :
                        return "Swap 100000 pairs of blocks in any game mode";
                    case AchievementsState.List.Veteran :
                        return "100 games in any game mode";
                }
                return "";
            };
            AchievementsState.prototype.List = AchievementsState.List;

            return new AchievementsState();
        }]);
