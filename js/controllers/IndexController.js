angular.module('angularApp.controllers')
    .controller('IndexCtrl', ['$scope', '$modal', function ($scope, $modal, userAccount) {
        "use strict";
        $scope.loginPopup = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'templates/user/login.html',
                controller: 'LoginFormCtrl',
                size: 400
            });
        };
    }]);
