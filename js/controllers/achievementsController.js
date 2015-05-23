angular.module('angularApp.controllers')
    .controller('AchievementsCtrl', ['$scope','achievements', function ($scope, achievements) {
    "use strict";
    var successCount = 0;
    $scope.achievementsGridData = [];
    for (var i = 0; i < achievements.List.enumSize; i += 1) {
        $scope.achievementsGridData.push({
            Picture: "./Resources/imgs/placeholder.png",
            Name: achievements.List.getName(i),
            Success: achievements.isWon(i),
            Description: achievements.List.getDescription(i)
        });
        if (achievements.isWon(i)) {
            successCount += 1;
        }
    }
    $scope.percentComplete = successCount / achievements.List.enumSize * 100; //bad to put non object in the scope
}]);
