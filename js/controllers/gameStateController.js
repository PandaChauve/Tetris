
angular.module('angularApp.controllers').controller('GameStateCtrl', ['$scope','TIC_PER_SEC',
    function ($scope, TIC_PER_SEC) {
        "use strict";
        var upwardSwapCount = true;
        var targetSwapCounts = 0;
        $scope.state = {
            rules : createRuleSet($scope.$parent.$parent.gameConditions),//FIXME
            score : 0,
            time : 0,
            apm : 0,
            swaps : 0,
            actions : 0
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
        });
        $scope.$on("newSwaps", function(event, m){
            if(upwardSwapCount){
                $scope.state.swaps = m;
            }
            else{
                $scope.state.swaps = targetSwapCounts - m;
            }
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
            $scope.state.rules = createRuleSet(m);
        });

        function createRuleSet(gconfig){
            var ret = [];
            if (!gconfig) {
                ret.push({success: true, message:'Try to stay alive !'});
                return ret;
            }
            if(gconfig.destroy !== undefined){
                ret.push({success: true, message:"Destroy all the green blocks"});
            }
            if(gconfig.keep !== undefined){
                ret.push({success: false, message:"Don't destroy any red block before your last swap"});
            }
            if (gconfig.blocksLeft !== undefined) {
                if (gconfig.blocksLeft === 0) {
                    ret.push({success: true, message:"Destroy each block"});
                } else {
                    ret.push({success: true, message:"Reduce the blocks to " + gconfig.blocksLeft});
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
