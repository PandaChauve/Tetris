/**
 * Created by panda on 10/04/2015.
 */

angular.module('angularApp.factories')
    .factory('tetrisFactory', ['gameConstants', 'userInput', 'gridFactory', 'systemConfig', 'audio', function tetrisFactoryCreator(gameConstants, userInput, gridFactory, systemConfig, audio) {
        'use strict';

        function Tetris(grid, cursors) {
            this.zoom = systemConfig.get(systemConfig.Keys.zoom) && gameConstants.columnCount < 8;
            this.grid = gridFactory.newGrid(grid);
            this.score = 0;
            this.blockDestroyed = 0;
            this.cursor = [];
            if (cursors === undefined) {
                cursors = 1;
            }
            for (var i = 0; i < cursors; i += 1) {
                this.cursor.push({x: 2 + i * 2, y: gameConstants.hiddenRowCount + gameConstants.displayedRowCount/2});
            }

            this.counters = {swap : 0, move: 0, speed : 0} ;
            this.groundSpeed = gameConstants.groundSpeedPerTic;
            this.baseGroundSpeed = gameConstants.groundSpeedPerTic;
            this.groundPos = 0;
            this.keyBoardMappings = [];
            this.tics = 0;

        }

        Tetris.prototype.slide = function(startX, startY, endX, endY) {
        //FIXME this is related to the rendering cause pixelperbox is not the displayed value :/
            var that = this;
            function findStartingBlockI(startX){
                if(that.zoom){ //this is for a size 6 grid zoomed
                    startX -= 45; //left margin
                    startX = startX / 60; //about  per block
                    startX -= (6 - gameConstants.columnCount) / 2;
                }
                else{ //this is for a size 10 grid
                    startX -= 10; //left margin
                    startX = startX / 43; //about 43 per block
                    startX -= (10 - gameConstants.columnCount) / 2;
                }
                return Math.floor(startX); //math inf float
            }

            function findStartingBlockJ(startY){
                if(that.zoom){
                    startY -= 6;
                    startY -= that.groundPos/gameConstants.pixelPerBox*55;
                    startY = startY / 55;
                }
                else{
                    startY -= 95;
                    startY -= that.groundPos/gameConstants.pixelPerBox*43;
                    startY = startY / 43;
                }
                startY += gameConstants.hiddenRowCount;
                return Math.floor(startY);
            }

            var i = findStartingBlockI(startX);
            var j = findStartingBlockJ(startY);
            if(startX > endX){ //always swap the left one
                i = i - 1;
            }
            if(i < 0 || j < gameConstants.hiddenRowCount-1 || i >= gameConstants.columnCount -1){
                return;
            }
            this.swap(i, j);
        };

        Tetris.prototype.oneTick = function () {

            //check if don't have new successful combo
            var evaluation = this.grid.evaluate();
            for (var i = 0; i < evaluation.series.length; i += 1) { //for a given serie, remove duplicates
                this.blockDestroyed += evaluation.series.length;
            }
            this.score += evaluation.score;


            if(evaluation.score > 0){ //can get points without scoring ^^
                audio.play(audio.ESounds.score);
            }

            //user input
            this.handleUserInput();

            //random events
            this.tics += 1;
            if (gameConstants.fallPeriod !== 0 && this.tics % gameConstants.fallPeriod === 0 && gameConstants.gracePeriod < this.tics) {
                this.randomFall();
            }

            //animate elements (move falling one, destroy complete ones, swap, etc...)
            this.grid.animate();

            this.groundPos += this.groundSpeed;
            this.groundSpeed += gameConstants.groundAccelerationPerTic;
            this.baseGroundSpeed += gameConstants.groundAccelerationPerTic;

            if (this.groundPos >= gameConstants.pixelPerBox) {
                this.groundPos -= gameConstants.pixelPerBox;
                this.grid.addNewLine();
                for (var i = 0; i < this.cursor.length; i += 1) {
                    this.cursor[i].y += 1;
                }
                this.groundSpeed = this.baseGroundSpeed;
            }

            return evaluation;
        };

        Tetris.prototype.getMaxFixed = function () {
            return this.grid.getMaxFixed();
        };

        Tetris.prototype.isMoving = function () {
            return this.grid.isMoving();
        };

        Tetris.prototype.getScore = function () {
            return this.score;
        };
        Tetris.prototype.getDestroyed = function () {
            return this.blockDestroyed;
        };

        Tetris.prototype.getSwaps = function () {
            return this.counters.swap;
        };
        Tetris.prototype.getActions = function () {
            return this.counters.swap + this.counters.move + this.counters.speed ;
        };

        function getIntBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        Tetris.prototype.randomFall = function () {
            var size = 3;
            var start = getIntBetween(0, gameConstants.columnCount - size);
            for (var i = start; i < start + size; i += 1) {
                this.grid.newBlockFall(i);
            }
        };
        Tetris.prototype.swap = function swap(i, j){
            var ret = this.grid.swap(i, j);
            if(ret){
                this.counters.swap += 1;
                audio.play(audio.ESounds.swap);
            }
            return ret;
        };

        Tetris.prototype.handleUserInput = function () {

            for (var i = 0; i < this.keyBoardMappings.length; i += 1) {
                var cur = this.cursor[i % this.cursor.length];
                var x = cur.x;
                var y = cur.y;
                if (userInput.pressed(this.keyBoardMappings[i].swap)) {
                   this.swap(cur.x, cur.y);
                }
                if (userInput.pressed(this.keyBoardMappings[i].down)) {
                    cur.y = Math.max(gameConstants.hiddenRowCount-1, cur.y - 1);
                }
                if (userInput.pressed(this.keyBoardMappings[i].up)) {
                    cur.y = Math.min(gameConstants.hiddenRowCount + gameConstants.displayedRowCount, cur.y + 1);
                }
                if (userInput.pressed(this.keyBoardMappings[i].left)) {
                    cur.x = Math.max(0, cur.x - 1);
                }
                if (userInput.pressed(this.keyBoardMappings[i].right)) {
                    cur.x = Math.min(gameConstants.columnCount - 2, cur.x + 1); //-1 for zero based -1 for dual block switcher
                }
                if(y != cur.y || cur.x != x){
                    this.counters.move += 1;
                }
                if (userInput.pressed(this.keyBoardMappings[i].speed)) {
                    if(this.groundSpeed != gameConstants.groundUpSpeedPerTic){
                        this.counters.speed += 1;
                    }
                    this.groundSpeed = gameConstants.groundUpSpeedPerTic;
                }
            }
        };

        return {
            newTetris : function(grid, cursors){
                return new Tetris(grid, cursors);
            }
        };
    }]);
