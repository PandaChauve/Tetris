/**
 * Created by panda on 27/04/2015.
 */
var gameName = getQueryVariable("game");
if(gameName === ""){
    gameName = "classic";
}

var game;

$.getJSON("games/"+gameName+".json", function(json) {
    "use strict";
    UseGameConfig(json);
}).fail(function(jqxhr, textStatus, error) { console.log( textStatus + " : " + error );});

function Reset(){
    "use strict";
    $("#gamePopup").remove();
    for(var i = 0; i < game.config.tetris.length; i+= 1) {
        $("#"+game.config.tetris[i].gameBox).html("<div class='gamePlaceHolder'></div>");
    }
    game.Stop();
    var d = new Game(game.config, game.grid, EndCallBack);
    game = d;
    game.Start();
}

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

$(window).blur(function() {
    "use strict";
    game.TogglePause(true);
    $("#pauseBtn").html("Play");
});

function EndCallBack(finishedGame){
    "use strict";
    finishedGame.stats.SetTime(finishedGame.tics);
    finishedGame.stats.SetSwaps(finishedGame.tetris[0].swapCount);
    UserStats.GetUserStats().AddGame(finishedGame.stats, gameName);
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