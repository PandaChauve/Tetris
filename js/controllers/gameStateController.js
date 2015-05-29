
angular.module('angularApp.controllers').controller('GameStateCtrl', ['$scope',
    function ($scope) {
        "use strict";
        var upwardSwapCount = true;
        var targetSwapCounts = 0;
        $scope.state = {
            rules : [],
            score : 0,
            time : 0,
            swaps : 0
        };
        ///!\ to avoid too much apply it's the time in charge (about 10 per sec...)
        $scope.$on("newScore", function(event, m){
            $scope.state.score = m;
        });
        $scope.$on('newGame', function(){
            $scope.state.swaps = targetSwapCounts;
            $scope.state.score = 0;
        });
        $scope.$on("newSwaps", function(event, m){
            if(upwardSwapCount){
                $scope.state.swaps = m;
            }
            else{
                $scope.state.swaps = targetSwapCounts - m;
            }
        });
        $scope.$on("newTime", function(event, m){
            if(m >= $scope.state.time / 6) //FIXME magic number  tictime / 10
            {
                $scope.state.time = m;
                $scope.$apply();
            }
        });
        $scope.$on("newRulesSet", function(event, m){
            upwardSwapCount = !m || !m.swaps;
            if(!upwardSwapCount){
                targetSwapCounts = m.swaps;
                $scope.state.swaps = m.swaps;
            }
            $scope.state.rules = createRuleSet(m);
        });

        function createRuleSet(gconfig){
            var ret = [];
            if (!gconfig) {
                ret.push({success: true, message:'Try to stay alive !'});
                return ret;
            }
            if (gconfig.blocksLeft !== undefined) {
                if (gconfig.blocksLeft === 0) {
                    ret.push({success: true, message:"Destroy each block"});
                } else {
                    ret.push({success: true, message:"Reduce the block count to " + gconfig.blocksLeft});
                }
            }
            if (gconfig.score !== undefined) {
                ret.push({success: true, message:"Get " + gconfig.score + " points"});
            }
            if (gconfig.swaps !== undefined) {
                ret.push({success: false, message:"Max " + gconfig.swaps + " swaps"});
            }
            if (gconfig.time !== undefined) {
                ret.push({success: false, message:"Max " + gconfig.time + " seconds"});
            }
            return ret;
        }

    }]);
