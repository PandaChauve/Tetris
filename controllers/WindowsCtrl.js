
var angularApp = angular.module('angularApp.controllers');
angularApp.controller('WindowCtrl', function($scope, $location){
    "use strict";
    $scope.blur = function () {
        console.log("blur");
    };
});