/**
 * Created by panda on 10/04/2015.
 */

angular.module('angularApp.factories')
    .factory('tetrisFactory', ['gameConstants', 'userInput', 'gridFactory', 'storage', function tetrisFactoryCreator(gameConstants, userInput, gridFactory, storage) {
        'use strict';

        function Tetris(grid, cursors) {
            var zoom = storage.get("UserZoomConfig") || 2;
            zoom = gameConstants.columnCount < 8 && (zoom === 1 || (zoom === 2 && document.documentElement.clientWidth < 970)); // 0 never , 1 always, 2 auto //FIXME magic 800
            this.zoom = zoom;
            this.grid = gridFactory.newGrid(grid);
            this.score = 0;
            this.cursor = [];
            if (cursors === undefined) {
                cursors = 1;
            }
            for (var i = 0; i < cursors; i += 1) {
                this.cursor.push({x: 2 + i * 2, y: gameConstants.hiddenRowCount + gameConstants.displayedRowCount/2});
            }

            this.swapCount = 0;
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
                    startX -= 73; //left margin
                    startX = startX / 50; //about 43 per block
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
                    startY -= 25;
                    startY -= that.groundPos/gameConstants.pixelPerBox*50;
                    startY = startY / 50;
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
            if(i < 0 || j < gameConstants.hiddenRowCount || i >= gameConstants.columnCount){
                return;
            }
            if (this.grid.swap(i, j)) {
                this.swapCount += 1;
            }
        };

        Tetris.prototype.oneTick = function () {

            //check if don't have new successful combo
            this.score += this.grid.evaluate();

            //user input
            this.handleUserInput();

            //random events
            this.tics += 1;
            if (gameConstants.fallPeriod !== 0 && this.tics % gameConstants.fallPeriod === 0) {
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

        Tetris.prototype.getSwaps = function () {
            return this.swapCount;
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

        Tetris.prototype.handleUserInput = function () {

            for (var i = 0; i < this.keyBoardMappings.length; i += 1) {
                var cur = this.cursor[i % this.cursor.length];
                if (userInput.pressed(this.keyBoardMappings[i].swap)) {
                    if (this.grid.swap(cur.x, cur.y)) {
                        this.swapCount += 1;
                    }
                }
                if (userInput.pressed(this.keyBoardMappings[i].down)) {
                    cur.y = Math.max(gameConstants.hiddenRowCount, cur.y - 1);
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
                if (userInput.pressed(this.keyBoardMappings[i].speed)) {
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
