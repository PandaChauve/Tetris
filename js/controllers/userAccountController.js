angular.module('angularApp.controllers')
    .controller('UserAccountCtrl', ['$scope', 'userAccount',
        function ($scope, userAccount) {
            "use strict";

            $scope.user = {
                name: userAccount.username,
                email: userAccount.email
            };

            $scope.updateRegistration = function(){
                if ($scope.updateForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.updateUser($scope.user.name, $scope.user.password, $scope.user.email, function (success) {
                        if(success){
                            $scope.user.name = userAccount.username;
                            $scope.user.email = userAccount.email;
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
