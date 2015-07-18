//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('GameCtrl', ['$scope', '$http', '$route', '$routeParams', '$modal', '$window', 'game', 'gameConstants', 'achievements', 'userStats','storage', 'stateChecker','userAccount','api','map_hash',
    function ($scope, $http, $route, $routeParams, $modal, $window, game, gameConstants, achievements, userStats, storage, stateChecker, userAccount, api, map_hash) {
        "use strict";
        //FIXME directive too much in the controller
        var gameFinished = false;
        $scope.gameName = map_hash[$routeParams.hash] || $routeParams.hash || "classic";
        var campaign = $scope.gameName.indexOf("campaign") > -1;
        $scope.config = {};
        $scope.config.splitScreen = $scope.gameName === "classicSplitScreen";
        $scope.gameConditions = null;
        $scope.pause = {
            toggle: function () {
                if(!gameFinished){
                    $scope.pause.active = game.togglePause();
                }
            },
            active: false
        };

        $scope.load = function () {
            $http.get("games/" + $scope.gameName + ".json", {cache: true}).success(function (json) {
                $scope.config.gameConfig = json;
                if(campaign){
                    $scope.openCampaignModal(json);
                }
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
            $scope.gameConditions = config.victory;
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
            gameFinished = true;
            if(stateChecker.victory()){
                storage.set(storage.MKeys.UserMap+$scope.gameName, true, false);
            }
            userStats.getCurrentGame().setTime(finishedGame.last.tics); //FIXME accessor
            userStats.getCurrentGame().setSwaps(finishedGame.tetris[0].counters.swap); //FIXME accessor
            userStats.addGame(userStats.getCurrentGame(), $scope.gameName);
            achievements.check(userStats.getCurrentGame(), $scope.gameName);
            if(userAccount.isRegistered() && !campaign){
                api.addScore(userAccount.id, userStats.getCurrentGame().score, $scope.gameName).success(function(e) {
                    console.log(e + e.message);
                }).
                error(function(e){
                    console.log(e + e.message);
                });
            }
            $scope.openModal();
        };
        $scope.reset = function(){
            $scope.$broadcast('newGame', true);
            gameFinished = false;

            $scope.pause.active = false;
            if (game.pause) {
                game.togglePause();
            }
            game.startNewGame();
        };

        $scope.openModal = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'templates/endGameModal.html',
                controller: 'ModalInstanceCtrl',
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
                    campaign = $scope.gameName.indexOf("campaign") > -1;
                    $route.updateParams({hash: CryptoJS.MD5($scope.gameName)});
                    $scope.load();
                }
                else {
                    $scope.reset();
                }
            }, function () {

            });
        };

        $scope.openCampaignModal = function (json) {
            $modal.open({
                animation: true,
                templateUrl: 'templates/objectivesModal.html',
                controller: 'ObjectivesModalCtrl',
                size: 300,
                resolve: {
                    gameName: function () {
                        return $scope.gameName;
                    },
                    gameConfig: function () {
                        return json;
                    }
                }
            });
        };
    }]);
