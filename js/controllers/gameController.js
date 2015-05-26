//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('GameCtrl', ['$scope', '$http', '$route', '$routeParams', '$modal', '$window', 'game', 'gameConstants', 'achievements', 'userStats',
    function ($scope, $http, $route, $routeParams, $modal, $window, game, gameConstants, achievements, userStats) {
        "use strict";
        //FIXME directive too much in the controller
        $scope.gameName = $routeParams.name || "classic";
        $scope.config = {};
        $scope.config.splitScreen = $scope.gameName === "classicSplitScreen";
        $scope.pause = {
            toggle: function () {
                $scope.pause.active = game.togglePause();
            },
            active: false
        };

        $scope.load = function () {
            $http.get("games/" + $scope.gameName + ".json", {cache: true}).success(function (json) {
                $scope.config.gameConfig = json;
                $scope.useGameConfig(json);
            }).error(function (data) {
                console.log(data);
            });
        };

        $scope.load();

        $scope.$on('$routeChangeStart', function () {
            game.stopGame();
        });

        angular.element($window).bind('blur', function () {
            return function () {
                $scope.pause.active = true;
                if (!game.pause) {
                    game.togglePause();
                }
                $scope.$apply();
            };
        }());

        $scope.useGameConfig = function (config) {
            gameConstants.load(config.rules);
            $scope.$broadcast("newRulesSet", config.victory);
            if (config.grid == "") { // jshint ignore:line
                game.setConfiguration(config, "", $scope.endCallBack, $scope);
            } else {
                $http.get("grids/" + config.grid + ".json", {cache: true}).success(function (json) {
                    game.setConfiguration(config, json, $scope.endCallBack, $scope);
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
        $scope.reset = function(){
            game.startNewGame();
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
                if (status && $scope.config.gameConfig.next) {
                    $scope.gameName = $scope.config.gameConfig.next;
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
