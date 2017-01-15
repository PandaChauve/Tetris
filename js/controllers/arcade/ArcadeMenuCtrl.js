angular.module('angularApp.controllers')
    .controller('ArcadeMenuCtrl', ['$scope', '$routeParams','$interval','$location', 'userInput', 'EGameActions', function ($scope, $routeParams, $interval, $location, userInput, EGameActions) {
        "use strict";
        function CreateCampaignTetrisMenu(world){
            var ret = AddBackToMenu('campaign_tetris', {
                data :[],
                selected : 1
            });
            for(var i = 1; i <= 10; i++){
                ret.data.push({
                    picture : "tetris/tetris"+world+"/campaign_tetrisAttack_"+world+"_ta_"+world+"_"+i,
                    link : "/game/campaign__tetrisAttack__"+world+"__ta_"+world+"_"+i,
                    name : "Lvl "+i
                });
            }
            return ret;
        }
        function AddBackToMenu(parent, menu){
            menu.data.unshift({
                picture : "back",
                link : "/menu/"+parent,
                name : "Back"
            });
            return menu;
        }
        function createMenu(){
            switch($routeParams.menuName || "index")
            {
                case "index" :
                    return {
                        data : [
                            {
                                picture : "arcade2p",
                                link : "/menu/arcade2p",
                                name : "2 Players"
                            },
                            {
                                picture : "arcade",
                                link : "/menu/arcade1p",
                                name : "Arcade"
                            },
                            {
                                picture : "campaign",
                                link : "/menu/campaign",
                                name : "Challenges"
                            }
                         ],
                        selected : 1
                    };
                case "arcade2p" :
                    return AddBackToMenu("index", {
                        data : [
                            {
                                picture : "1p/wide",
                                link : "/game/ultralargecoop",
                                name : "Coop"
                            },
                            {
                                picture : "1p/classic",
                                link : "/game/classicSplitScreen",
                                name : "Duel"
                            }
                        ],
                        selected : 1
                    });
                case "arcade1p" :
                    return AddBackToMenu("index", {
                        data : [
                            {
                                picture : "1p/narrow",
                                link : "/game/small",
                                name : "XXS"
                            },
                            {
                                picture : "1p/classic",
                                link : "/game/classic",
                                name : "Classic"
                            },
                            {
                                picture : "1p/wide",
                                link : "/game/ultralarge",
                                name : "XXL"
                            },
                            {
                                picture : "1p/sandbox",
                                link : "/game/sandbox",
                                name : "sandbox"
                            }
                        ],
                        selected : 1
                    });
                case "campaign" :
                    return AddBackToMenu("index", {
                        data : [
                            {
                                picture : "arcade/arcade_8",
                                link : "/menu/campaign_tutorial",
                                name : "Starter"
                            },
                            {
                                picture : "timelimit/campaign_timeLimit_timelimit_8",
                                link : "/menu/campaign_time",
                                name : "TimeAttack"
                            },
                            {
                                picture : "puzzle/campaign_puzzle_puzzle_7",
                                link : "/menu/campaign_puzzle",
                                name : "Puzzles"
                            },
                            {
                                picture : "tetris/tetris2/campaign_tetrisAttack_2_ta_2_6",
                                link : "/menu/campaign_tetris",
                                name : "TetrisAttack"
                            }
                        ],
                        selected : 1
                    });
                case "campaign_tutorial" :
                    var ret = AddBackToMenu("campaign", {
                        data :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 10; i++){
                        ret.data.push({
                            picture : "arcade/arcade_"+i,
                            link : "/game/campaign__arcade__arcade_"+i,
                            name : "Lvl "+i
                        });
                    }
                    return ret;
                case "campaign_timelimit" :
                    var ret = AddBackToMenu("campaign", {
                        data :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 10; i++){
                        ret.data.push({
                            picture : "timelimit/campaign_timeLimit_timelimit_"+i,
                            link : "/game/campaign__timeLimit__timelimit_"+i,
                            name : "Lvl "+i
                        });
                    }
                    return ret;

                case "campaign_puzzle" :
                    var ret = AddBackToMenu("campaign", {
                        data :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 10; i++){
                        ret.data.push({
                            picture : "puzzle/campaign_puzzle_puzzle_"+i,
                            link : "/game/campaign__puzzle__puzzle_"+i,
                            name : "Lvl "+i
                        });
                    }
                    return ret;

                case "campaign_tetris" :
                    var ret = AddBackToMenu("campaign", {
                        data :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 6; i++){
                        ret.data.push({
                            picture : "puzzle/campaign_puzzle_puzzle_"+i,
                            link : "/menu/campaign_tetris_"+i,
                            name : "World "+i
                        });
                    }
                    return ret;

                case "campaign_tetris_1" :
                    return CreateCampaignTetrisMenu(1);
                case "campaign_tetris_2" :
                    return CreateCampaignTetrisMenu(2);
                case "campaign_tetris_3" :
                    return CreateCampaignTetrisMenu(3);
                case "campaign_tetris_4" :
                    return CreateCampaignTetrisMenu(4);
                case "campaign_tetris_5" :
                    return CreateCampaignTetrisMenu(5);
                case "campaign_tetris_6" :
                    return CreateCampaignTetrisMenu(6);
            }
        }

        function computeOffset(){
            return (-$scope.menu.selected*imgSize +1920/2-imgSize/2);
        }

        $scope.menu = createMenu();
        var imgSize = 448+60;
        var offset = computeOffset();
        var wantedOffset = offset;
        $scope.leftOffset = offset+('px');
        var interval = $interval(function() {

            var reset = userInput.getReset();
            userInput.clearReset();
            if(reset)
                $location.path("/");

            var actions = userInput.getAllActions();
            userInput.clear();
            for(var i = 0; i < actions.length; ++i){
                if(actions[i] == EGameActions.left)
                    $scope.menu.selected--;
                if(actions[i] == EGameActions.right)
                    $scope.menu.selected++;
                if(actions[i] == EGameActions.swap)
                    $location.path( $scope.menu.data[$scope.menu.selected].link);

            }
            $scope.menu.selected = (($scope.menu.selected % $scope.menu.data.length) + $scope.menu.data.length)% $scope.menu.data.length; //negative handling
            wantedOffset = computeOffset();
            var inc = 20;
            if(Math.abs(wantedOffset-offset) > imgSize)
                inc = 50;
            if(Math.abs(wantedOffset-offset) < inc)
                inc = Math.abs(wantedOffset-offset);
            if(offset > wantedOffset)
                offset -= inc;
            else if(offset < wantedOffset)
                offset += inc;

            $scope.leftOffset = offset+('px');
        }, 20);

        $scope.$on('$destroy', function() {
            if (angular.isDefined(interval)) {
                $interval.cancel(interval);
                interval = undefined;
            }
        });
    }]);
