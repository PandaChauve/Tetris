/**
 * Created by panda on 15/04/2015.
 */

function Block() {
    'use strict';
    this.type = Block.EType.Random();
    this.group = -1;
    this.state = Block.EState.Blocked;
    this.verticalPosition = 0;
    this.animationState = 0;
    this.id = -1;
}

Block.prototype.GetCopy = function () {
    "use strict";
    var ret = new Block();
    ret.type = this.type;
    ret.group = this.group;
    ret.state = this.state;
    ret.verticalPosition = this.verticalPosition;
    ret.animationState = this.animationState;
    ret.id = this.id;
    return ret;
};


Block.prototype.LoadFrom = function (cpy) {
    "use strict";
    this.type = cpy.type;
    this.group = cpy.group;
    this.state = cpy.state;
    this.verticalPosition = cpy.verticalPosition;
    this.animationState = cpy.animationState;
    this.id = cpy.id;
};

Block.prototype.SetState = function (state) {
    "use strict";
    this.state = state;
    this.animationState = 0;
};

Block.EState = {
    Blocked: 1,
    Falling: 2,
    Disappearing: 3,
    SwappedLeft: 4,
    SwappedRight: 5
};

Block.EType = {
    Purple: 0,
    Red: 1,
    Green: 2,
    Blue: 3,
    Grey: 4,
    Orange: 5,
    PlaceHolder: 6,
    Random: function () {
        "use strict";
        return Math.floor(Math.random() * Block.EType.PlaceHolder);
    }
};

Block.prototype.GetHexColor = function () {
    "use strict";
    switch (this.type) {
        case Block.EType.Blue:
            return 0x000090;
        case Block.EType.Green:
            return 0x009000;
        case Block.EType.Grey:
            return 0x505050;
        case Block.EType.Red:
            return 0x900000;
        case Block.EType.Orange:
            return 0xdc6e13;
        case Block.EType.Purple:
            return 0x582a72;
    }
    return 0x000000;
};