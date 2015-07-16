angular.module('angularApp.controllers')
    .controller('ScoresCtrl', ['$scope', '$http','$timeout','userAccount','api', function ($scope, $http, $timeout, userAccount, api) {
        "use strict";
        $scope.activate = function (type) {
            $scope.type = type;
            $scope.getScores(type);
        };
        $scope.isActive = function (viewLocation) {
            return viewLocation === $scope.type;
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
        $scope.scoreTypes = [
            {type: "classic", name: "Classic"},
            {type: "small", name: "Narrow"},
            {type: "ultralarge", name: "Wide"},
            {type: "sandbox", name: "Sandbox"}
        ];
        $scope.activate("classic");

    }]);
