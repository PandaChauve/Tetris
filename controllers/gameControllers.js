//FIXME the move to angular is way too partial, some work is needed !

var gameControllers = angular.module('angularApp.controllers');
gameControllers.controller('GameCtrl', ['$scope', '$http', '$route', '$routeParams','$modal', '$window', function ($scope, $http, $route, $routeParams, $modal, $window) {
    "use strict";
    //FIXME directive too much in the controller
    $scope.gameName = $routeParams.name || "classic";
    $scope.confi = {};
    $scope.game = null;
    $scope.confi.splitScreen = $scope.gameName === "classicSplitScreen";
    $scope.load = function(){
        $http.get("games/"+$scope.gameName+".json", { cache: false}).success(function(json) { //FIXME enable cache but i need to remove dom manipulations in jquery before
            $scope.useGameConfig(json);
        }).error(function(data) { console.log(data);});
    };
    $scope.load();
    $scope.pause = {
        toggle: function(){
            $scope.pause.active =  $scope.game.TogglePause();
        },
        active : false
    };
    $scope.$on('$routeChangeStart',function() {
        if($scope.game){
            $scope.game.Stop();
            $scope.game = null;
        }
    });
    $scope.reset = function(){
        $scope.game.Stop();
        $scope.game = new Game($scope.game.config, $scope.game.grid, $scope.endCallBack);
        $scope.game.Start();
    };
    angular.element($window).bind('blur', function(){
        return function () {
            if($scope.game){
                $scope.pause.active = true;
                $scope.game.TogglePause(true);
                $scope.$apply();//FIXME fear of god !
            }
        };
    }());
    $scope.useGameConfig = function(config){
        CONFIG = GetConfig(config.config);
        if(config.grid == ""){ // jshint ignore:line
            $scope.game = new Game(config, "", $scope.endCallBack);
            $scope.game.Start();
        } else {
            $http.get("grids/"+config.grid+".json", { cache: false}).success(function(json) { //FIXME enable cache but i need to remove dom manipulations in jquery before
                $scope.game = new Game(config, json, $scope.endCallBack);
                $scope.game.Start();
            }).error(function(error) {console.log(error );});
        }
    };
    $scope.endCallBack = function(finishedGame){
        finishedGame.stats.SetTime(finishedGame.tics);
        finishedGame.stats.SetSwaps(finishedGame.tetris[0].swapCount);
        var userstats = UserStats.GetUserStats();
        userstats.AddGame(finishedGame.stats, $scope.gameName);
        var as = new AchievementsState();
        as.check(finishedGame.stats, userstats, $scope.gameName);
        $scope.open(finishedGame.stateChecker.lastSuccessCheck, finishedGame.stats);
    };

    $scope.open = function (status, stats) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'templates/modal.html',
            controller: 'ModalInstanceCtrl',
            size: 300,
            resolve: {
                won:  function () {
                    return status;
                },
                gameName : function () {
                    return $scope.gameName;
                },
                statistics : function(){
                    return stats;
                }
            }
        });

        modalInstance.result.then(function () {
            if(status && $scope.game.config.next){

                $scope.gameName=$scope.game.config.next;
                $route.updateParams({name:$scope.gameName});
                $scope.load();
            }
            else{
                $scope.reset();
            }
        }, function () {

        });
    };
}]);


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

gameControllers.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'won', 'gameName', 'statistics', function ($scope, $modalInstance, won, gameName, statistics) {
    $scope.won = won;
    $scope.published = false;
    $scope.publish = function(){
        "use strict";
        if(!$scope.published)
        {
            $scope.published = true;
            var store = UserStorage.GetStorage();
            var name = store.Get("UserName") || "";

            name = prompt("Who are you ?", name);
            if(name){
                store.Set("UserName", name);

                var ciphertext = stringToHex(des ("wireshar", "yop"+stats.score, 1, 0)); //just for avoiding zfa on wireshark
                $.get("http://sylvain.luthana.be/api.php?add&name="+name+"&value="+ciphertext+"&map="+ gameName);
            }
            else{
                $scope.published = false;
            }
        }
    };

    $scope.nextGame = function () {
        $modalInstance.close();
    };

    $scope.stop = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.stats = (function(){
        "use strict";
        function GetMean(val, count, formater){
            if(formater === undefined) {
                formater = Math.floor;
            }
            return formater(val/count);
        }
        var userStats = UserStats.GetUserStats();
        var bg = userStats.GetBestGameStats(gameName);
        var tg = userStats.GetTotalGameStats(gameName);
        var ret = [];
        ret.push({name:"Score", value:stats.score, best:bg.score, sum:tg.score, mean: GetMean(tg.score, tg.gameCount)});
        ret.push({name:"Time", value:TimeFromTics(stats.time), best:TimeFromTics(bg.time), sum:TimeFromTics(tg.time), mean: GetMean(tg.time, tg.gameCount, TimeFromTics)});
        ret.push({name:"Blocks", value:stats.blockDestroyed, best:bg.blockDestroyed, sum:tg.blockDestroyed, mean: GetMean(tg.blockDestroyed, tg.gameCount)});
        ret.push({name:"Swaps", value:stats.swapCount, best:bg.swapCount, sum:tg.swapCount, mean: GetMean(tg.swapCount, tg.gameCount)});
        ret.push({name:"Efficiency", value:(stats.score/stats.swapCount).toFixed(2), best: "/", sum:"/", mean: (tg.score/tg.swapCount).toFixed(2)});
        return ret;
    })();


}]);