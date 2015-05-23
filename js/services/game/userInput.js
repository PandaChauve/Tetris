//inspired by http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/
angular.module('angularApp.factories')
    .factory('userInput', [function userInputFactory() {
        "use strict";

        var UserInput = function () {
            // to store the current state
            var that = this;
            this.keyCodes = {};

            // create callback to bind/unbind keyboard events
            var self = this;
            this._onKeyDown = function (event) {
                self._onKeyChange(event);
            };

            // bind keyEvents
            document.addEventListener("keydown", this._onKeyDown, false);

            function onClick(event) //FIXME ng click
            {
                that.keyCodes[event.data.key] = true;
            }
            $("#moveUp").click({obj: this, key: UserInput.ALIAS.up}, onClick);
            $("#moveDown").click({obj: this, key: UserInput.ALIAS.down}, onClick);
            $("#moveLeft").click({obj: this, key: UserInput.ALIAS.left}, onClick);
            $("#moveRight").click({obj: this, key: UserInput.ALIAS.right}, onClick);
            $("#swapBtn").click({obj: this, key: UserInput.ALIAS.space}, onClick);
        };

        UserInput.prototype.destroy = function () {
            // unbind keyEvents
            document.removeEventListener("keydown", this._onKeyDown, false);
        };

        UserInput.ALIAS = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'space': 32,
            'pageup': 33,
            'pagedown': 34,
            'tab': 9,
            'enter': 13
        };

        UserInput.prototype.clear = function () {
            this.keyCodes = {};
        };


        UserInput.prototype._onKeyChange = function (event) {
            // update this.keyCodes
            var keyCode = event.keyCode;
            this.keyCodes[keyCode] = true;
            if (keyCode === UserInput.ALIAS.space ||
                (keyCode >= UserInput.ALIAS.left && keyCode <= UserInput.ALIAS.down)) { //avoid scroll from space and arrows
                event.preventDefault();
            }
        };

        UserInput.prototype.pressed = function (key) {
            return this.keyCodes[key] === true;
        };

        UserInput.prototype.getMapping = function(name){
            return UserInput[name];
        };

        UserInput.leftMapping = {
            swap: 32,
            down: 83, //s
            up: 90, //z
            left: 81, //q
            right: 68, //d
            speed: 65 //a
        };

        UserInput.rightMapping = {
            swap: 96,//0num
            down: UserInput.ALIAS.down,
            up: UserInput.ALIAS.up,
            left: UserInput.ALIAS.left,
            right: UserInput.ALIAS.right,
            speed: UserInput.ALIAS.enter
        };
        return new UserInput();
    }]);
