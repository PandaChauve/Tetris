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
    this.stateChecker = new StateChecker(config.victory);
    this.tobefixed = [2, 2];
    this.stop = false;
    this.id = -1;
    this.start = null;
    this.pause = false;
    this.tics = 0;
    this.stats = new GameStats();
    this.stats.gameCount += 1;
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

Game.CreateRenderingFct = function(gam){
    return function(timestamp){
        gam.render(timestamp);
    };
};

Game.prototype.Start = function(){
    this.id = requestAnimationFrame(Game.CreateRenderingFct(this));
};

Game.prototype.Init = function(){
    "use strict";
    for(var i = 0; i < this.config.tetris.length; i+= 1){
        this.tetris.push(new Tetris(this.grid, this.config.tetris[i].cursors, this.stats));
        for(var j = 0; j < this.config.tetris[i].mappings.length; j+=1){
            this.tetris[i].keyBoardMappings.push(UserInput[this.config.tetris[i].mappings[j]]);
        }
        this.visual.push(new ThreeRenderer(this.config.tetris[i].cursors));
        this.visual[i].LinkDom(this.config.tetris[i].gameBox);
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
    if(this.stop){
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
        this.id = requestAnimationFrame(Game.CreateRenderingFct(this));
        this.start = null;
    }
    return this.pause;

};

Game.prototype.render = function (timestamp) {
    "use strict";
    var i;

    if(this.start === null) {
        this.start = timestamp - this.tics/60*1000;
    }
    var progress = timestamp - this.start;
    $(".timeBox").html(TimeFromTics(this.tics));


    var continueGame = true;
    var count = 0;
    while(this.tics < progress*60/1000 && continueGame && count < 10){ //60 tics per sec FIXME magic number
        count += 1;
        this.tics += 1;
        for(i = 0; i < this.tetris.length; i += 1){
            this.tetris[i].OneTick(this.kb);

            $("#"+this.config.tetris[i].scoreBox).html(this.tetris[i].GetScore());
            this.stateChecker.Check(this.tetris[i]);
            if(this.stateChecker.Defeat() || this.stateChecker.Victory()){
                continueGame = false;
                this.visual[i].Freeze();
            }
            else{
                if(this.config.victory !== undefined && this.config.victory.swaps !== undefined){
                    $("#"+this.config.tetris[i].swapBox).html(this.config.victory.swaps - this.tetris[i].GetSwaps());
                }
                else {
                    $("#"+this.config.tetris[i].swapBox).html(this.tetris[i].GetSwaps());
                }
            }
        }
        this.kb.clear();
    }

    if(continueGame && !this.stop) {
        for(i = 0; i < this.tetris.length; i+= 1){
            this.visual[i].RenderTetris(this.tetris[i]);
        }
        this.SplitScreenQuickFix();
        this.id = requestAnimationFrame(Game.CreateRenderingFct(this));
    }
    else if(!continueGame){
        if(this.callback !== null){
            this.callback(this);
        }
    }
};