angular.module('angularApp.controllers')
    .controller('AchievementsCtrl', ['$scope', '$routeParams', 'api', 'achievements', 'storage', 'userAccount', function ($scope, $routeParams, api, achievements, storage, userAccount) {
    "use strict";
        if($routeParams.userid && userAccount.id == 1) //admin only
        {
            api.loadExternalUser($routeParams.userid).success(function(data){
                console.log("loading data from : "+ data.name);
                storage.impersonate(data.data);
                try{
                    load();
                }
                catch(e){
                    console.log(e);
                }
                storage.restore();
            });
        }
        else{
            load();
        }
        function load() {
            var successCount = 0;
            $scope.achievementsGridData = [];
            for (var i = 0; i < achievements.List.Ordered.length; i += 1) {
                $scope.achievementsGridData.push({
                    Picture: "./resources/imgs/achievements/" + achievements.List.getName(achievements.List.Ordered[i]) + ".png",
                    Name: achievements.List.getName(achievements.List.Ordered[i]),
                    Success: achievements.isWon(achievements.List.Ordered[i]),
                    Description: achievements.List.getDescription(achievements.List.Ordered[i])
                });
                if (achievements.isWon(achievements.List.Ordered[i])) {
                    successCount += 1;
                }
            }

            $scope.percentComplete = successCount / achievements.List.enumSize * 100; //bad to put non object in the scope
            $scope.ieStyle = {'width': $scope.percentComplete + "%", 'min-width': '2em'};
        }
}]);
