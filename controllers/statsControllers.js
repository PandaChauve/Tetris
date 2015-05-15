
var statsControllers = angular.module('statsControllers', ['ui.grid']);
statsControllers.controller('ScoresCtrl', ['$scope', '$http', function ($scope, $http) {
    "use strict";
    $scope.getScores = function(type){
        $http.get("http://sylvain.luthana.be/api.php?get&map="+type).success(function(data){
            $scope.scoreGridData = data;
        });
    };
    $scope.getScores("classic");
    $scope.scoreTypes = [
        {type:"classic", name:"Classic"},
        {type:"ultralarge", name:"Wide"},
        {type:"sandbox", name:"Sandbox"},
        {type:"ultralargecoop", name:"Coop"}
    ];
}]);

statsControllers.controller('AchievementsCtrl', ['$scope', function ($scope) {
    "use strict";
    var as = new AchievementsState();
    $scope.achievementsGridData = [];
    for(var i = 0; i < AchievementsState.List.enumSize; i+= 1){
        $scope.achievementsGridData.push({Name:AchievementsState.List.GetName(i), Status: as.IsWon(i)? "V" : "X", Description:AchievementsState.List.GetDescription(i)});
    }
}]);


statsControllers.controller('TestCtrl', ['$scope', function ($scope) {
    "use strict";
    var as = new Notifications();
    as.notify("test");
}]);

