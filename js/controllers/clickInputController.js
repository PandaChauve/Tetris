angular.module('angularApp.controllers')
    .controller('ClickInputCtrl', ['$scope', 'userInput', function ($scope, userInput) {
        "use strict";
        $scope.fireKey = function fireKey(key){
            userInput.press(key);
        };
    }]);
