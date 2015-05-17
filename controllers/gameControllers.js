//FIXME the move to angular is way too partial, some work is needed !

var gameControllers = angular.module('gameControllers', []);
gameControllers.controller('GameCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.gameName = $routeParams.name || "classic";
    $scope.config = {};
    $scope.game = null;
    $scope.config.splitScreen = $scope.gameName === "classicSplitScreen";
    $http.get("games/"+$scope.gameName+".json").success(function(json) {
        "use strict";
        $scope.useGameConfig(json);
    }).error(function(data, status, headers, config) { console.log( status + " : " + data );});

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
        $("#gamePopup").remove();
        for(var i = 0; i < $scope.game.config.tetris.length; i+= 1) {
            $("#"+$scope.game.config.tetris[i].gameBox).html("<div class='gamePlaceHolder'></div>");
        }
        $scope.game.Stop();
        $scope.game = new Game($scope.game.config, $scope.game.grid, $scope.endCallBack);
        $scope.game.Start();
    };

    $(window).blur(function() {
        "use strict";
        $scope.pause.message = "Play";
        $scope.game.TogglePause(true);
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

        var popup = new EndGameScreen( $scope.game.config, $scope.gameName);
        popup.SetRetryCallBack($scope.reset);
        popup.Display(finishedGame.stats, finishedGame.stateChecker.lastSuccessCheck);
    };
}]);
