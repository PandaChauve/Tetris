/**
 * Created by panda on 10/04/2015.
 */


function Tetris(grid) {
    'use strict';
    this.grid = new Grid(grid);
    this.score = 0;
    this.cursor = {x:3, y:CONFIG.hiddenRowCount};
    this.swapCount = 0;
    this.groundSpeed = CONFIG.groundSpeedPerTic;
    this.baseGroundSpeed = CONFIG.groundSpeedPerTic;
    this.groundPos = 0;
    this.keyBoardMappings = [];
    this.tics = 0;
}

Tetris.prototype.OneTick = function (kb) {
    'use strict';

    //check if don't have new successful combo
    this.score += this.grid.Evaluate();

    //user input
    this.HandleUserInput(kb);

    //random events
    this.tics += 1;
    if(CONFIG.fallPeriod !== 0 && this.tics % CONFIG.fallPeriod === 0){
        this.RandomFall();
    }

    //animate elements (move falling one, destroy complete ones, swap, etc...)
    this.grid.Animate();

    this.groundPos += this.groundSpeed;
    this.groundSpeed += CONFIG.groundAccelerationPerTic;
    this.baseGroundSpeed += CONFIG.groundAccelerationPerTic;

    if(this.groundPos >= CONFIG.pixelPerBox ){
        this.groundPos -= CONFIG.pixelPerBox;
        this.grid.AddNewLine();
        this.cursor.y += 1;
        this.groundSpeed = this.baseGroundSpeed;
    }

    return this.grid.GetMaxFixed() < CONFIG.lostThreshold;
};

Tetris.prototype.GetScore = function () {
    'use strict';
    return this.score;
};


function GetIntBetween(min, max){
    "use strict";
    return Math.floor(Math.random()*(max - min + 1)) + min;
}

Tetris.prototype.RandomFall = function(){
    "use strict";
    var size = 3;
    var start = GetIntBetween(0, CONFIG.columnCount - size);
    for(var i = start; i < start + size; i += 1){
        this.grid.NewBlockFall(i);
    }
};

Tetris.prototype.HandleUserInput = function(kb) {
    "use strict";

    for(var i = 0; i < this.keyBoardMappings.length; i += 1) {

        if (kb.pressed(this.keyBoardMappings[i].swap)) {
            if(this.grid.Swap(this.cursor.x, this.cursor.y)){
                this.swapCount += 1;
            }
        }
        if (kb.pressed(this.keyBoardMappings[i].down)) {
            this.cursor.y = Math.max(CONFIG.hiddenRowCount, this.cursor.y - 1);
        }
        if (kb.pressed(this.keyBoardMappings[i].up)) {
            this.cursor.y = Math.min(CONFIG.hiddenRowCount + CONFIG.displayedRowCount, this.cursor.y + 1);
        }
        if (kb.pressed(this.keyBoardMappings[i].left)) {
            this.cursor.x = Math.max(0, this.cursor.x - 1);
        }
        if (kb.pressed(this.keyBoardMappings[i].right)) {
            this.cursor.x = Math.min(CONFIG.columnCount - 2, this.cursor.x + 1); //-1 for zero based -1 for dual block switcher
        }
        if (kb.pressed(this.keyBoardMappings[i].speed)) {
            this.groundSpeed = CONFIG.groundUpSpeedPerTic;
        }
    }
};