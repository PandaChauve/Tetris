//inspired by http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/
angular.module('angularApp.factories')
    .factory('userInput', [function userInputFactory() {
        "use strict";

        var UserInput = function () {
            // to store the current state
            this.keyCodes = {};

            // create callback to bind/unbind keyboard events
            var that = this;
            this.onKeyDown = function (event) {
                that.onKeyChange(event);
            };

            // bind keyEvents
            document.addEventListener("keydown", this.onKeyDown, false);
        };

        UserInput.prototype.destroy = function () {
            // unbind keyEvents
            document.removeEventListener("keydown", this.onKeyDown, false);
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


        UserInput.prototype.onKeyChange = function (event) {
            // update this.keyCodes
            var keyCode = event.keyCode;
            this.keyCodes[keyCode] = true;
            if (keyCode === UserInput.ALIAS.space ||
                (keyCode >= UserInput.ALIAS.left && keyCode <= UserInput.ALIAS.down)) { //avoid scroll from space and arrows
                event.preventDefault();
            }
        };

        UserInput.prototype.press = function (key) {
            this.keyCodes[key] = true;
        };

        UserInput.prototype.pressed = function (key) {
            return this.keyCodes[key] === true;
        };

        UserInput.prototype.getMapping = function(name){
            return UserInput[name];
        };

        UserInput.leftMapping = {
            swap: 32, //space
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
