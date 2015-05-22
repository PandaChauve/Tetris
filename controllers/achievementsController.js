var statsControllers = angular.module('angularApp.controllers');
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
