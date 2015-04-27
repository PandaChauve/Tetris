//inspired by http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/

function uiOnClick(event) //FIXME --> member
{
    "use strict";
    event.data.obj.keyCodes[event.data.key]	= true;
}

var UserInput = function() {
    // to store the current state
    "use strict";
    this.keyCodes	= {};

    // create callback to bind/unbind keyboard events
    var self	= this;
    this._onKeyDown	= function(event){ self._onKeyChange(event); };

    // bind keyEvents
    document.addEventListener("keydown", this._onKeyDown, false);

    $("#moveUp").click({obj : this, key : UserInput.ALIAS.up}, uiOnClick);
    $("#moveDown").click({obj : this, key : UserInput.ALIAS.down}, uiOnClick);
    $("#moveLeft").click({obj : this, key : UserInput.ALIAS.left}, uiOnClick);
    $("#moveRight").click({obj : this, key : UserInput.ALIAS.right}, uiOnClick);
    $("#swapBtn").click({obj : this, key : UserInput.ALIAS.space}, uiOnClick);
};

UserInput.prototype.destroy	= function()
{
    "use strict";
    // unbind keyEvents
    document.removeEventListener("keydown", this._onKeyDown, false);
};

UserInput.ALIAS	= {
    'left'		: 37,
    'up'		: 38,
    'right'		: 39,
    'down'		: 40,
    'space'		: 32,
    'pageup'	: 33,
    'pagedown'	: 34,
    'tab'		: 9,
    'enter'     : 13
};

UserInput.prototype.clear = function(){
    "use strict";
    this.keyCodes	= {};
};


UserInput.prototype._onKeyChange	= function(event)
{
    "use strict";
    // update this.keyCodes
    var keyCode		= event.keyCode;
    this.keyCodes[keyCode]	= true;
    if(keyCode === UserInput.ALIAS.space){
        e.preventDefault();
    }
};

UserInput.prototype.pressed	= function(key)
{
    "use strict";
    return this.keyCodes[key] === true;
};

UserInput.leftMapping = {
    swap : UserInput.ALIAS.space,
    down : 83, //s
    up : 90, //z
    left : 81, //q
    right : 68, //d
    speed : 65 //a
};

UserInput.rightMapping = {
    swap : 96,//0num
    down : UserInput.ALIAS.down,
    up : UserInput.ALIAS.up,
    left : UserInput.ALIAS.left,
    right : UserInput.ALIAS.right,
    speed : UserInput.ALIAS.enter
};