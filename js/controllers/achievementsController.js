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
            for (var i = 0; i < achievements.List.enumSize; i += 1) {
                $scope.achievementsGridData.push({
                    Picture: "./resources/imgs/achievements/" + achievements.List.getName(i) + ".png",
                    Name: achievements.List.getName(i),
                    Success: achievements.isWon(i),
                    Description: achievements.List.getDescription(i)
                });
                if (achievements.isWon(i)) {
                    successCount += 1;
                }
            }

            $scope.percentComplete = successCount / achievements.List.enumSize * 100; //bad to put non object in the scope
            $scope.ieStyle = {'width': $scope.percentComplete + "%", 'min-width': '2em'};
        }
}]);
