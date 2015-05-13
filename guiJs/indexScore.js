/**
 * Created by panda on 11/05/2015.
 */

var app = angular.module('indexApp', ['ui.grid']);
app.controller('ScoresCtrl', ['$scope', '$http', function ($scope, $http) {
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
