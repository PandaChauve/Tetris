/**
 * Created by panda on 15/04/2015.
 */

function Grid(content) {
    'use strict';
    var i, j, random = CONFIG.groundUpSpeedPerTic !== 0 || CONFIG.groundSpeedPerTic !== 0;
    this.container = new Array(CONFIG.columnCount);

    for (i = 0; i < CONFIG.columnCount; i += 1) { //move it to generic constructor
        this.container[i] = new Array(CONFIG.hiddenRowCount);
        for (j = 0; j < this.container[i].length; j += 1) {
            this.container[i][j] = new Block();
            this.container[i][j].verticalPosition = j * CONFIG.pixelPerBox;
            if(!random){
                this.container[i][j].type = Block.EType.PlaceHolder;
                this.container[i][j].state = Block.EState.Blocked;
            }
        }
    }

    if(content === undefined || content === ""){ //add random
        for (i = 0; i < CONFIG.columnCount; i += 1) {
            for (j = this.container[i].length; j < CONFIG.startRows; j += 1) {
                this.container[i].push(new Block());
                this.container[i][j].verticalPosition = j * CONFIG.pixelPerBox;
            }
        }
    }
    else
    {
        this.Load(content);
    }
}
Grid.prototype.AddNewLine = function() {
    "use strict";
    var i, j;
    for (i = 0; i < CONFIG.columnCount; i += 1) {
        for (j = 0; j < this.container[i].length; j += 1) {
            this.container[i][j].verticalPosition += CONFIG.pixelPerBox;
        }
        this.container[i].unshift(new Block());
    }
};

//remove at pos in array
Grid.prototype.RemoveBlockFixed = function(i, index){
    "use strict";

    var block = this.container[i][index];
    //remove the block from i
    this.container[i].splice(index, 1);
    this.MakeTopBlockFall (i, index);
    return block;
};

//remove at graphical pos
Grid.prototype.RemoveBlock = function(i, j) {
    "use strict";
    var index = this.FindBlockIndex(i,j);
    if(index === -1){
        throw "Not my day";
    }
    return this.RemoveBlockFixed(i, index);
};

Grid.prototype.InsertBlock = function(block, i){
    "use strict";
    for (var j = 0; j < this.container[i].length; j += 1) {
        if(this.container[i][j].verticalPosition > block.verticalPosition){
            this.container[i].splice(j,0,block);
            return;
        }
    }
    this.container[i].push(block);
};


Grid.prototype.FindBlock = function(i,j) {
    "use strict";
    var index = this.FindBlockIndex(i, j);
    if (index === -1) {
        return null;
    }
    return this.container[i][index];
};

Grid.prototype.FindBlockIndex = function(i,j) {
    "use strict";
    var index;
    for (index in this.container[i]) {
        if(this.container[i].hasOwnProperty(index) && this.container[i][index].verticalPosition === CONFIG.pixelPerBox * j){
            return parseInt(index);
        }
    }
    return -1;
};

Grid.prototype.IsBlockIndexFree = function(i,j) {
    "use strict";
    var index;
    for (index in this.container[i]) {
        if(this.container[i].hasOwnProperty(index) &&
            this.container[i][index].verticalPosition >= CONFIG.pixelPerBox * j &&
            this.container[i][index].verticalPosition < CONFIG.pixelPerBox * (j + 1)){
            return false;
        }
    }
    return true;
};


Grid.prototype.MakeTopBlockFall = function (i, j) {
    "use strict";
    if(j < 0){
        throw "Not my day";
    }
    //blocks on top will fall
    for (var z = j; z < this.container[i].length; z += 1) {
        if (this.container[i][z].state !== Block.EState.Blocked) {
            break;
        }
        this.container[i][z].SetState(Block.EState.Falling);
    }
};

Grid.prototype.AnimateBlockFall = function (i, j,block, minY) {
    "use strict";
    block.verticalPosition -= CONFIG.fallSpeedPerTic;
    if (block.verticalPosition < minY) {
        block.verticalPosition = minY;
        if(this.container[i][j-1].state !== Block.EState.Falling) //by sliding it can be stoping the fall without being lower
            block.SetState(Block.EState.Blocked);
    }
    return {min: block.verticalPosition + CONFIG.pixelPerBox, deltaY:0};
};

Grid.prototype.AnimateBlockDisappear = function (i, j, block, minY) {
    "use strict";
    block.animationState += 1;
    if (block.animationState > 100 && block.id === -1) {
        //remove it
        this.container[i].splice(j, 1);
        this.MakeTopBlockFall(i, j);
        return {min: minY, deltaY:-1};
    }
    return {min: block.verticalPosition + CONFIG.pixelPerBox, deltaY:0};
};

