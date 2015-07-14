
angular.module('angularApp.controllers').controller('GameStateCtrl', ['$scope','TIC_PER_SEC','stateChecker',
    function ($scope, TIC_PER_SEC, stateChecker) {
        "use strict";
        var upwardSwapCount = true;
        var targetSwapCounts = 0;
        $scope.state = {
            rules : stateChecker.createRuleSet($scope.$parent.$parent.gameConditions),
            score : 0,
            time : 0,
            apm : 0,
            swaps : 0,
            actions : 0,
            combo: 1
        };
        ///!\ to avoid too much apply it's the time in charge (about 10 per sec...)
        $scope.$on("newScore", function(event, m){
            $scope.state.score = m;
        });
        $scope.$on('newGame', function(){
            $scope.state.swaps = targetSwapCounts;
            $scope.state.score = 0;
            $scope.state.time = 0;
            $scope.state.actions = 0;
            $scope.state.apm = 0;
            $scope.state.combo = 1;
        });
        $scope.$on("newSwaps", function(event, m){
            if(upwardSwapCount){
                $scope.state.swaps = m;
            }
            else{
                $scope.state.swaps = targetSwapCounts - m;
            }
        });
        $scope.$on("newCombos", function(event, m){
            $scope.state.combo = m;
            console.log(m);
        });
        $scope.$on("newActions", function(event, m){
            $scope.state.actions = m;
        });
        $scope.$on("newTime", function(event, m){
            if(m >= $scope.state.time / 6) //FIXME magic number  tictime / 10
            {
                $scope.state.time = m;
                var t = Math.max(10*TIC_PER_SEC, $scope.state.time); //10 sec min
                $scope.state.apm = Math.floor($scope.state.actions*TIC_PER_SEC*60/t); //limit the apm computation
                $scope.$apply();
            }
        });
        $scope.$on("newRulesSet", function(event, m){
            upwardSwapCount = !m || !m.swaps;
            if(!upwardSwapCount){
                targetSwapCounts = m.swaps;
                $scope.state.swaps = m.swaps;
            }
            $scope.state.rules = stateChecker.createRuleSet(m);
        });

    }]);
