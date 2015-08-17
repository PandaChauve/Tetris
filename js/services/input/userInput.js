
angular.module('angularApp.factories')
    .factory('userInput', ['KeyboardInput', 'gamePadInput', function userInputFactory(KeyboardInput, gamePadInput) {
        'use strict';
        function UserInput(){}
        UserInput.prototype.clear = function(){
            KeyboardInput.clear();
            gamePadInput.clear();
        };

        UserInput.prototype.getActions = function(userNbr){
            var ret = [];
            switch(userNbr){
                case 0:
                    KeyboardInput.getActions(KeyboardInput.leftMapping, ret);
                    break;
                case 1:
                    KeyboardInput.getActions(KeyboardInput.rightMapping, ret);
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
        return new UserInput();
    }]);
