angular.module('angularApp.controllers')
.controller('UserConfigCtrl', ['$scope', '$http', '$timeout', 'userAccount', 'storage','achievements',
        function ($scope, $http, $timeout, userAccount, storage, achievements) {
            "use strict";
            if (storage.get(storage.Keys.scoreEffect) == null) {
                storage.set(storage.Keys.scoreEffect, false);
                storage.set(storage.Keys.soundEffect, false);
                storage.set(storage.Keys.explosionEffect, false);
            }

            if (storage.get(storage.Keys.UserZoomConfig) == null) {
                storage.set(storage.Keys.UserZoomConfig, 2);
            }
            $scope.zoom = storage.get(storage.Keys.UserZoomConfig);
            $scope.cubeType = storage.get(storage.Keys.UserCubeTheme) || 0;
            $scope.selectedCss = storage.get(storage.Keys.UserTheme) || "Slate";

            $scope.themes = [
                {
                    Picture: "./resources/imgs/themes/plain.png",
                    Name: "Plain cubes",
                    Require : -1
                }, {
                    Picture: "./resources/imgs/themes/fancy.png",
                    Name: "Fancy cubes",
                    Require : achievements.List.Beginner
                }, {
                    Picture: "resources/imgs/themes/mines.png",
                    Name: "Mines",
                    Require : achievements.List.Nostalgic
                }, {
                    Picture: "resources/imgs/themes/candy.png",
                    Name: "Candy",
                    Require : achievements.List.RetroGamer
                }
                , {
                    Picture: "resources/imgs/themes/candyhd.png",
                    Name: "Candy HD",
                    Require : achievements.List.Sherlock
                }
                , {
                    Picture: "resources/imgs/themes/smash.png",
                    Name: "Smash bros",
                    Require : achievements.List.Flash
                }
                , {
                    Picture: "resources/imgs/themes/light.png",
                    Name: "Lights",
                    Require : achievements.List.Pacman
                }
            ];
            $scope.effects = {
                scoreEffect: storage.get(storage.Keys.scoreEffect),
                soundEffect: storage.get(storage.Keys.soundEffect),
                explosionEffect: storage.get(storage.Keys.explosionEffect)
            };

            $scope.updateCheckBox = function (name) {
                storage.set(name, !$scope.effects[name]);
            };

            $scope.requireStatus = function(key){
                if(key === -1)
                    return true;
                return achievements.isWon(key);
            };

            $scope.updateStyle = function (integer) {
                if($scope.requireStatus($scope.themes[integer].Require)){
                    $scope.cubeType = integer;
                    storage.set(storage.Keys.UserCubeTheme, $scope.cubeType);
                }
            };

            var themes = [
                "Cerulean",
                "Cosmo",
                "Cyborg",
                "Darkly",
                "Flatly",
                "Journal",
                "Lumen",
                "Paper",
                "Readable",
                "Sandstone",
                "Simplex",
                "Slate",
                "Spacelab",
                "Superhero",
                "United",
                "Yeti"
            ];
            $scope.cssThemes = [$scope.selectedCss];
            for(var i =0; i < themes.length; i+= 1){
                if(themes[i] != $scope.cssThemes[0]){
                    $scope.cssThemes.push(themes[i]);
                }
            }


            $scope.requireText = function(key){
                if(!$scope.requireStatus(key)){
                    return "Unlocked by success : "+ achievements.List.getName(key);
                }
                return "";
            };

            $scope.updateZoom = function(val){
                $scope.zoom = val;
                storage.set(storage.Keys.UserZoomConfig, $scope.zoom);
            };

            $scope.loadStyle = function (style) {
                userAccount.setTheme(style);
            };
            $timeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 0);

        }]);
