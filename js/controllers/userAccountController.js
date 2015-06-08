angular.module('angularApp.controllers')
    .controller('UserAccountCtrl', ['$scope', 'userAccount', 'storage',
        function ($scope, userAccount, storage) {
            "use strict";
            $scope.updateStyle = function(integer){
                $scope.cubeType = integer;
                storage.set("UserCubeTheme", $scope.cubeType);
            };
            $scope.cubeType = storage.get("UserCubeTheme");
            if(!$scope.cubeType){
                $scope.updateStyle(0);
            }
            $scope.user = {
                name: userAccount.username
            };
            $scope.themes = [
                {
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Plain cubes"
                },{
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Fancy cubes"
                },{
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Mines"
                },{
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Candy"
                }
                ,{
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Candy HD"
                }
                ,{
                    Picture: "./Resources/imgs/placeholder.png",
                    Name: "Smash bross"
                }
            ];
            $scope.updateRegistration = function(){
                if ($scope.updateForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.updateUser($scope.user.name, $scope.user.password, function (success) {
                        if(success){
                            $scope.user.name = userAccount.username;
                            $scope.submitEnabled = true;
                        }
                        else{
                            $scope.submitEnabled = true;
                            $scope.message = "Can't update user.";
                        }

                    });
                }
            };
        }]);
