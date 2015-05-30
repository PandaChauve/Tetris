angular.module('angularApp.controllers')
    .controller('UserMenuCtrl', ['$scope', '$modal', 'userAccount', function ($scope, $modal, userAccount) {
        "use strict";
        $scope.registered = false;
        resetState();
        $scope.loginPopup = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'templates/login.html',
                controller: 'LoginFormCtrl',
                size: 400
            });
        };
        $scope.logout = function logout(){
            userAccount.logout();
        };

        $scope.$on("registerChange", resetState);

        function resetState(){
            $scope.registered = userAccount.isRegistered();
        }
    }]);
