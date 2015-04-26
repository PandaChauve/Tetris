/**
 * Created by panda on 26/04/2015.
 */


function VictoryChecker(config){
    "use strict";
    this.components = this.MakeComponents(config);
}

VictoryChecker.prototype.Check = function(tetris){
    "use strict";
    if(this.components.length === 0)
        return false;

    var victory = true;
    for(var i = 0; i < this.components.length; i+= 1){
        victory = this.components[i].Check(tetris) && victory; //make sure we always call check for memory based components
    }
    return victory;
};

VictoryChecker.prototype.MakeComponents = function(config){
    "use strict";
    var ret = [];
    if(config === null || config === undefined){
        return ret;
    }
    
    if(config.blocksLeft !== undefined){
        ret.push(new BlockChecker(config.blocksLeft));
    }
    if(config.score !== undefined){
        ret.push(new ScoreChecker(config.score));
    }
    return ret;
};

function ScoreChecker(val){
    "use strict";
    this.val = val;
}

ScoreChecker.prototype.Check = function(tetris){
    "use strict";
    return tetris.GetScore() >= this.val;
};


function BlockChecker(val){
    "use strict";
    this.val = val;
}

BlockChecker.prototype.Check = function(tetris){
    "use strict";
    return tetris.grid.BlockCount() <= this.val;
};