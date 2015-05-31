//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('GameCtrl', ['$scope', '$http', '$route', '$routeParams', '$modal', '$window', 'game', 'gameConstants', 'achievements', 'userStats','storage', 'stateChecker','userAccount',
    function ($scope, $http, $route, $routeParams, $modal, $window, game, gameConstants, achievements, userStats, storage, stateChecker, userAccount) {
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
            if(stateChecker.victory()){
                storage.set("UserMap"+$scope.gameName, true, false);
            }
            userStats.getCurrentGame().setTime(finishedGame.tics);
            userStats.getCurrentGame().setSwaps(finishedGame.tetris[0].swapCount);
            userStats.addGame(userStats.getCurrentGame(), $scope.gameName);
            achievements.check(userStats.getCurrentGame(), $scope.gameName);
            if(userAccount.isRegistered()){
                var ciphertext = stringToHex(des("wireshar", "yop" + userStats.getCurrentGame().score, 1, 0)); //just for avoiding zfa on wireshark
                $.get("http://sylvain.luthana.be/tetrisApi.php?add&user_id=" + userAccount.id + "&value=" + ciphertext + "&map=" + $scope.gameName).success(function(result) {
                    console.log(result);
                }).
                error(function(e){
                    console.log(e);
                });
            }
            $scope.openModal();
        };
        $scope.reset = function(){
            $scope.$broadcast('newGame', true);
            game.startNewGame();
        };
        $scope.openModal = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'templates/endGameModal.html',
                controller: 'ModalInstanceCtrl',
                size: 300,
                resolve: {
                    gameName: function () {
                        return $scope.gameName;
                    }
                }
            });

            modalInstance.result.then(function () {
                if (stateChecker.victory() && $scope.config.gameConfig.next) {
                    if($scope.config.gameConfig.next[0] === '#'){
                        $window.location.href=($scope.config.gameConfig.next);
                    }
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
