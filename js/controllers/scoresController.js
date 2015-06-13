angular.module('angularApp.controllers')
    .controller('ScoresCtrl', ['$scope', '$http','$timeout','userAccount','api', function ($scope, $http, $timeout, userAccount, api) {
        "use strict";
        $scope.isActive = function (viewLocation) {
            return viewLocation === $scope.type;
        };
        $scope.activate = function (type) {
            $scope.type = name;
            $scope.getScores(type);
        };
        $scope.currentName = userAccount.username;
        $scope.isUser = function(n){
            return n === $scope.currentName;
        };
        $scope.getScores = function (type) {
            api.getScores(type).success(function (data) {
                $scope.scoreGridData = data;
            }).error(function (e) {
                console.log(e);
            });
        };
        $scope.activate("classic");
        $scope.scoreTypes = [
            {type: "classic", name: "Classic"},
            {type: "ultralarge", name: "Wide"},
            {type: "small", name: "Narrow"},
            {type: "sandbox", name: "Sandbox"},
            {type: "ultralargecoop", name: "Coop"}
        ];
    }]);
