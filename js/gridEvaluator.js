/**
 * Created by panda on 26/04/2015.
 */
GridEvaluator = function(){
    "use strict";
};

GridEvaluator.prototype.EvaluateColumn = function(container, i) {
    "use strict";
    var colorCount = 0;
    var color = null;
    var score = 0;
    for (var j = CONFIG.hiddenRowCount; j < container[i].length; j += 1) {
        if(container[i][j].state !== Block.EState.Blocked) {
            //only use fixed blocks
            colorCount = 0;
            color = null;
            //don't stop here we can create a line on a disappearing block !
        } else if (container[i][j].type !== color) {
            //New color reset
            color = container[i][j].type;
            colorCount = 1;
        } else {
            colorCount += 1;

            if (colorCount === 3) //color this one and the 2 previous
            {
                container[i][j].SetState(Block.EState.Disappearing);
                container[i][j - 1].SetState(Block.EState.Disappearing);
                container[i][j - 2].SetState(Block.EState.Disappearing);
                score += 1; //only 1 point for blocks of 3
            } else if (colorCount > 3) { // animationState
                container[i][j].SetState(Block.EState.Disappearing);
                score += 1;
            }
        }
    }
    return score;
};

GridEvaluator.prototype.EvaluateVertical = function (container){
    "use strict";
    var score = 0;
    //vertical check
    for (var i = 0; i < CONFIG.columnCount; i += 1) {
        score += this.EvaluateColumn(container, i);
    }
    return score;
};

GridEvaluator.prototype.FindBlockIndex = function(container, i,j) {
    "use strict";
    var index;
    for (index in container[i]) {
        if(container[i].hasOwnProperty(index) && container[i][index].verticalPosition === CONFIG.pixelPerBox * j){
            return parseInt(index);
        }
    }
    return -1;
};

GridEvaluator.prototype.EvaluateLine = function(container, j) {
    "use strict";
    var i, color, colorCount, score = 0, realJ = -1, realJP = -1, realJPP =-1;

    colorCount = 0;
    color = null;
    for (i = 0; i < CONFIG.columnCount; i += 1) {
        //keep previous ones to avoid finding them again
        realJPP = realJP;
        realJP = realJ;
        realJ = this.FindBlockIndex(container, i, j);

        if (realJ === -1) {
            colorCount = 0;
            continue;
        }

        var block = container[i][realJ];
        if(block.state === Block.EState.Blocked ||
            (block.state === Block.EState.Disappearing && block.animationState === 0)) {
            if (block.type !== color) {
                color = container[i][realJ].type;
                colorCount = 0;
            }

            colorCount += 1;

            if(colorCount === 3) //color this one and the 2 previous
            {
                container[i][realJ].SetState(Block.EState.Disappearing);
                container[i-1][realJP].SetState(Block.EState.Disappearing);
                container[i-2][realJPP].SetState(Block.EState.Disappearing);
                score +=1;
            } else if (colorCount > 3) {
                container[i][realJ].SetState(Block.EState.Disappearing);
                score +=1;
            }
        }
        else
        {
            colorCount = 0;
        }
    }
    return score;
};

GridEvaluator.prototype.EvaluateHorizontal = function(container){
    "use strict";
    var score = 0;

    //horizontal (this one is tricky)
    for (var j = CONFIG.hiddenRowCount; j < CONFIG.displayedRowCount + CONFIG.hiddenRowCount; j += 1) {
        score += this.EvaluateLine(container, j);
    }

    return score;
};

GridEvaluator.prototype.Evaluate = function (container) {
    'use strict';
    //vertical evaluation does not count block that start disappearing => call it before horizontal evaluation
    return this.EvaluateVertical(container) + this.EvaluateHorizontal(container);
};