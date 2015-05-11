/**
 * Created by panda on 11/05/2015.
 */

var app = angular.module('indexApp', ['ui.grid']);
app.controller('ScoresCtrl', ['$scope', '$http', function ($scope, $http) {
    "use strict";
    $http.get("http://sylvain.luthana.be/api.php?get&map=classic").success(function(data){
        $scope.scoreGridData = data;
    });
}]);
