var statsControllers = angular.module('statsControllers', ['ui.grid']);
statsControllers.controller('ScoresCtrl', ['$scope', '$http', function ($scope, $http) {
    "use strict";
    $scope.getScores = function (type) {
        $http.get("http://sylvain.luthana.be/api.php?get&map=" + type).success(function (data) {
            $scope.scoreGridData = data;
        });
    };
    $scope.getScores("classic");
    $scope.scoreTypes = [
        {type: "classic", name: "Classic"},
        {type: "ultralarge", name: "Wide"},
        {type: "sandbox", name: "Sandbox"},
        {type: "ultralargecoop", name: "Coop"}
    ];
}]);

statsControllers.controller('AchievementsCtrl', ['$scope', function ($scope) {
    "use strict";
    var as = new AchievementsState();
    var successCount = 0;
    $scope.achievementsGridData = [];
    for (var i = 0; i < AchievementsState.List.enumSize; i += 1) {
        $scope.achievementsGridData.push({
            Picture: "./Resources/imgs/placeholder.png",
            Name: AchievementsState.List.GetName(i),
            Success: as.IsWon(i),
            Description: AchievementsState.List.GetDescription(i)
        });
        if (as.IsWon(i)) {
            successCount += 1;
        }
    }
    $scope.percentComplete = successCount / AchievementsState.List.enumSize * 100; //bad to put non object in the scope
}]);


statsControllers.controller('StatCtrl', ['$scope', function ($scope) {
    "use strict";
    var us = UserStats.GetUserStats();
    $scope.isActive = function (viewLocation) {
        return viewLocation === $scope.data.active;
    };
    $scope.isPositive = function(i){
        return i > 0;
    };
    $scope.activate = function (name) {
        $("#" + $scope.data.active).hide();
        $("#" + name).show();
        $scope.data.active = name;
    };
    var CompleteData = function CompleteData(data){
        data.best = us.GetBestGameStats(data.link);
        data.sum = us.GetTotalGameStats(data.link);
        return data;
    };
    var SumData = function SumData(){
        var i;
        var ret = {name: "Overall", link: ""};
        ret.best = new GameStats();
        ret.sum =  new GameStats();
        for(i = 0; i < $scope.data.maps.length; i+= 1){
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

