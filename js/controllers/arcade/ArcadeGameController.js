//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('ArcadeGameCtrl', ['$scope', '$interval', '$http', '$route', '$timeout', '$routeParams', '$modal', '$window', '$location', 'game', 'gameConstants',
'stateChecker', 'userInput', 'EGameActions',    function ($scope, $interval,$http, $route, $timeout, $routeParams, $modal, $window, $location,  game, gameConstants, stateChecker, userInput, EGameActions) {
        "use strict";
        //FIXME directive too much in the controller
        var gameFinished = false;
        $scope.gameName = $routeParams.hash || "classic";
        $scope.gameName =  $scope.gameName.replace('__','/');
        $scope.gameName =  $scope.gameName.replace('__','/');
        $scope.gameName =  $scope.gameName.replace('__','/');
        var campaign = $scope.gameName.indexOf("campaign") > -1;
        $scope.config = {};
        $scope.config.splitScreen = $scope.gameName === "classicSplitScreen" || $scope.gameName === "2v2" ; //FIXME based on config
        $scope.gameConditions = null;

        $scope.load = function () {
            $http.get("resources/games/" + $scope.gameName + ".json", {cache: true}).success(function (json) {
                $scope.config.gameConfig = json;
                $scope.useGameConfig(json);
            }).error(function (data) {
                console.log(data);
            });
        };

        $scope.load();

        $scope.useGameConfig = function (config) {
            gameConstants.load(config.rules);
            $scope.gameConditions = config.victory;
            $scope.$broadcast("newRulesSet", config.victory);
            if (config.grid == "") { // jshint ignore:line
                game.setConfiguration(config, "", $scope.endCallBack, $scope);
            } else {
                $http.get("resources/grids/" + config.grid + ".json", {cache: true}).success(function (json) {
                    game.setConfiguration(config, json, $scope.endCallBack, $scope);

                }).error(function (error) {
                    console.log(error);
                });
            }
        };

        $scope.endCallBack = function (finishedGame) {
            gameFinished = true;
            var str = JSON.stringify(finishedGame.last, true);
            localStorage.setItem('ArcadeLastGame', str);
            localStorage.setItem('ArcadeLastGameUri', $location.path());
            if(($scope.config.gameConfig.next && stateChecker.victory(0))) {
                if($scope.config.gameConfig.next[0] === '#')
                    $timeout(function () {  $window.location.href=("#!/lost/campaign");}, 2000);
                else
                {
                    var path = $scope.config.gameConfig.next.replace('/', '__');
                    path = path.replace('/', '__');
                    path = path.replace('/', '__');
                    $window.location.href = ("#!/game/" + path);
                }
            }
            else {
                $timeout(function () {

                    var path = $routeParams.hash || "classic";
                    $window.location.href = ("#!/lost/" + path);
                }, 2000);
            }
        };
        var interval = $interval(function() {
            var reset = userInput.getReset();
            userInput.clearReset();
            if(reset)
                $window.location.href="#!/";
        }, 500);


        $scope.$on("$destroy", function() {
            game.stopGame();
            if (angular.isDefined(interval)) {
                $interval.cancel(interval);
                interval = undefined;
            }
        });
    }]);
