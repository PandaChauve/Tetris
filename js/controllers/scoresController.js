angular.module('angularApp.controllers')
    .controller('ScoresCtrl', ['$scope', '$http','$timeout','userAccount', function ($scope, $http, $timeout, userAccount) {
        "use strict";
        $scope.isActive = function (viewLocation) {
            return viewLocation === $scope.type;
        };
        $scope.activate = function (type) {
            $scope.type = name;
            $scope.getScores(type);
        };
        $scope.currentName = userAccount.username;
        userAccount.registerToEvent($scope, function(e){
            $timeout(function() {
                $scope.currentName = e;
            }, 0);
        });
        $scope.isUser = function(n){
            return n === $scope.currentName;
        };
        $scope.getScores = function (type) {
            $http.get("http://sylvain.luthana.be/tetrisApi.php?get&map=" + type).success(function (data) {
                $scope.scoreGridData = data;
                console.log(data);
            }).error(function (e) {
                console.log(e);
            });
        };
        $scope.activate("classic");
        $scope.scoreTypes = [
            {type: "classic", name: "Classic"},
            {type: "ultralarge", name: "Wide"},
            {type: "sandbox", name: "Sandbox"},
            {type: "ultralargecoop", name: "Coop"}
        ];
    }]);
