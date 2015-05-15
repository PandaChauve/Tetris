//FIXME the move to angular is way too partial, some work is needed !
var gameName;
var game;

var gameControllers = angular.module('gameControllers', []);
gameControllers.controller('GameCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    gameName = $routeParams.name || "classic";
    $scope.config = {};
    $scope.config.splitScreen = gameName === "classicSplitScreen";
    $http.get("games/"+gameName+".json").success(function(json) {
        "use strict";
        UseGameConfig(json);
    }).error(function(data, status, headers, config) { console.log( status + " : " + data );});

    $("#retryBtn").click(Reset);

    $("#pauseBtn").click(function(){
        "use strict";
        var ret = game.TogglePause();
        if(ret){
            $("#pauseBtn").html("Play");
        }
        else{
            $("#pauseBtn").html("Pause");
        }
    });
}]);


function Reset(){
    "use strict";
    $("#gamePopup").remove();
    for(var i = 0; i < game.config.tetris.length; i+= 1) {
        $("#"+game.config.tetris[i].gameBox).html("<div class='gamePlaceHolder'></div>");
    }
    game.Stop();
    game = new Game(game.config, game.grid, EndCallBack);
    game.Start();
}


$(window).blur(function() {
    "use strict";
    game.TogglePause(true);
    $("#pauseBtn").html("Play");
});

function EndCallBack(finishedGame){
    "use strict";
    finishedGame.stats.SetTime(finishedGame.tics);
    finishedGame.stats.SetSwaps(finishedGame.tetris[0].swapCount);
    var userstats = UserStats.GetUserStats();
    userstats.AddGame(finishedGame.stats, gameName);
    var as = new AchievementsState();
    as.check(finishedGame.stats, userstats, gameName);

    var popup = new EndGameScreen(game.config, gameName);
    popup.SetRetryCallBack(Reset);
    popup.Display(finishedGame.stats, finishedGame.stateChecker.lastSuccessCheck);
}

function UseGameConfig(config){
    "use strict";
    CONFIG = GetConfig(config.config);
    if(config.grid == ""){ // jshint ignore:line
        game = new Game(config, "", EndCallBack);
        game.Start();
    } else {
        $.getJSON("grids/"+config.grid+".json", function(json) {
            game = new Game(config, json, EndCallBack);
            game.Start();
        }).fail(function(jqxhr, textStatus, error) {console.log( textStatus + " : " + error );});
    }
}
function Render(timestamp){ //FIXME nothing to do here
    "use strict";
    game.render(timestamp);
}