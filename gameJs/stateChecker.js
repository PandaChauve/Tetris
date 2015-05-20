/**
 * Created by panda on 26/04/2015.
 */


function StateChecker(config) {
    "use strict";
    this.defeatComponents = [];
    this.succesComponents = [];
    this.MakeComponents(config);
    this.defeatComponents.push(new PillarSizeChecker()); //after make
    this.lastSuccessCheck = false;
    this.lastDefeatCheck = false;
}

StateChecker.prototype.Defeat = function () {
    "use strict";
    return this.lastDefeatCheck;
};

StateChecker.prototype.Victory = function () {
    "use strict";
    return this.lastSuccessCheck;
};

StateChecker.prototype.Check = function (tetris) {
    "use strict";

    this.lastSuccessCheck = this.succesComponents.length !== 0; // && start at true (except if you can't win)
    this.lastDefeatCheck = false;                         // ||

    for (var i = 0; i < this.succesComponents.length; i += 1) {
        this.lastSuccessCheck = this.succesComponents[i].Check(tetris) && this.lastSuccessCheck; //make sure we always call check for memory based components
    }

    for (i = 0; i < this.defeatComponents.length; i += 1) {
        this.lastDefeatCheck = this.defeatComponents[i].Check(tetris) || this.lastDefeatCheck; //make sure we always call check for memory based components
    }
    return;
};

StateChecker.prototype.MakeComponents = function (config) {
    "use strict";
    $("#rules").html("<ul />");
    if (config === null || config === undefined) {
        $("#rules ul").append($("<li class='succesCond'>Try to stay alive !</li>"));
        return;
    }

    if (config.blocksLeft !== undefined) {
        this.succesComponents.push(new BlockChecker(config.blocksLeft));
    }
    if (config.score !== undefined) {
        this.succesComponents.push(new ScoreChecker(config.score));
    }
    if (config.swaps !== undefined) {
        this.defeatComponents.push(new SwapChecker(config.swaps));
    }
    if (config.time !== undefined) {
        this.defeatComponents.push(new TimeChecker(config.time));
    }
};

function PillarSizeChecker() {
    "use strict";
    $("#rules ul").append($("<li class='defeatCond'></li>"));
}

PillarSizeChecker.prototype.Check = function (tetris) {
    "use strict";
    return tetris.GetMaxFixed() >= CONFIG.lostThreshold;
};


function ScoreChecker(val) {
    "use strict";
    $("#rules ul").append($("<li class='successCond'>Get " + val + " points</li>"));
    this.val = val;
}

ScoreChecker.prototype.Check = function (tetris) {
    "use strict";
    return tetris.GetScore() >= this.val;
};


function BlockChecker(val) {
    "use strict"; 
    if (val === 0) {
        $("#rules ul").append($("<li class='successCond'>Destroy each block</li>"));
    } else {
        $("#rules ul").append($("<li class='successCond'>Reduce the block count to " + val + "</li>"));
    }
    this.val = val;
}

BlockChecker.prototype.Check = function (tetris) {
    "use strict";
    return tetris.grid.BlockCount() <= this.val;
};

function SwapChecker(val) {
    "use strict";
    $("#rules ul").append($("<li class='defeatCond'>Max " + val + " swaps</li>"));
    this.val = val;
}

SwapChecker.prototype.Check = function (tetris) {
    "use strict";
    return tetris.swapCount > this.val;
};

function TimeChecker(val) {
    "use strict";
    $("#rules ul").append($("<li class='defeatCond'>Max " + val + " seconds</li>"));
    this.val = val;
}

TimeChecker.prototype.Check = function (tetris) {
    "use strict";
    return tetris.tics / TIC_PER_SEC > this.val;
};
