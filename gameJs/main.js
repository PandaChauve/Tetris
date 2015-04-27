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



$("#retryBtn").click(function(){
    for(var i = 0; i < game.config.tetris.length; i+= 1) {
        $("#"+game.config.tetris[i].gameBox).html("");
    }
    game.Stop()
    var d = new Game(game.config, game.grid);
    game = d;
});

function UseGameConfig(config){
    "use strict";
    CONFIG = GetConfig(config.config);
    $("#rules").html(config.message);
    if(config.grid == ""){ // jshint ignore:line
        game = new Game(config, "");
        game.Start();
    } else {
        $.getJSON("grids/"+config.grid+".json", function(json) {
            game = new Game(config, json);
            game.Start();
        }).fail(function(jqxhr, textStatus, error) {console.log( textStatus + " : " + error );});
    }
}
function Render(timestamp){ //FIXME nothing to do here
    "use strict";
    game.render(timestamp);
}