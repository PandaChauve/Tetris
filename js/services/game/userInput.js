//inspired by http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/
angular.module('angularApp.factories')
    .factory('userInput', [function userInputFactory() {
        "use strict";
        var gamePadApiAvailable = 'GamepadEvent' in window;

        var UserInput = function () {
            // to store the current state
            this.keyCodes = {};

            // create callback to bind/unbind keyboard events
            var that = this;
            this.onKeyDown = function (event) {
                that.onKeyChange(event);
            };

            if(gamePadApiAvailable){
                this.gamePads = {};/*
                this.addGP = function(event){
                    that.gamePads[event.gamepad.index] = {'0':false, '1':false, '12':false, '13' : false, '14':false, '15':false};
                };

                this.removeGP = function(event){
                    delete that.gamePads[event.gamepad.index];
                };
*/
                this.checkGP = function(){
                    function pressed(val){
                        if (typeof(val) == "object") {
                            return val.pressed;
                        }
                        else{
                            return  val == 1.0;
                        }
                    }

                    function action(controller, state,  btnId, keycode){
                        var btn = pressed(controller.buttons[btnId]);
                        if( btn != state[btnId]){
                            state[btnId] = btn;
                            if(state[btnId]) //on press
                            {
                                that.keyCodes[keycode] = true;
                            }
                        }
                    }

                    var map;
                    var gp = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
                    for (var j = 0; j < gp.length; ++j) {
                        if(!gp[j])
                            continue;
                        if(!that.gamePads[gp[j].index]){
                            that.gamePads[gp[j].index] = {'0':false, '1':false, '12':false, '13' : false, '14':false, '15':false};
                        }
                        if(j != 1){
                            map = UserInput.leftMapping;
                        }
                        else{
                            map = UserInput.rightMapping;
                        }
                        var controller = gp[j];
                        action(controller, that.gamePads[controller.index], 0, map.swap);
                        action(controller, that.gamePads[controller.index],1, map.speed);
                        action(controller, that.gamePads[controller.index],12, map.up);
                        action(controller, that.gamePads[controller.index],14, map.left);
                        action(controller, that.gamePads[controller.index],15, map.right);
                        action(controller, that.gamePads[controller.index],13, map.down);
                    }
                    window.requestAnimationFrame(that.checkGP);
                };
/*
                window.addEventListener("gamepadconnected", this.addGP);
                window.addEventListener("gamepaddisconnected", this.removeGP);*/
                window.requestAnimationFrame(this.checkGP);
            }

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
