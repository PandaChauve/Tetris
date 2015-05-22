var statsControllers = angular.module('angularApp.controllers');

statsControllers.controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
    "use strict";
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}]);
