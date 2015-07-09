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
                //https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
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

                    function btnAction(controller, state,  btnId, keycode){
                        var btn = pressed(controller.buttons[btnId]);
                        if( btn != state[btnId]){
                            state[btnId] = btn;
                            if(state[btnId]) //on press
                            {
                                that.keyCodes[keycode] = true;
                            }
                        }
                    }
                    function handleAxe(axe, state, lowerCode, higherCode){
                        if(axe <= -0.5 && state[0] >= 7) {
                            that.keyCodes[lowerCode] = true;
                            state[0] = 0;
                        }
                        else if(axe >= 0.5 && state[1] >= 7)
                        {
                            that.keyCodes[higherCode] = true;
                            state[1] = 0;
                        }
                        else
                        {
                            state[0]+= 1;
                            state[1]+= 1;
                        }
                    }

                    var map;
                    var gp = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
                    for (var j = 0; j < gp.length; ++j) {
                        if(!gp[j])
                            continue;
                        if(!that.gamePads[gp[j].index]){
                            that.gamePads[gp[j].index] = {'0':false, '1':false, '4' : false,'5' : false,'6' : false,'7' : false, '12':false, '13' : false, '14':false, '15':false, 'axe' : [[0, 0], [0, 0], [0, 0], [0, 0]] };
                        }
                        if(j != 1){
                            map = UserInput.leftMapping;
                        }
                        else{
                            map = UserInput.rightMapping;
                        }
                        var controller = gp[j];
                        btnAction(controller, that.gamePads[controller.index], 0, map.swap);
                        btnAction(controller, that.gamePads[controller.index], 4, map.swap);
                        btnAction(controller, that.gamePads[controller.index], 5, map.swap);
                        btnAction(controller, that.gamePads[controller.index], 6, map.swap);
                        btnAction(controller, that.gamePads[controller.index], 7, map.swap);
                        btnAction(controller, that.gamePads[controller.index], 1, map.speed);
                        btnAction(controller, that.gamePads[controller.index], 12, map.up);
                        btnAction(controller, that.gamePads[controller.index], 14, map.left);
                        btnAction(controller, that.gamePads[controller.index], 15, map.right);
                        btnAction(controller, that.gamePads[controller.index], 13, map.down);


                        for(var z = 0; z < controller.axes.length  && z < 4; ++z){
                            handleAxe(controller.axes[z], that.gamePads[controller.index].axe[z], (z%2)? map.up:map.left, (z%2)? map.down:map.right);
                        }

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
