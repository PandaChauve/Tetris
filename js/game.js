/**
 * Created by panda on 23/04/2015.
 */
var gameName = getQueryVariable("game");
if(gameName === ""){
    gameName = "arcade";
}

$.getJSON("games/"+gameName+".json", function(json) {
    "use strict";
    UseGameConfig(json);
}).fail(function(jqxhr, textStatus, error) { console.log( textStatus + " : " + error );});

function UseGameConfig(config){
    "use strict";
    if(config.grid == ""){ // jshint ignore:line
        Game(config, "");
    } else {
        $.getJSON("grids/"+config.grid+".json", function(json) {
            Game(config, json);
        }).fail(function(jqxhr, textStatus, error) {console.log( textStatus + " : " + error );});
    }
}

function Game(config, grid){
    "use strict";
    CONFIG = GetConfig(config.config);
    var tetris = [];
    var visual = [];
    var kb = new UserInput();
    var length = config.tetris.length;
    var tobefixed = [];
    for(var i = 0; i < length; i+= 1){
        tetris.push(new Tetris(grid));
        for(var j = 0; j < config.tetris[i].mappings.length; j++){
            tetris[i].keyBoardMappings.push(UserInput[config.tetris[i].mappings[j]]);
        }
        visual.push(new ThreeRenderer());
        visual[i].LinkDom(document.getElementById(config.tetris[i].gameBox));
        tobefixed.push(2);
    }

    var render = function () {

        for(var i = 0; i < length; i += 1) {
            visual[i].RenderTetris(tetris[i]);
            $("#"+config.tetris[i].scoreBox).html(tetris[i].GetScore());
        }

        var success = true;
        for(i = 0; i < length; i += 1){
            var loc = tetris[i].OneTick(kb);
            if(!loc){
                success = false;
                visual[i].Freeze();
            }
        }

        if(success) {
            requestAnimationFrame(render);
        }
        kb.clear();


        if(length === 2) {//FIXME
            while(tobefixed[0] < tetris[1].GetScore()/3){
                tobefixed[0] += 1;
                tetris[0].RandomFall();
            }

            while(tobefixed[1] < tetris[0].GetScore()/3){
                tobefixed[1] += 1;
                tetris[1].RandomFall();
            }
        }
    };

    render();
}
