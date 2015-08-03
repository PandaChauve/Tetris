angular.module('angularApp.controllers')
    .controller('UserMenuCtrl', ['$scope', '$modal', '$timeout', 'userAccount', function ($scope, $modal, $timeout, userAccount) {
        "use strict";
        $scope.registered = (userAccount.username !== null);
        $scope.userName = userAccount.username;
        $scope.resetState = function resetState(e){
            $timeout(function() {
                $scope.registered = (e !== null);
                $scope.userName = e;
            }, 0);
        };
        $scope.loginPopup = function(){
            $modal.open({
                animation: true,
                templateUrl: 'resources/templates/user/login.html',
                controller: 'LoginFormCtrl',
                size: 400
            });
        };
        $scope.logout = function logout(){
            userAccount.logout();
        };
        userAccount.registerToEvent($scope, $scope.resetState); //FIXME unregister on destroy !


    }]);
