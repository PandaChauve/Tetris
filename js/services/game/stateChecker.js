/**
 * Created by panda on 26/04/2015.
 */

angular.module('angularApp.factories')
    .factory('stateChecker', ['$timeout', 'gameConstants','TIC_PER_SEC', function stateCheckerFactory($timeout, gameConstants, TIC_PER_SEC) {
        "use strict";
        function StateChecker() {}

        StateChecker.prototype.reset = function(gconfig){
            this.defeatComponents = [];
            this.succesComponents = [];
            this.makeComponents(gconfig);
            this.defeatComponents.push(new PillarSizeChecker()); //after make
            this.lastSuccessCheck = false;
            this.lastDefeatCheck = false;
            this.lastDangerLevel = 0;
        };

        StateChecker.prototype.defeat = function () {
            return this.lastDefeatCheck;
        };

        StateChecker.prototype.victory = function () {
            return this.lastSuccessCheck;
        };
        StateChecker.prototype.getDangerLevel = function () {
            return this.lastDangerLevel;
        };

        StateChecker.prototype.check = function (tetris) {

            this.lastSuccessCheck = this.succesComponents.length !== 0; // && start at true (except if you can't win)
            this.lastDefeatCheck = false;                         // ||

            this.lastDangerLevel = 0;
            for (var i = 0; i < this.succesComponents.length; i += 1) {
                this.lastSuccessCheck = this.succesComponents[i].check(tetris) && this.lastSuccessCheck; //make sure we always call check for memory based components
            }

            for (i = 0; i < this.defeatComponents.length; i += 1) {
                this.lastDefeatCheck = this.defeatComponents[i].check(tetris) || this.lastDefeatCheck; //make sure we always call check for memory based components
                this.lastDangerLevel = Math.max(this.lastDangerLevel, this.defeatComponents[i].getDangerLevel() );

            }

        };

        StateChecker.prototype.makeComponents = function (gconfig) {
            if (!gconfig) {
                return;
            }

            if (gconfig.blocksLeft !== undefined) {
                this.succesComponents.push(new BlockChecker(gconfig.blocksLeft));
            }
            if (gconfig.score !== undefined) {
                this.succesComponents.push(new ScoreChecker(gconfig.score));
            }
            if (gconfig.destroy !== undefined) {
                this.succesComponents.push(new ColorDestroyChecker(gconfig.destroy));
            }
            if (gconfig.swaps !== undefined) {
                this.defeatComponents.push(new SwapChecker(gconfig.swaps));
            }
            if (gconfig.time !== undefined) {
                this.defeatComponents.push(new TimeChecker(gconfig.time));
            }
            if (gconfig.keep !== undefined) {
                this.defeatComponents.push(new ColorKeepChecker(gconfig.keep));
            }
        };

        function PillarSizeChecker() {
            this.level = 0;
        }

        PillarSizeChecker.prototype.check = function (tetris) {
            if(tetris.getMaxFixed() >= gameConstants.lostThreshold)
                this.level+=1;
            else
                this.level -= (gameConstants.lostThreshold-tetris.getMaxFixed())/TIC_PER_SEC;
            if(this.level < 0 )
                this.level = 0;

            return this.level >= TIC_PER_SEC*3;
        };

        PillarSizeChecker.prototype.getDangerLevel = function () {
            return this.level/(TIC_PER_SEC*3)*10;
        };


        function ScoreChecker(val) {
            this.val = val;
        }

        ScoreChecker.prototype.check = function (tetris) {
            return tetris.getScore() >= this.val;
        };


        ScoreChecker.prototype.getDangerLevel = function () {
            return 0;
        };

        function BlockChecker(val) {
            this.val = val;
        }

        BlockChecker.prototype.check = function (tetris) {
            return tetris.grid.blockCount() <= this.val;
        };

        BlockChecker.prototype.getDangerLevel = function () {
            return 0;
        };

        function ColorDestroyChecker(val) { //FIXME always 1 for destroy, 3 for keep
            this.val = val;
        }

        ColorDestroyChecker.prototype.check = function (tetris) {
            return tetris.grid.contains(1) <= this.val;
        };

        ColorDestroyChecker.prototype.getDangerLevel = function () {
            return 0;
        };

        function ColorKeepChecker(val) { //FIXME always 1 for destroy, 3 for keep
            this.val = val;
        }
        ColorKeepChecker.prototype.check = function (tetris) {
            return tetris.grid.contains(3) < this.val;
        };

        ColorKeepChecker.prototype.getDangerLevel = function () {
            return 0;
        };


        var swapInterval = undefined;
        function SwapChecker(val) {
            this.val = val;
            this.swapLost = false;
            if (angular.isDefined(swapInterval)) {
                $timeout.cancel(swapInterval);
                swapInterval = undefined;
            }
        }

        SwapChecker.prototype.check = function (tetris) {
            if(tetris.getSwaps() == this.val && swapInterval == undefined) {
                var that = this;

                swapInterval = $timeout(function() {
                    that.swapLost = true;
                }, 1000);
            }
            var ret = tetris.getSwaps() > this.val || this.swapLost;
            if(this.swapLost) {
                this.swapLost = false; //reset for retry ;)
                swapInterval = undefined;
            }
            return  ret ;
        };

        SwapChecker.prototype.getDangerLevel = function () {
            return 0;
        };

        function TimeChecker(val) {
            this.val = val;
            this.danger = 0;
        }

        TimeChecker.prototype.check = function (tetris) {
            this.danger = this.val - tetris.tics / TIC_PER_SEC;
            return tetris.tics / TIC_PER_SEC > this.val;
        };

        TimeChecker.prototype.getDangerLevel = function () {
            if(this.danger < 10)
                return 10- this.danger;
            return 0;
        };

        return  {
            checkers : [],
            create:function(gconfig){
                for(var i = 0; i < this.checkers.length; ++i){
                    if(!this.checkers[i].used){
                        this.checkers[i].used = true;
                        this.checkers[i].check.reset(gconfig);
                        return i;
                    }
                }
                this.checkers.push({check:new StateChecker(), used: true});
                this.checkers[this.checkers.length-1].check.reset(gconfig);
                return this.checkers.length-1
            },
            free:function(id){this.checkers[id].used = false;},
            defeat: function(id){return this.checkers[id].check.defeat()},
            victory: function(id){return this.checkers[id].check.victory()},
            getDangerLevel: function(id){return this.checkers[id].check.getDangerLevel()},
            check: function(id, tetris){
                return this.checkers[id].check.check(tetris)
            },
            createRuleSet : function(gconfig) {
                var ret = [];
                if (!gconfig) {
                    ret.push({success: true, message: 'Try to stay alive !'});
                    return ret;
                }
                if (gconfig.destroy !== undefined) {
                    ret.push({success: true, message: "Destroy all the green blocks"});
                }
                if (gconfig.keep !== undefined) {
                    ret.push({success: false, message: "Don't destroy any red block before your last swap"});
                }
                if (gconfig.blocksLeft !== undefined) {
                    if (gconfig.blocksLeft === 0) {
                        ret.push({success: true, message: "Destroy each block"});
                    } else {
                        ret.push({success: true, message: "Reduce the blocks to " + gconfig.blocksLeft});
                    }
                }
                if (gconfig.score !== undefined) {
                    ret.push({success: true, message: "Get " + gconfig.score + " points"});
                }
                if (gconfig.swaps !== undefined) {
                    ret.push({success: false, message: "Max " + gconfig.swaps + (gconfig.swaps > 1 ? " swaps":" swap")});
                }
                if (gconfig.time !== undefined) {
                    ret.push({success: false, message: "Max " + gconfig.time + " seconds"});
                }
                return ret;
            }
        };
    }]);
