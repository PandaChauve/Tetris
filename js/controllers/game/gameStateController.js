
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
        ///!\ to avoid too much apply it's the time in charge of the refresh (about 10 per sec...)
        //FIXME use a custom event set to avoid broadcasts !

        $scope.$on('newGame', function(){
            $scope.state.swaps = targetSwapCounts;
            $scope.state.score = 0;
            $scope.state.time = 0;
            $scope.state.actions = 0;
            $scope.state.apm = 0;
            $scope.state.combo = 1;
        });

        $scope.$on("newTick", function(event, m){
            if(m.tics >= $scope.state.time / 6) //FIXME magic number  tictime / 10
            {
                $scope.state.score = m.score;
                if(upwardSwapCount){
                    $scope.state.swaps = m.swaps;
                }
                else{
                    $scope.state.swaps = targetSwapCounts - m.swaps;
                }
                $scope.state.actions = m.actions;
                $scope.state.combo = m.combo;
                $scope.state.time = m.tics;
                var t = Math.max(10*TIC_PER_SEC, $scope.state.time); //10 sec min
                $scope.state.apm = Math.floor($scope.state.actions*TIC_PER_SEC*60/t); //limit the apm computation
                $scope.$digest();
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
