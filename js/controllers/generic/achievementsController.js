angular.module('angularApp.controllers')
    .controller('AchievementsCtrl', ['$window','$scope', '$routeParams', 'api', 'achievements', 'storage', 'userAccount', function ($window, $scope, $routeParams, api, achievements, storage, userAccount) {
    "use strict";
        $scope.redirect = function(){
            $window.location.href="#!/stats/"+$scope.userName;
        };
        var store = storage;
        if($routeParams.userName)
        {
            api.loadExternalUser($routeParams.userName).success(function(data){
                if(data.success){
                    store = store.createTemp(data.data);
                    $scope.userName = data.name;
                    load();
                }
                else{
                    console.log(data.message);
                }
            }).error(function(e){console.log("Failed to load data for user "+$routeParams.userid+" "+e);});
        }
        else{
            load();
            $scope.userName = userAccount.username;
        }
        function load() {
            var successCount = 0;
            $scope.achievementsGridData = [];
            for (var i = 0; i < achievements.List.Ordered.length; i += 1) {
                $scope.achievementsGridData.push({
                    Picture: "./resources/imgs/achievements/" + achievements.List.getName(achievements.List.Ordered[i]) + ".png",
                    Name: achievements.List.getName(achievements.List.Ordered[i]),
                    Success: achievements.isWon(achievements.List.Ordered[i], store),
                    Description: achievements.List.getDescription(achievements.List.Ordered[i])
                });
                if (achievements.isWon(achievements.List.Ordered[i], store)) {
                    successCount += 1;
                }
            }

            $scope.percentComplete = successCount / achievements.List.enumSize * 100; //bad to put non object in the scope
            $scope.ieStyle = {'width': $scope.percentComplete + "%", 'min-width': '2em'};
        }
}]);
