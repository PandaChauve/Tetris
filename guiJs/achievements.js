/**
 * Created by panda on 11/05/2015.
 */

var app = angular.module('indexApp', ['ui.grid']);
app.controller('AchievementsCtrl', ['$scope', '$http', function ($scope, $http) {
    "use strict";
    var as = new AchievementsState();
    $scope.achievementsGridData = [];
    for(var i = 0; i < AchievementsState.List.enumSize; i+= 1){
        $scope.achievementsGridData.push({Name:AchievementsState.List.GetName(i), Status: as.IsWon(i)? "V" : "X", Description:AchievementsState.List.GetDescription(i)});
    }
}]);
/**
 * Created by panda on 13/05/2015.
 */
