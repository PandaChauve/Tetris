//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('GameCtrl', ['$scope', '$http', '$route', '$routeParams', '$modal', '$window','gameFactory', 'gameConstants', 'achievements', 'userStats',
    function ($scope, $http, $route, $routeParams, $modal, $window, gameFactory, gameConstants, achievements, userStats) {
    "use strict";
    //FIXME directive too much in the controller
    $scope.gameName = $routeParams.name || "classic";
    $scope.confi = {};
    $scope.game = null;
    $scope.confi.splitScreen = $scope.gameName === "classicSplitScreen";
    $scope.load = function () {
        $http.get("games/" + $scope.gameName + ".json", {cache: false}).success(function (json) { //FIXME enable cache but i need to remove dom manipulations in jquery before
            $scope.useGameConfig(json);
        }).error(function (data) {
            console.log(data);
        });
    };
    $scope.load();
    $scope.pause = {
        toggle: function () {
            $scope.pause.active = $scope.game.togglePause();
        },
        active: false
    };
    $scope.$on('$routeChangeStart', function () {
        if ($scope.game) {
            $scope.game.stopGame();
            $scope.game = null;
        }
    });
    $scope.reset = function () {
        var obj = $scope.game;
        obj.init();
        obj.stopGame();
        $scope.game = gameFactory.newGame($scope.game.config, $scope.game.grid, $scope.endCallBack);
    };
    angular.element($window).bind('blur', function () {
        return function () {
            if ($scope.game) {
                $scope.pause.active = true;
                $scope.game.togglePause(true);
                $scope.$apply();//FIXME fear of god !
            }
        };
    }());
    $scope.useGameConfig = function (config) {
        gameConstants.load(config.config);
        if (config.grid == "") { // jshint ignore:line
            $scope.game = gameFactory.newGame(config, "", $scope.endCallBack);
        } else {
            $http.get("grids/" + config.grid + ".json", {cache: false}).success(function (json) { //FIXME enable cache but i need to remove dom manipulations in jquery before
                $scope.game = gameFactory.newGame(config, json, $scope.endCallBack);
            }).error(function (error) {
                console.log(error);
            });
        }
    };
    $scope.endCallBack = function (finishedGame) {
        userStats.getCurrentGame().setTime(finishedGame.tics);
        userStats.getCurrentGame().setSwaps(finishedGame.tetris[0].swapCount);
        userStats.addGame(userStats.getCurrentGame(), $scope.gameName);
        achievements.check(userStats.getCurrentGame(), $scope.gameName);
        $scope.open();
    };

    $scope.open = function () {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'templates/modal.html',
            controller: 'ModalInstanceCtrl',
            size: 300,
            resolve: {
                gameName: function () {
                    return $scope.gameName;
                }
            }
        });

        modalInstance.result.then(function () {
            if (status && $scope.game.config.next) {

                $scope.gameName = $scope.game.config.next;
                $route.updateParams({name: $scope.gameName});
                $scope.load();
            }
            else {
                $scope.reset();
            }
        }, function () {

        });
    };
}]);
