angular.module('angularApp.controllers')
    .controller('PasswordRecoveryCtrl', ['$scope', 'userAccount',
        function ($scope, userAccount) {
            "use strict";

            $scope.name = "";

            $scope.resetPassword = function(){
                if ($scope.updateForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.resetPassword($scope.name, function (message) {
                        $scope.submitEnabled = true;
                        $scope.message = message;

                    });
                }
            };
        }]);
