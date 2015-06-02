angular.module('angularApp.controllers')
    .controller('UserMenuCtrl', ['$scope', '$modal', '$timeout', 'userAccount', function ($scope, $modal, $timeout, userAccount) {
        "use strict";
        $scope.registered = (userAccount.username !== null);

        $scope.resetState = function resetState(e){
            $timeout(function() {
                $scope.registered = (e !== null);
            }, 0);
        };
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
        userAccount.registerToEvent($scope, $scope.resetState);


    }]);
