//https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
angular.module('angularApp.factories')
    .factory('gamePadInput', ['EGameActions', function gamePadInputFactory(EGameActions) {
        "use strict";
        var gamePadApiAvailable = 'GamepadEvent' in window;

        if (!gamePadApiAvailable) {
            return {
                clear: function () {
                },
                getActions: function () {
                }
            };
        }

        function createGamePadState(){
            return {
                '0': false,
                '1': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false,
                '12': false,
                '13': false,
                '14': false,
                '15': false,
                'axe': [[0, 0], [0, 0], [0, 0], [0, 0]]
            };
        }

        var GamePadInput = function () {
            // to store the current state
            this.actions = [{}, {}, {}, {}];
            var that = this;

            this.gamePads = {}; //previous state
            this.checkGP = function () {
                function pressed(val) {
                    if (typeof(val) == "object") {
                        return val.pressed;
                    }
                    else {
                        return val == 1.0;
                    }
                }

                function btnAction(controller, btnId, action) {
                    var btn = pressed(controller.buttons[btnId]);
                    var state = that.gamePads[controller.index];
                    if (btn != state[btnId]) {
                        state[btnId] = btn;
                        if (state[btnId]) //on press
                        {
                            that.press(controller.index, action);
                        }
                    }
                }
                function handleAxe(axe, state, lowerCode, higherCode, ctrl) {
                    if (axe <= -0.5 && state[0] >= 7) {
                        that.actions[ctrl][lowerCode] = true;
                        state[0] = 0;
                    }
                    else if (axe >= 0.5 && state[1] >= 7) {
                        that.actions[ctrl][higherCode] = true;
                        state[1] = 0;
                    }
                    else {
                        state[0] += 1;
                        state[1] += 1;
                    }
                }

                var gp = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
                for (var j = 0; j < gp.length; ++j) {
                    var controller = gp[j];
                    if (!controller)
                        continue;
                    if (!that.gamePads[controller.index]) {
                        that.gamePads[controller.index] = createGamePadState();
                    }

                    btnAction(controller, 0, EGameActions.swap);
                    btnAction(controller, 4, EGameActions.swap);
                    btnAction(controller, 5, EGameActions.swap);
                    btnAction(controller, 6, EGameActions.swap);
                    btnAction(controller, 7, EGameActions.swap);
                    btnAction(controller, 8, EGameActions.home);
                    btnAction(controller, 1, EGameActions.speed);
                    btnAction(controller, 12, EGameActions.up);
                    btnAction(controller, 14, EGameActions.left);
                    btnAction(controller, 15, EGameActions.right);
                    btnAction(controller, 13, EGameActions.down);


                    for (var z = 0; z < controller.axes.length && z < 4; ++z) {
                        handleAxe(controller.axes[z], that.gamePads[controller.index].axe[z], (z % 2) ? EGameActions.up : EGameActions.left, (z % 2) ? EGameActions.down : EGameActions.right, controller.index);
                    }

                }
                window.requestAnimationFrame(that.checkGP);
            };
            window.requestAnimationFrame(this.checkGP);
        };


        GamePadInput.prototype.clear = function () {
            if( this.pressed(0, EGameActions.home)) {
                this.actions = [{}, {}, {}, {}];
                this.press(0, EGameActions.home);
            }else
                this.actions = [{}, {}, {}, {}];
        };

        GamePadInput.prototype.clearReset = function () {
            this.actions[0][EGameActions.home] = false;
        };
        GamePadInput.prototype.getReset = function () {
            return this.actions[0][EGameActions.home];
        };

        GamePadInput.prototype.press = function (ctrl, key) {
            this.actions[ctrl][key] = true;
        };

        GamePadInput.prototype.pressed = function (ctrl, key) {
            return this.actions[ctrl][key] === true;
        };

        GamePadInput.prototype.getActions = function (ctrl, ret) {
            if (this.pressed(ctrl, EGameActions.swap)) {
                ret.push(EGameActions.swap);
            }
            if (this.pressed(ctrl, EGameActions.down)) {
                ret.push(EGameActions.down);
            }
            if (this.pressed(ctrl, EGameActions.up)) {
                ret.push(EGameActions.up);
            }
            if (this.pressed(ctrl, EGameActions.left)) {
                ret.push(EGameActions.left);
            }
            if (this.pressed(ctrl, EGameActions.right)) {
                ret.push(EGameActions.right);
            }
            if (this.pressed(ctrl, EGameActions.speed)) {
                ret.push(EGameActions.speed);
            }
        };

        return new GamePadInput();
    }])
;
