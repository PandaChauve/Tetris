angular.module('angularApp.controllers')
    .controller('UserAccountCtrl', ['$scope', 'userAccount',
        function ($scope, userAccount) {
            "use strict";
            $scope.user = {
                name: userAccount.username
            };

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
