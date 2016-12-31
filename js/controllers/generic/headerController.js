angular.module('angularApp.controllers')
    .controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {
    "use strict";
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}]);
