angular.module('angularApp.controllers')
    .controller('ObjectivesModalCtrl', ['$scope', '$modalInstance', 'stateChecker', 'gameConfig',
        function ($scope, $modalInstance, stateChecker, gameConfig) {
            "use strict";
           $scope.continue = function(){
               $modalInstance.close();
           };
           $scope.rules = stateChecker.createRuleSet(gameConfig.victory);
            $scope.tips = "";
            switch(gameConfig.rules ){
                case "arcade_1":
                    $scope.tips = "Learn to play in a static environment, if you want more blocks press Enter.";
                    break;
                case "arcade_2":
                    $scope.tips = "Blocks are falling this time.";
                    break;
                case "arcade_3":
                case "arcade_6":
                    $scope.tips = "Why not trying the Wide mode ?";
                    break;
                case "arcade_4":
                    $scope.tips = "This is the classic game after 5 minutes, the ground is going up quite fast and the rain is heavy.";
                    break;
                case "arcade_5":
                    $scope.tips = "You first game in Narrow, take your time !";
                    break;
                case "arcade_7":
                    $scope.tips = "I'm not sure but are we still in a tutorial ?";
                    break;
                case "arcade_8":
                    $scope.tips = "This is definitely not a tutorial !";
                    break;
                case "arcade_9":
                    $scope.tips = "Still here ! Congratulations.";
                    break;
                case "arcade_10":
                    $scope.tips = "When will you lose ?";
                    break;
            }

        }]);
