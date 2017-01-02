angular.module('angularApp.controllers')
    .controller('ArcadeMenuCtrl', ['$scope', '$routeParams','$interval','$location', 'userInput', 'EGameActions', function ($scope, $routeParams, $interval, $location, userInput, EGameActions) {
        "use strict";
        function createMenu(){
            switch($routeParams.menuName || "index")
            {
                case "test" :
                    return {///resources/imgs/arcade/menu/
                        data :['narrow.png', 'wide.png', 'classic.png','./narrow.png', './wide.png', './classic.png'],
                        link :['/menu/arcade2p', '/menu/arcade1p', '/menu/campaign','/menu/arcade2p', '/menu/arcade1p', '/menu/campaign','/menu/arcade2p', '/menu/arcade1p', '/menu/campaign'],
                        selected : 5
                    };
                case "index" :
                    return {
                        data :['Arcade 2p', 'Arcade 1p', 'Campaign'],
                        link :['/menu/arcade2p', '/menu/arcade1p', '/menu/campaign'],
                        selected : 1
                    };
                case "arcade2p" :
                    return {
                        data :['Coop', '1v1'],
                        link :['/game/ultralargecoop', '/game/classicSplitScreen'],
                        selected : 1
                    };
                case "arcade1p" :
                    return {
                        data :['Narrow', 'Classic', 'Wide', 'Sandbox'],
                        link :['/game/small', '/game/classic', '/game/ultralarge', '/game/sandbox'],
                        selected : 1
                    };
                case "campaign" :
                    return {
                        data :['Tutorial', 'Challenges', 'Time Attack', 'Tetris Attack'],
                        link :['campaign/tutorial', '/campaign/challenges', '/campaign/timelimit', '/tetrisCampaign'],
                        selected : 1
                    };
            }
        }
        $scope.menu = createMenu();
        var offset =(-$scope.menu.selected*400 +400);
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
            wantedOffset = (-$scope.menu.selected*400 +400);
            var inc = 20;
            if(Math.abs(wantedOffset-offset) > 420)
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
