
angular.module('angularApp.factories')
    .factory('gameConstants', ['TIC_PER_SEC', function gameConstantsFactory(TIC_PER_SEC) {
        "use strict";
        var config = {};
        config.reset = function reset(){
            this.columnCount = 6;
            this.displayedRowCount = 10;
            this.hiddenRowCount = 4;//MIN 1 !
            this.pixelPerBox = 50;
            this.swapPerTic = 12 *60/TIC_PER_SEC;
            this.fallSpeedPerTic = 7*60/TIC_PER_SEC;
            this.disapearSpeedPerTic = 2*60/TIC_PER_SEC;
            this.groundSpeedPerTic = 0.02*60/TIC_PER_SEC;
            this.groundUpSpeedPerTic = 3*60/TIC_PER_SEC;
            this.groundAccelerationPerTic = 0.02 / TIC_PER_SEC / 60;
            this.fallPeriod = 500*60/TIC_PER_SEC;
            this.gracePeriod = 60*TIC_PER_SEC;
            this.lostThreshold = ((this.displayedRowCount + this.hiddenRowCount) * this.pixelPerBox);
            this.startRows = this.displayedRowCount - 4;
        };

        config.load = function load(mode){
            this.reset();
            if (mode === "sandbox") {
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 0;
                this.startRows = this.displayedRowCount + this.hiddenRowCount;
                this.groundAccelerationPerTic = 0;
            }
            if (mode === "sandboxSmall") {
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 0;
                this.columnCount = 4;
                this.startRows = this.displayedRowCount + this.hiddenRowCount;
                this.groundAccelerationPerTic = 0;
            }
            else if (mode === "fixed") {
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 0;
                this.groundAccelerationPerTic = 0;
                this.groundUpSpeedPerTic = 0;
            }
            else if (mode === "fixedLarge") {
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 0;
                this.groundAccelerationPerTic = 0;
                this.groundUpSpeedPerTic = 0;
                this.columnCount = 10;
            }
            else if (mode === "fixedNarrow") {
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 0;
                this.groundAccelerationPerTic = 0;
                this.groundUpSpeedPerTic = 0;
                this.columnCount = 4;
            }
            else if (mode === "large") {
                this.columnCount = 10;
            }
            else if (mode === "small") {
                this.columnCount = 4;
            }
            if (mode === "puzzle_8") {
                this.fallPeriod = 0;
                this.startRows = this.displayedRowCount + this.hiddenRowCount-1;
                this.groundAccelerationPerTic = 0;
            }
            else if (mode === "arcade_1") { //fixed
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 0;
                this.groundAccelerationPerTic = 0;
            }
            else if (mode === "arcade_2") { //rain
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 300*60/TIC_PER_SEC;
                this.gracePeriod = 0;
                this.groundAccelerationPerTic = 0;
            }
            else if (mode === "arcade_3") { //rain large
                this.groundSpeedPerTic = 0;
                this.fallPeriod = 300*60/TIC_PER_SEC;
                this.groundAccelerationPerTic = 0;
                this.gracePeriod = 0;
                this.columnCount = 10;
            }
            else if (mode === "arcade_4") { //normal a bit fast
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.groundSpeedPerTic *= 1.5;
                this.gracePeriod = 0;
                this.fallPeriod = 200*60/TIC_PER_SEC;
            }
            else if (mode === "arcade_5") { //wide a bit fast
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.groundSpeedPerTic *= 1.5;
                this.gracePeriod = 0;
                this.columnCount = 10;
            }
            else if (mode === "arcade_6") { //fast acceleration
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.fallPeriod = 0;
                this.groundAccelerationPerTic = 1/100/TIC_PER_SEC;
                this.gracePeriod = 0;
            }
            else if (mode === "arcade_7") { //fast acceleration and rain
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.groundAccelerationPerTic = 1/100/TIC_PER_SEC;
                this.gracePeriod = 0;
            }
            else if (mode === "arcade_8") { //fast acceleration and rain
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.groundAccelerationPerTic = 1/100/TIC_PER_SEC;
                this.gracePeriod = 0;
                this.columnCount = 10;
            }
            else if (mode === "arcade_9") { //not wide
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.columnCount = 4;
                this.gracePeriod = 0;
            }
            else if (mode === "arcade_10") { //not wide
                this.groundSpeedPerTic = 0.07*60/TIC_PER_SEC;
                this.fallPeriod = 150*60/TIC_PER_SEC;
                this.groundAccelerationPerTic = 0;
                this.gracePeriod = 0;
                this.columnCount = 10;
            }
        };

        return config;
    }]);
