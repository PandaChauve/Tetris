angular.module('angularApp.controllers')
    .controller('StatCtrl', ['$scope','userStats','gameStatsFactory', function ($scope, userStats, gameStatsFactory) {
    "use strict";
    $scope.isPositive = function (i) {
        return i > 0;
    };
    $scope.isActive = function (viewLocation) {
        return viewLocation === $scope.data.active;
    };
    $scope.activate = function (name) {
        $scope.data.active = name;
    };
    var CompleteData = function CompleteData(data) {
        data.best = userStats.getBestGameStats(data.link);
        data.sum = userStats.getTotalGameStats(data.link);
        return data;
    };
    var SumData = function SumData() {
        var i;
        var ret = {name: "Overall", link: ""};

        ret.best = gameStatsFactory.newGameStats();
        ret.sum = gameStatsFactory.newGameStats();
        for (i = 0; i < $scope.data.maps.length; i += 1) {
            ret.best.keepBest($scope.data.maps[i].best);
            ret.sum.append($scope.data.maps[i].sum);
        }
        return ret;
    };
    $scope.data = {active: "Classic"};
    $scope.data.maps = [];
    $scope.data.maps.push(CompleteData({name: "Classic", link: "classic"}));
    $scope.data.maps.push(CompleteData({name: "Wide", link: "ultralarge"}));
    $scope.data.maps.push(CompleteData({name: "SandBox", link: "sandbox"}));
    $scope.data.maps.push(CompleteData({name: "Coop", link: "ultralargecoop"}));
    $scope.data.maps.push(SumData());
}]);

