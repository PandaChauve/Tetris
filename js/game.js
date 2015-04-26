/**
 * Created by panda on 23/04/2015.
 */
var gameName = getQueryVariable("game");
if(gameName === ""){
    gameName = "arcade";
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
        game.render();
    } else {
        $.getJSON("grids/"+config.grid+".json", function(json) {
            game = new Game(config, json);
            game.render();
        }).fail(function(jqxhr, textStatus, error) {console.log( textStatus + " : " + error );});
    }
}

function Render(){
    "use strict";
    game.render();
}


function Game(config, grid){
    "use strict";
    this.config = config;
    this.grid = grid;
    this.tetris = [];
    this.visual = [];
    this.kb = new UserInput();
    this.victoryChecker = new VictoryChecker(config.victory);
    this.tobefixed = [2, 2];
    this.stop = false;
    this.Init();
    this.render();
    this.id = -1;
}
Game.prototype.Stop = function(){
    "use strict";
    window.cancelAnimationFrame(this.id);
    this.stop = true;
    for(var i = 0; i < this.visual.length; i+=1){
        this.visual[i].clear();
        this.visual[i] = null;
    }
};

Game.prototype.Init = function(){
    "use strict";
    for(var i = 0; i < this.config.tetris.length; i+= 1){
        this.tetris.push(new Tetris(this.grid));
        for(var j = 0; j < this.config.tetris[i].mappings.length; j+=1){
            this.tetris[i].keyBoardMappings.push(UserInput[this.config.tetris[i].mappings[j]]);
        }
        this.visual.push(new ThreeRenderer());
        this.visual[i].LinkDom(document.getElementById(this.config.tetris[i].gameBox));
        this.visual[i].RenderTetris(this.tetris[i]); //first render before loop to get everything smooth
    }
};

Game.prototype.SplitScreenQuickFix = function () {
    "use strict";
    if (this.tetris.length === 2) {//FIXME
        while (this.tobefixed[0] < this.tetris[1].GetScore() / 3) {
            this.tobefixed[0] += 1;
            this.tetris[0].RandomFall();
        }

        while (this.tobefixed[1] < this.tetris[0].GetScore() / 3) {
            this.tobefixed[1] += 1;
            this.tetris[1].RandomFall();
        }
    }
};
Game.prototype.render = function () {
    "use strict";
    var continueGame = true;
    for(var i = 0; i < this.tetris.length; i += 1){
        var loc = this.tetris[i].OneTick(this.kb);
        this.visual[i].RenderTetris(this.tetris[i]);
        $("#"+this.config.tetris[i].scoreBox).html(this.tetris[i].GetScore());
        if(!loc){
            continueGame = false;
            this.visual[i].Freeze();
        }
        if(this.victoryChecker.Check(this.tetris[i])){
            continueGame = false;
            this.visual[i].Freeze();
            alert("you didn't lose !");
        }
    }

    if(continueGame && !this.stop) {
        this.id = requestAnimationFrame(Render);
    }
    this.kb.clear();


    this.SplitScreenQuickFix();
};