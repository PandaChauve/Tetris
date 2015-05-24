/**
 * Created by panda on 26/04/2015.
 */

angular.module('angularApp.factories')
    .factory('stateChecker', ['gameConstants','TIC_PER_SEC', function stateCheckerFactory(gameConstants, TIC_PER_SEC) {
        "use strict";
        function StateChecker() {}

        StateChecker.prototype.reset = function(gconfig){
            this.defeatComponents = [];
            this.succesComponents = [];
            this.makeComponents(gconfig);
            this.defeatComponents.push(new PillarSizeChecker()); //after make
            this.lastSuccessCheck = false;
            this.lastDefeatCheck = false;
        };

        StateChecker.prototype.defeat = function () {
            return this.lastDefeatCheck;
        };

        StateChecker.prototype.victory = function () {
            return this.lastSuccessCheck;
        };

        StateChecker.prototype.check = function (tetris) {

            this.lastSuccessCheck = this.succesComponents.length !== 0; // && start at true (except if you can't win)
            this.lastDefeatCheck = false;                         // ||

            for (var i = 0; i < this.succesComponents.length; i += 1) {
                this.lastSuccessCheck = this.succesComponents[i].check(tetris) && this.lastSuccessCheck; //make sure we always call check for memory based components
            }

            for (i = 0; i < this.defeatComponents.length; i += 1) {
                this.lastDefeatCheck = this.defeatComponents[i].check(tetris) || this.lastDefeatCheck; //make sure we always call check for memory based components
            }
            return;
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
            if (gconfig.swaps !== undefined) {
                this.defeatComponents.push(new SwapChecker(gconfig.swaps));
            }
            if (gconfig.time !== undefined) {
                this.defeatComponents.push(new TimeChecker(gconfig.time));
            }
        };

        function PillarSizeChecker() {
        }

        PillarSizeChecker.prototype.check = function (tetris) {
            return tetris.getMaxFixed() >= gameConstants.lostThreshold;
        };


        function ScoreChecker(val) {
            this.val = val;
        }

        ScoreChecker.prototype.check = function (tetris) {
            return tetris.getScore() >= this.val;
        };


        function BlockChecker(val) {
            this.val = val;
        }

        BlockChecker.prototype.check = function (tetris) {
            return tetris.grid.blockCount() <= this.val;
        };

        function SwapChecker(val) {
            this.val = val;
        }

        SwapChecker.prototype.check = function (tetris) {
            return tetris.swapCount > this.val;
        };

        function TimeChecker(val) {
            this.val = val;
        }

        TimeChecker.prototype.check = function (tetris) {
            return tetris.tics / TIC_PER_SEC > this.val;
        };

        return new StateChecker();
    }]);
