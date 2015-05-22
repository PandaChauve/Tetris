var statsControllers = angular.module('angularApp.controllers');

statsControllers.controller('StatCtrl', ['$scope', function ($scope) {
    "use strict";
    var us = UserStats.GetUserStats();
    $scope.isPositive = function (i) {
        return i > 0;
    };
    $scope.isActive = function (viewLocation) {
        return viewLocation === $scope.data.active;
    };
    $scope.activate = function (name) {
        $("#" + $scope.data.active).hide();
        $("#" + name).show();
        $scope.data.active = name;
    };
    var CompleteData = function CompleteData(data) {
        data.best = us.GetBestGameStats(data.link);
        data.sum = us.GetTotalGameStats(data.link);
        return data;
    };
    var SumData = function SumData() {
        var i;
        var ret = {name: "Overall", link: ""};
        ret.best = new GameStats();
        ret.sum = new GameStats();
        for (i = 0; i < $scope.data.maps.length; i += 1) {
            GameStats.KeepBest(ret.best, $scope.data.maps[i].best);
            GameStats.Append(ret.sum, $scope.data.maps[i].sum);
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