Grid.prototype.AnimateSwapped = function (i, j, block, minY) {
    "use strict";
    block.animationState += 15;
    if(block.animationState > 100) {
        if(block.type === Block.EType.PlaceHolder){
            this.RemoveBlockFixed(i, j); //remove this block in particular
            return {min: minY, deltaY:-1};
        }
        else if(this.container[i][j-1].state === Block.EState.Falling ||this.container[i][j-1].verticalPosition < block.verticalPosition - CONFIG.pixelPerBox)
        {
            block.SetState(Block.EState.Falling);
            this.MakeTopBlockFall(i, j+1);
        }
        else
        {
            block.SetState(Block.EState.Blocked);
        }
    }
    return {min: block.verticalPosition + CONFIG.pixelPerBox, deltaY:0};
};


Grid.prototype.AnimateBlock = function(i, j, minY) {
    "use strict";

    var block = this.container[i][j];
    switch (block.state) {
        case Block.EState.Blocked:
            return {min: block.verticalPosition + CONFIG.pixelPerBox, deltaY:0};
        case Block.EState.Disappearing:
            return this.AnimateBlockDisappear(i, j, block, minY);
        case Block.EState.Falling:
            return this.AnimateBlockFall(i, j, block, minY);
        case Block.EState.SwappedRight:
        case Block.EState.SwappedLeft:
            return this.AnimateSwapped(i, j, block, minY);
    }
    throw "Unsupported animation";
};

Grid.prototype.AnimateColumn = function(i){
    "use strict";
    var j, minY, tmp;
    minY = CONFIG.hiddenRowCount*CONFIG.pixelPerBox;
    for (j = CONFIG.hiddenRowCount; j < this.container[i].length; j += 1) {
        tmp = this.AnimateBlock(i, j, minY);
        minY = tmp.min;
        j += tmp.deltaY;
    }
};

Grid.prototype.Animate = function() {
    "use strict";
    for (var i = 0; i < CONFIG.columnCount; i += 1) {
        this.AnimateColumn(i);
    }
};

Grid.prototype.GetMaxFixed = function () {
    'use strict';
    var i, j, max = 0;
    //vertical check
    for (i = 0; i < CONFIG.columnCount; i += 1) {
        for (j = CONFIG.hiddenRowCount; j < this.container[i].length; j += 1) {
            if(this.container[i][j].state !== Block.EState.Blocked){
                break;
            }
            if(this.container[i][j].verticalPosition > max) {
                max = this.container[i][j].verticalPosition;
            }
        }
    }
    return max;
};

Grid.prototype.NewBlockFall = function (i) {
    "use strict";
    var b = new Block();
    b.SetState(Block.EState.Falling);
    b.verticalPosition = (CONFIG.hiddenRowCount + CONFIG.displayedRowCount + 1) * CONFIG.pixelPerBox;
    this.container[i].push(b);
};

Grid.prototype.Swap = function (x, y) {
    'use strict';
    var left = this.FindBlock(x, y);
    var right = this.FindBlock(x + 1, y);
    if(left !== null && right !== null) //just swap them
    {
        if(left.state === Block.EState.Blocked && right.state === Block.EState.Blocked)
        {
            this.SwapBlocks(left, right);
            return true;
        }
    }
    else if (left !== null && this.IsBlockIndexFree(x + 1, y) && left.state === Block.EState.Blocked)
    {
        var ib = new Block();
        ib.type = Block.EType.PlaceHolder;
        ib.state = Block.EState.SwappedLeft; //avoid set state limitation
        ib.verticalPosition = left.verticalPosition;
        this.InsertBlock(ib, x + 1);
        this.SwapBlocks(left, ib);
        return true;
    }
    else if (right !== null && this.IsBlockIndexFree(x, y) && right.state === Block.EState.Blocked)
    {
        var tt = new Block();
        tt.type = Block.EType.PlaceHolder;
        tt.state = Block.EState.SwappedRight;//avoid set state limitation
        tt.verticalPosition = right.verticalPosition;
        this.InsertBlock(tt, x);
        this.SwapBlocks(tt, right);
        return true;
    }
    return false;
};

Grid.prototype.SwapBlocks = function (left, right) {
    "use strict";
    //move them
    var tmp = left.GetCopy();
    left.LoadFrom(right);
    right.LoadFrom(tmp);
    //tel the animation system to do it slow :)
    left.SetState(Block.EState.SwappedLeft);
    right.SetState(Block.EState.SwappedRight);
};

Grid.prototype.Load = function(content){
    "use strict";
    var i, j;
    for(i = 0; i < content.grid.length; i += 1){
        for ( j = 0; j < content.grid[i].length; j += 1) {
            var b = new Block();
            b.state = content.grid[i][j].state;
            b.type = content.grid[i][j].type;
            b.verticalPosition = this.container[i].length * CONFIG.pixelPerBox;
            this.container[i].push(b);
        }
    }
};

Grid.prototype.Evaluate = function (stats) {
    'use strict';
    var evaluator = new GridEvaluator(stats);
    return evaluator.Evaluate(this.container);
};

Grid.prototype.BlockCount = function(){
    "use strict";
    var count = 0;
    for(var i = 0; i < this.container.length; i+= 1){
        count += this.container[i].length - CONFIG.hiddenRowCount;
    }
    return count;
};