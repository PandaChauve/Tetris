angular.module('angularApp.controllers')
    .controller('UserConfigCtrl', ['$scope', '$http', '$timeout', 'userAccount', 'storage','achievements',
        function ($scope, $http, $timeout, userAccount, storage, achievements) {
            "use strict";
            if (storage.get("scoreEffect") == null) {
                storage.set("scoreEffect", false);
                storage.set("soundEffect", false);
                storage.set("explosionEffect", false);
            }

            $scope.themes = [
                {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Plain cubes",
                    Require : -1
                }, {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Fancy cubes",
                    Require : achievements.List.Beginner
                }, {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Mines",
                    Require : achievements.List.Nostalgic
                }, {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Candy",
                    Require : achievements.List.RetroGamer
                }
                , {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Candy HD",
                    Require : achievements.List.Sherlock
                }
                , {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Smash bros",
                    Require : achievements.List.Flash
                }
                , {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Lights",
                    Require : achievements.List.Pacman
                }
            ];
            $scope.effects = {
                scoreEffect: storage.get("scoreEffect"),
                soundEffect: storage.get("soundEffect"),
                explosionEffect: storage.get("explosionEffect")
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
                    storage.set("UserCubeTheme", $scope.cubeType);
                }
            };

            $scope.cubeType = storage.get("UserCubeTheme");


            $scope.selectedCss = storage.get("UserTheme") || "Slate";
            $scope.cssThemes = [$scope.selectedCss];

            $http.get("http://api.bootswatch.com/3/").success(function (data) {
                var themes = data.themes;
                for(var i =0; i < themes.length; i+= 1){
                    if(themes[i].name != $scope.cssThemes[0]){
                        $scope.cssThemes.push(themes[i].name);
                    }
                }
            });

            $scope.requireText = function(key){
                if(!$scope.requireStatus(key)){
                    return "Unlocked by success : "+ achievements.List.getName(key);
                }
                return "";
            };

            $scope.loadStyle = function (style) {
                userAccount.setTheme(style);
            };
            $timeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 0);

            if (!$scope.cubeType) {
                $scope.updateStyle(0);
            }
        }]);
