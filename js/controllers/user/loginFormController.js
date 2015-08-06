angular.module('angularApp.controllers')
    .controller('LoginFormCtrl', ['$scope', '$modalInstance', 'userAccount',
        function ($scope, $modalInstance, userAccount) {
            "use strict";
            $scope.submitEnabled = true;
            $scope.messageLogin = "";
            $scope.messageRegister = "";
            $scope.user = {login: "", password: ""};
            $scope.register = {login: "", password: ""};
            $scope.login = function () {
                if ($scope.signForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.logIn($scope.user.login, $scope.user.password, function (success, msg) {
                        if (success) {
                            $modalInstance.close();
                        }
                        else{
                            $scope.submitEnabled = true;
                            $scope.messageLogin = msg ? msg : "Login failed : check your password !";
                        }
                    });
                }
            };
            $scope.register = function () {
                if ($scope.registerForm.$valid) {
                    $scope.submitEnabled = false;
                    userAccount.createUser($scope.register.login, $scope.register.password, function (success, msg) {
                        if (success) {
                            $modalInstance.close();
                        }
                        else {
                            $scope.submitEnabled = true;
                            $scope.messageRegister = msg ? msg : "Can't create user.";
                        }
                    });
                }
            };
            $scope.close = function () {
                $modalInstance.close();
            };
        }]);
