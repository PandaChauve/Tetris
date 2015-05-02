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
    var scores = UserHighScores.GetHighScore();
    scores.SetArcadeScore(finishedGame.tetris[0].GetScore());
    var popup = $("<div id='gamePopup'></div>");

    if(finishedGame.stateChecker.lastSuccessCheck){
        popup.html("<h1>Gratz ! You did it !</h1>");
        if(game.config.next !== undefined && game.config.next !== ""){
            popup.html(popup.html() + "<p><a href='game.html?game="+game.config.next+"'>Try the next one ?</a></p>");
        }
    }
    else{
        popup.html("<h1>Sorry, you failed !</h1>");
        popup.html(popup.html() + "<p>At least you did : "+ finishedGame.tetris[0].GetScore()+" points.<br /><span id=\"tryAgain\" class='btn'>Do you want to try again ?</span></p>");
    }

    $('body').append(popup);

    $("#tryAgain").click(Reset);

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