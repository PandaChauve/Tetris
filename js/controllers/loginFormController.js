angular.module('angularApp.controllers')
    .controller('LoginFormCtrl', ['$scope', '$modalInstance', 'userAccount',
        function ($scope, $modalInstance, userAccount) {
            "use strict";
            $scope.submitEnabled = true;
            $scope.message = "";
            $scope.user = {login: "", password: "", remember: true};
            $scope.register = {login: "", password: ""};
            $scope.login = function () {
                if ($scope.signForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.logIn($scope.user.login, $scope.user.password, $scope.user.remember, function (success) {
                        if (success) {
                            $modalInstance.close();
                        }
                        else {
                            $scope.submitEnabled = true;
                            $scope.message = "Login failed : check your password !";
                        }
                    });
                }
            };
            $scope.register = function () {
                if ($scope.registerForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.createUser($scope.register.login, $scope.register.password, function (success) {
                        if (success) {
                            $modalInstance.close();
                        }
                        else {
                            $scope.submitEnabled = true;
                            $scope.message = "Can't create user.";
                        }
                    });
                }
            };
            $scope.close = function () {
                $modalInstance.close();
            };
        }]);
