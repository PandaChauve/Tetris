/**
 * Created by panda on 26/04/2015.
 */
GridEvaluator = function(stats){
    "use strict";
    this.series = [];
    this.stats = stats;
};

GridEvaluator.prototype.EvaluateColumn = function(container, i) {
    "use strict";
    var colorCount = 0;
    var color = null;
    var serie = -1;
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
                this.series.push([]);
                serie = this.series.length - 1;
                this.series[serie].push(container[i][j].id);
                this.series[serie].push(container[i][j-1].id);
                this.series[serie].push(container[i][j-2].id);
            } else if (colorCount > 3) { // animationState
                container[i][j].SetState(Block.EState.Disappearing);
                this.series[serie].push(container[i][j].id);
            }
        }
    }
};

GridEvaluator.prototype.EvaluateVertical = function (container){
    "use strict";
    //vertical check
    for (var i = 0; i < CONFIG.columnCount; i += 1) {
        this.EvaluateColumn(container, i);
    }
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
    var i, color, colorCount, realJ = -1, realJP = -1, realJPP =-1;
    colorCount = 0;
    color = null;
    var serie = -1;
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

                this.series.push([]);
                serie = this.series.length - 1;
                this.series[serie].push(container[i][realJ].id);
                this.series[serie].push(container[i-1][realJP].id);
                this.series[serie].push(container[i-1][realJPP].id);

            } else if (colorCount > 3) {
                container[i][realJ].SetState(Block.EState.Disappearing);
                this.series[serie].push(container[i][realJ].id);
            }
        }
        else
        {
            colorCount = 0;
        }
    }
};

GridEvaluator.prototype.EvaluateHorizontal = function(container){
    "use strict";
    //horizontal (this one is tricky)
    for (var j = CONFIG.hiddenRowCount; j < CONFIG.displayedRowCount + CONFIG.hiddenRowCount; j += 1) {
        this.EvaluateLine(container, j);
    }
};

GridEvaluator.prototype.GetScore = function(){
    "use strict";
    var multi = this.series.length;
    var score = 0;
    for(var i = 0; i < multi; i += 1){
        score += (this.series[i].length -2)*multi;
    }
    this.stats.AddLines(this.series, score);
    return score;
};

GridEvaluator.prototype.GetSerie = function(id, max){
    "use strict";
    for(var i = max-1; i >= 0; i -= 1){
        for(var j = 0; j < this.series[i].length; j += 1){
            if(this.series[i][j] === id){
                return i;
            }
        }
    }
    return -1;
};

GridEvaluator.prototype.MergeSeries = function(){
    "use strict";

    for(var i = this.series.length-1; i >= 0; i -= 1){
        for(var j = 0; j < this.series[i].length; j += 1){
            var existingSerie = this.GetSerie(this.series[i][j], i);
            if(existingSerie !== -1){
                this.series[existingSerie] = this.series[existingSerie].concat(this.series[i]);
                this.series.splice(i, 1);
                break;
            }
        }
    }
};

GridEvaluator.prototype.Evaluate = function (container) {
    'use strict';
    //vertical evaluation does not count block that start disappearing => call it before horizontal evaluation
    this.EvaluateVertical(container);
    this.EvaluateHorizontal(container);
    this.MergeSeries();
    return this.GetScore();
};