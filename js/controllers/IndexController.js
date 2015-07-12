angular.module('angularApp.controllers')
    .controller('IndexCtrl', ['$scope', '$modal', 'userAccount', function ($scope, $modal, userAccount) {
        "use strict";
        $scope.registered = (userAccount.username !== null);
        $scope.username = userAccount.username;
        $scope.loginPopup = function(){
            $modal.open({
                animation: true,
                templateUrl: 'templates/user/login.html',
                controller: 'LoginFormCtrl',
                size: 400
            });
        };
    }]);
