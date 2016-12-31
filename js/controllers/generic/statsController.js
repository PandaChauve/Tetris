angular.module('angularApp.controllers')
    .controller('StatCtrl', ['$window', '$scope','$routeParams', 'userStats','gameStatsFactory', 'storage', 'api', 'userAccount', function ($window, $scope, $routeParams, userStats, gameStatsFactory, storage, api, userAccount) {
    "use strict";
        $scope.redirect = function(){
            $window.location.href="#!/achievements/"+$scope.userName;
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

        function load(){
            $scope.isPositive = function (i) {
                return i > 0;
            };
            $scope.isActive = function (viewLocation) {
                return viewLocation === $scope.data.active;
            };
            $scope.activate = function (name) {
                $scope.data.active = name;
            };
            var CompleteData = function CompleteData(data) {
                data.best = userStats.getBestGameStats(data.link, store);
                data.sum = userStats.getTotalGameStats(data.link, store);
                return data;
            };
            var SumData = function SumData() {
                var i;
                var ret = {name: "Overall", link: ""};

                ret.best = gameStatsFactory.newGameStats();
                ret.sum = gameStatsFactory.newGameStats();
                for (i = 0; i < $scope.data.maps.length; i += 1) {
                    ret.best.keepBest($scope.data.maps[i].best);
                    ret.sum.append($scope.data.maps[i].sum);
                }
                return ret;
            };
            $scope.data = {active: "Classic"};
            $scope.data.maps = [];
            $scope.data.maps.push(CompleteData({name: "Classic", link: "classic"}));
            $scope.data.maps.push(CompleteData({name: "Narrow", link: "small"}));
            $scope.data.maps.push(CompleteData({name: "Wide", link: "ultralarge"}));
            $scope.data.maps.push(CompleteData({name: "SandBox", link: "sandbox"}));
            $scope.data.maps.push(CompleteData({name: "Coop", link: "ultralargecoop"}));
            $scope.data.maps.push(SumData());
        }

}]);

