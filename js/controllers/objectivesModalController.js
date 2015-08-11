angular.module('angularApp.controllers')
    .controller('ObjectivesModalCtrl', ['$scope', '$modalInstance', 'stateChecker', 'gameName', 'gameConfig',
        function ($scope, $modalInstance, stateChecker, gameName, gameConfig) {
            "use strict";
            $scope.continue = function () {
                $modalInstance.close();
            };
            $scope.rules = stateChecker.createRuleSet(gameConfig.victory);
            $scope.tips = gameConfig.tooltip;
            $scope.title = nameToTitle();
            function nameToTitle(){
                var n = gameName.split('/');
                n = n[n.length-1];
                n = n.replace("_", " ");
                n = n.replace("_", " ");
                n = n.replace("ta", "Tetris Attack - ");
                n = n[0].toUpperCase() + n.slice(1)+"/10";
                return n;
            }
        }]);
