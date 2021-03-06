
angular.module('angularApp.factories')
    .factory('userInput', ['KeyboardInput', 'gamePadInput', function userInputFactory(KeyboardInput, gamePadInput) {
        'use strict';
        function UserInput(){}
        UserInput.prototype.clear = function(){
            KeyboardInput.clear();
            gamePadInput.clear();
        };
        UserInput.prototype.clearReset = function(){
            KeyboardInput.clearReset();
            gamePadInput.clearReset();
        };

        UserInput.prototype.getReset  = function(){
            return KeyboardInput.getReset() || gamePadInput.getReset();
        };

        UserInput.prototype.getActions = function(userNbr){
            var ret = [];
            switch(userNbr){
                case 0:
                    KeyboardInput.getActions(KeyboardInput.leftMapping, ret);
                    gamePadInput.getActions(2, ret);
                    break;
                case 1:
                    KeyboardInput.getActions(KeyboardInput.rightMapping, ret);
                    gamePadInput.getActions(3, ret);
                    break;
                case 2:
                    gamePadInput.getActions(0, ret);
                    break;
                case 3:
                    gamePadInput.getActions(1, ret);
                    break;
            }
            return ret;
        };

        UserInput.prototype.getAllActions = function(){
            var ret = [];
            KeyboardInput.getActions(KeyboardInput.leftMapping, ret);
            gamePadInput.getActions(2, ret);
            KeyboardInput.getActions(KeyboardInput.rightMapping, ret);
            gamePadInput.getActions(3, ret);
            gamePadInput.getActions(0, ret);
            gamePadInput.getActions(1, ret);
            return ret;
        };
        return new UserInput();
    }]);
