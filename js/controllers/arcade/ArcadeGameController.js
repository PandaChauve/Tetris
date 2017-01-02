//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('ArcadeGameCtrl', ['$scope', '$http', '$route', '$routeParams', '$modal', '$window', 'game', 'gameConstants', 'storage', 'stateChecker', 'map_hash',
    function ($scope, $http, $route, $routeParams, $modal, $window, game, gameConstants, storage, stateChecker, map_hash) {
        "use strict";
        //FIXME directive too much in the controller
        var gameFinished = false;
        $scope.gameName = map_hash[$routeParams.hash] || $routeParams.hash || "classic";
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
            if(campaign){
                $scope.openCampaignModal(config);
            }
        };

        $scope.endCallBack = function (finishedGame) {
            gameFinished = true;
        };

        $scope.$on("$destroy", function() {
            game.stopGame();
        });
    }]);
