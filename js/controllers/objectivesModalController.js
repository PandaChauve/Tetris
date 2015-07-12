angular.module('angularApp.controllers')
    .controller('ObjectivesModalCtrl', ['$scope', '$modalInstance', 'stateChecker', 'gameConfig',
        function ($scope, $modalInstance, stateChecker, gameConfig) {
            "use strict";
           $scope.continue = function(){
               $modalInstance.close();
           };
           $scope.rules = stateChecker.createRuleSet(gameConfig.victory);


        }]);
