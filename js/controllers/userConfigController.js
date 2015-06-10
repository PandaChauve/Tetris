angular.module('angularApp.controllers')
    .controller('UserConfigCtrl', ['$scope', 'userAccount', 'storage',
        function ($scope, userAccount, storage) {
            "use strict";
            if(storage.get("scoreEffect") == null){
                storage.set("scoreEffect", false);
                storage.set("soundEffect", false);
                storage.set("explosionEffect", false);
            }
            console.log(storage.get("scoreEffect"));
            $scope.effects = {
                scoreEffect : storage.get("scoreEffect"),
                soundEffect : storage.get("soundEffect"),
                explosionEffect : storage.get("explosionEffect")
            };

            $scope.updateCheckBox = function (name) {
                storage.set(name, !$scope.effects[name]);
            };
            $scope.updateStyle = function (integer) {
                $scope.cubeType = integer;
                storage.set("UserCubeTheme", $scope.cubeType);
            };
            $scope.cubeType = storage.get("UserCubeTheme");
            if (!$scope.cubeType) {
                $scope.updateStyle(0);
            }
            $scope.themes = [
                {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Plain cubes"
                }, {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Fancy cubes"
                }, {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Mines"
                }, {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Candy"
                }
                , {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Candy HD"
                }
                , {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Smash bros"
                }
                , {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Lights"
                }
            ];
        }]);
