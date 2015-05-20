/**
 * Created by panda on 10/04/2015.
 */


function Tetris(grid, cursors, stats) {
    'use strict';
    this.grid = new Grid(grid);
    this.stats = stats;
    this.score = 0;
    this.cursor = [];
    if (cursors === undefined) {
        cursors = 1;
    }
    for (var i = 0; i < cursors; i += 1) {
        this.cursor.push({x: 2 + i * 2, y: CONFIG.hiddenRowCount});
    }

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
    this.score += this.grid.Evaluate(this.stats);

    //user input
    this.HandleUserInput(kb);

    //random events
    this.tics += 1;
    if (CONFIG.fallPeriod !== 0 && this.tics % CONFIG.fallPeriod === 0) {
        this.RandomFall();
    }

    //animate elements (move falling one, destroy complete ones, swap, etc...)
    this.grid.Animate();

    this.groundPos += this.groundSpeed;
    this.groundSpeed += CONFIG.groundAccelerationPerTic;
    this.baseGroundSpeed += CONFIG.groundAccelerationPerTic;

    if (this.groundPos >= CONFIG.pixelPerBox) {
        this.groundPos -= CONFIG.pixelPerBox;
        this.grid.AddNewLine();
        for (var i = 0; i < this.cursor.length; i += 1) {
            this.cursor[i].y += 1;
        }
        this.groundSpeed = this.baseGroundSpeed;
    }
};

Tetris.prototype.GetMaxFixed = function () {
    "use strict";
    return this.grid.GetMaxFixed();
};

Tetris.prototype.IsMoving = function () {
    "use strict";
    return this.grid.IsMoving();
};

Tetris.prototype.GetScore = function () {
    'use strict';
    return this.score;
};

Tetris.prototype.GetSwaps = function () {
    'use strict';
    return this.swapCount;
};


function GetIntBetween(min, max) {
    "use strict";
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Tetris.prototype.RandomFall = function () {
    "use strict";
    var size = 3;
    var start = GetIntBetween(0, CONFIG.columnCount - size);
    for (var i = start; i < start + size; i += 1) {
        this.grid.NewBlockFall(i);
    }
};

Tetris.prototype.HandleUserInput = function (kb) {
    "use strict";

    for (var i = 0; i < this.keyBoardMappings.length; i += 1) {
        var cur = this.cursor[i % this.cursor.length];
        if (kb.pressed(this.keyBoardMappings[i].swap)) {
            if (this.grid.Swap(cur.x, cur.y)) {
                this.swapCount += 1;
            }
        }
        if (kb.pressed(this.keyBoardMappings[i].down)) {
            cur.y = Math.max(CONFIG.hiddenRowCount, cur.y - 1);
        }
        if (kb.pressed(this.keyBoardMappings[i].up)) {
            cur.y = Math.min(CONFIG.hiddenRowCount + CONFIG.displayedRowCount, cur.y + 1);
        }
        if (kb.pressed(this.keyBoardMappings[i].left)) {
            cur.x = Math.max(0, cur.x - 1);
        }
        if (kb.pressed(this.keyBoardMappings[i].right)) {
            cur.x = Math.min(CONFIG.columnCount - 2, cur.x + 1); //-1 for zero based -1 for dual block switcher
        }
        if (kb.pressed(this.keyBoardMappings[i].speed)) {
            this.groundSpeed = CONFIG.groundUpSpeedPerTic;
        }
    }
};