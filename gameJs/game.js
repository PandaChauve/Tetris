/**
 * Created by panda on 23/04/2015.
 */

function Game(config, grid, cb){
    "use strict";
    this.config = config;
    this.grid = grid;
    this.tetris = [];
    this.visual = [];
    this.kb = new UserInput();
    this.victoryChecker = new VictoryChecker(config.victory);
    this.tobefixed = [2, 2];
    this.stop = false;
    this.id = -1;
    this.start = null;
    this.pause = false;
    if(cb === undefined){
        this.callback = null;
    }
    else{
        this.callback = cb;
    }
    this.Init();

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

Game.prototype.Start = function(){
    "use strict";
    this.id = requestAnimationFrame(Render);
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

Game.prototype.TogglePause = function(force){
    "use strict";
    if(this.game.stop){
        return false;
    }
    if(force === undefined){
        this.pause = !this.pause;
    }
    else{
        this.pause = force;
    }

    if(this.pause){
        window.cancelAnimationFrame(this.id);
    }
    else{
        this.id = requestAnimationFrame(Render);
        this.start = null;
    }
    return this.pause;

};

Game.prototype.render = function (timestamp) {
    "use strict";
    var i;

    if(this.start === null) {
        this.start = timestamp;
        this.tetris[0].tics = 0;
    }
    var progress = timestamp - this.start;


    var continueGame = true;
    var count = 0;
    while(this.tetris[0].tics < progress*60/1000 && continueGame && count < 10){ //60 tics per sec FIXME magic number
        count += 1;
        for(i = 0; i < this.tetris.length; i += 1){
            var loc = this.tetris[i].OneTick(this.kb);
            $("#"+this.config.tetris[i].scoreBox).html(this.tetris[i].GetScore());
            if(!loc){
                continueGame = false;
                this.visual[i].Freeze();
            }
            if(this.victoryChecker.Check(this.tetris[i])){
                continueGame = false;
                this.visual[i].Freeze();
            }
        }
        this.kb.clear();
    }

    if(continueGame && !this.stop) {
        for(i = 0; i < this.tetris.length; i+= 1){
            this.visual[i].RenderTetris(this.tetris[i]);
        }
        this.SplitScreenQuickFix();
        this.id = requestAnimationFrame(Render);
    }
    else if(!continueGame){
        if(this.callback !== null){
            this.callback(this);
        }
    }
};