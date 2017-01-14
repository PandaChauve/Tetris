angular.module('angularApp.controllers')
    .controller('ArcadeMenuCtrl', ['$scope', '$routeParams','$interval','$location', 'userInput', 'EGameActions', function ($scope, $routeParams, $interval, $location, userInput, EGameActions) {
        "use strict";
        function CreateCampaignTetrisMenu(world){
            var ret = AddBackToMenu('campaign_tetris', {
                title: "Tetris Attack campaign "+world,
                data :[],
                link :[],
                selected : 1
            });
            for(var i = 1; i <= 10; i++){
                ret.data.push("tetris/tetris"+world+"/campaign_tetrisAttack_"+world+"_ta_"+world+"_"+i);
                ret.link.push("/game/campaign__tetrisAttack__"+world+"__ta_"+world+"_"+i);
            }
            return ret;
        }
        function AddBackToMenu(parent, menu){
            menu.link.unshift("/menu/"+parent);
            menu.data.unshift('back');
            return menu;
        }
        function createMenu(){
            switch($routeParams.menuName || "index")
            {
                case "index" :
                    return {
                        title: "Be ready !",
                        data :['arcade2p', 'arcade', 'campaign'],
                        link :['/menu/arcade2p', '/menu/arcade1p', '/menu/campaign'],
                        selected : 1
                    };
                case "arcade2p" :
                    return AddBackToMenu("index", {
                        title: "Two players",
                        data :['1p/wide', '1p/classic'],
                        link :['/game/ultralargecoop', '/game/classicSplitScreen'],
                        selected : 1
                    });
                case "arcade1p" :
                    return AddBackToMenu("index", {
                        title: "Single player arcade",
                        data :['1p/narrow', '1p/classic', '1p/wide', '1p/sandbox'],
                        link :['/game/small', '/game/classic', '/game/ultralarge', '/game/sandbox'],
                        selected : 1
                    });
                case "campaign" :
                    return AddBackToMenu("index", {
                        title: "Single player campaign",
                        data :['narrow', 'classic', 'wide', 'sandbox'],
                        link :['/menu/campaign_tutorial', '/menu/campaign_time', '/menu/campaign_puzzle', '/menu/campaign_tetris'],
                        selected : 1
                    });
                case "campaign_tutorial" :
                    var ret = AddBackToMenu("campaign", {
                        title: "Starter campaign",
                        data :[],
                        link :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 10; i++){
                        ret.data.push("arcade/arcade_"+i);
                        ret.link.push("/game/campaign__arcade__arcade_"+i);
                    }
                    return ret;
                case "campaign_timelimit" :
                    var ret = AddBackToMenu("campaign", {
                        title: "Time attack campaign",
                        data :[],
                        link :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 10; i++){
                        ret.data.push("timelimit/campaign_timeLimit_timelimit_"+i);
                        ret.link.push("/game/campaign__timeLimit__timelimit_"+i);
                    }
                    return ret;

                case "campaign_puzzle" :
                    var ret = AddBackToMenu("campaign", {
                        title: "Puzzles campaign",
                        data :[],
                        link :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 10; i++){
                        ret.data.push("puzzle/campaign_puzzle_puzzle_"+i);
                        ret.link.push("/game/campaign__puzzle__puzzle_"+i);
                    }
                    return ret;

                case "campaign_tetris" :
                    var ret = AddBackToMenu("campaign", {
                        title: "Tetris Attack campaign",
                        data :[],
                        link :[],
                        selected : 1
                    });
                    for(var i = 1; i <= 6; i++){
                        ret.data.push("puzzle/campaign_puzzle_puzzle_"+i);
                        ret.link.push("/menu/campaign_tetris_"+i);
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
        $scope.menu = createMenu();
        var imgSize = 448+20;
        var offset =(-$scope.menu.selected*imgSize +imgSize);
        var wantedOffset = offset;
        $scope.leftOffset = offset+('px');
        var interval = $interval(function() {
            var actions = userInput.getAllActions();
            for(var i = 0; i < actions.length; ++i){
                if(actions[i] == EGameActions.left)
                    $scope.menu.selected--;
                if(actions[i] == EGameActions.right)
                    $scope.menu.selected++;
                if(actions[i] == EGameActions.swap)
                    $location.path( $scope.menu.link[$scope.menu.selected]);
            }
            userInput.clear();
            $scope.menu.selected = (($scope.menu.selected % $scope.menu.data.length) + $scope.menu.data.length)% $scope.menu.data.length; //negative handling
            wantedOffset = (-$scope.menu.selected*imgSize +imgSize);
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
