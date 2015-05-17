//FIXME the move to angular is way too partial, some work is needed !

var gameControllers = angular.module('gameControllers', ['ui.bootstrap']);
gameControllers.controller('GameCtrl', ['$scope', '$http', '$routeParams','$modal', function ($scope, $http, $routeParams, $modal) {
    $scope.gameName = $routeParams.name || "classic";
    $scope.config = {};
    $scope.game = null;
    $scope.config.splitScreen = $scope.gameName === "classicSplitScreen";
    $scope.load = function(){
        "use strict";
        $http.get("games/"+$scope.gameName+".json").success(function(json) {
            "use strict";
            $scope.useGameConfig(json);
        }).error(function(data, status, headers, config) { console.log( status + " : " + data );});
    };
    $scope.load();
    $scope.pause = {
        toggle: function(){
            "use strict";
            var ret = $scope.game.TogglePause();

            if(ret){
                $scope.pause.message = ("Play");
            }
            else{
                $scope.pause.message = ("Pause");
            }
        },
        message : "Pause"
    };

    $scope.reset = function(){
        "use strict";
        for(var i = 0; i < $scope.game.config.tetris.length; i+= 1) {
            $("#"+$scope.game.config.tetris[i].gameBox).html("<div class='gamePlaceHolder'></div>");
        }
        $scope.game.Stop();
        $scope.game = new Game($scope.game.config, $scope.game.grid, $scope.endCallBack);
        $scope.game.Start();
    };

    $(window).blur(function() {
        "use strict";
        if($scope.game){
            $scope.pause.message = "Play";
            $scope.game.TogglePause(true);
        }
    });

    $scope.useGameConfig = function(config){
        "use strict";
        CONFIG = GetConfig(config.config);
        if(config.grid == ""){ // jshint ignore:line
            $scope.game = new Game(config, "", $scope.endCallBack);
            $scope.game.Start();
        } else {
            $.getJSON("grids/"+config.grid+".json", function(json) {
                $scope.game = new Game(config, json, $scope.endCallBack);
                $scope.game.Start();
            }).fail(function(jqxhr, textStatus, error) {console.log( textStatus + " : " + error );});
        }
    };
    $scope.endCallBack = function(finishedGame){
        "use strict";
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
                stats : function(){
                    "use strict";
                    return stats;
                }
            }
        });

        modalInstance.result.then(function () {
            if(status && $scope.game.config.next){
                $scope.gameName=$scope.game.config.next;
                $scope.load();
            }
            else{
                $scope.reset();
            }
        }, function () {
            "use strict";

        });
    };
}]);


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

gameControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, won, gameName, stats) {
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
                $.get("http://sylvain.luthana.be/api.php?add&name="+name+"&value="+stats.score+"&map="+ map);
            }
            else{
                $scope.published = false;
            }
        }
    };

    $scope.continue = function () {
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
        ret.push({name:"Swaps", value:stats.swapCount, best:bg.swapCount, sum:tg.swapCount, mean: GetMean(tg.swapCount, tg.swapCount)});
        return ret;
    })();


});