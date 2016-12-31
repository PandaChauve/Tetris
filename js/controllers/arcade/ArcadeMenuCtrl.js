angular.module('angularApp.controllers')
    .controller('ArcadeMenuCtrl', ['$scope', function ($scope) {
        "use strict";
        $scope.menu = ['Arcade 1p', 'Arcade 2p', 'Campaign'];
        $scope.selected = 0;
    }]);
