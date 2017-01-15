//inspired by http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/
angular.module('angularApp.factories')
    .factory('KeyboardInput', ['EGameActions', function KeyboardInputFactory(EGameActions) {
        "use strict";

        var KeyboardInput = function () {
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

        KeyboardInput.prototype.destroy = function () {
            // unbind keyEvents
            document.removeEventListener("keydown", this.onKeyDown, false);
        };

        KeyboardInput.ALIAS = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'space': 32,
            'pageup': 33,
            'pagedown': 34,
            'tab': 9,
            'enter': 13,
            'esc': 27
        };

        KeyboardInput.prototype.clear = function () {
            if(this.keyCodes[KeyboardInput.ALIAS.esc]) {
                this.keyCodes = {};
                this.keyCodes[KeyboardInput.ALIAS.esc] = true;
            }else
                this.keyCodes = {};
        };

        KeyboardInput.prototype.clearReset = function () {
            this.keyCodes[KeyboardInput.ALIAS.esc] = false;
        };
        KeyboardInput.prototype.getReset = function () {
            return this.keyCodes[KeyboardInput.ALIAS.esc];
        };

        KeyboardInput.prototype.onKeyChange = function (event) {
            // update this.keyCodes
            var keyCode = event.keyCode;
            this.keyCodes[keyCode] = true;
            if (keyCode === KeyboardInput.ALIAS.space ||
                (keyCode >= KeyboardInput.ALIAS.left && keyCode <= KeyboardInput.ALIAS.down)) { //avoid scroll from space and arrows
                event.preventDefault();
            }
        };

        KeyboardInput.prototype.press = function (key) {
            this.keyCodes[key] = true;
        };

        KeyboardInput.prototype.pressed = function (key) {
            return this.keyCodes[key] === true;
        };

        KeyboardInput.prototype.getActions = function(mapping, ret){
            if (this.pressed(mapping.swap)) {
                ret.push(EGameActions.swap);
            }
            if (this.pressed(mapping.down)) {
                ret.push(EGameActions.down);
            }
            if (this.pressed(mapping.up)) {
                ret.push(EGameActions.up);
            }
            if (this.pressed(mapping.left)) {
                ret.push(EGameActions.left);
            }
            if (this.pressed(mapping.right)) {
                ret.push(EGameActions.right);
            }
            if (this.pressed(mapping.speed)) {
                ret.push(EGameActions.speed);
            }
            if (this.pressed(mapping.home)) {
                ret.push(EGameActions.home);
            }
        };

        KeyboardInput.prototype.leftMapping = {
            swap: 32, //space
            down: 83, //s
            up: 90, //z
            left: 81, //q
            right: 68, //d
            speed: 65, //a
            home : KeyboardInput.ALIAS.esc
        };

        KeyboardInput.prototype.rightMapping = {
            swap: 96,//0num
            down: KeyboardInput.ALIAS.down,
            up: KeyboardInput.ALIAS.up,
            left: KeyboardInput.ALIAS.left,
            right: KeyboardInput.ALIAS.right,
            speed: KeyboardInput.ALIAS.enter,
            home : KeyboardInput.ALIAS.esc
        };

        return new KeyboardInput();
    }]);
