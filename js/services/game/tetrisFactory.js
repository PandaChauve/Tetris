/**
 * Created by panda on 10/04/2015.
 */

angular.module('angularApp.factories')
    .factory('tetrisFactory', ['gameConstants', 'userInput', 'gridFactory', function tetrisFactoryCreator(gameConstants, userInput, gridFactory) {
        'use strict';

        function Tetris(grid, cursors) {
            this.grid = gridFactory.newGrid(grid);
            this.score = 0;
            this.cursor = [];
            if (cursors === undefined) {
                cursors = 1;
            }
            for (var i = 0; i < cursors; i += 1) {
                this.cursor.push({x: 2 + i * 2, y: gameConstants.hiddenRowCount});
            }

            this.swapCount = 0;
            this.groundSpeed = gameConstants.groundSpeedPerTic;
            this.baseGroundSpeed = gameConstants.groundSpeedPerTic;
            this.groundPos = 0;
            this.keyBoardMappings = [];
            this.tics = 0;
        }

        Tetris.prototype.oneTick = function () {

            //check if don't have new successful combo
            this.score += this.grid.evaluate(this.stats);

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
            newTetris : function(grid, cursors, stats){
                return new Tetris(grid, cursors, stats);
            }
        };
    }]);
