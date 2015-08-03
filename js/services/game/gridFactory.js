/**
 * Created by panda on 15/04/2015.
 */

angular.module('angularApp.factories')
    .factory('gridFactory', ['gameConstants', 'blockFactory', 'gridEvaluator', function gridFactoryCreator(gameConstants, blockFactory, gridEvaluator) {
        "use strict";

        var spliceOneBlock = function (arr, index) {
            var len = arr.length;
            while (index < len) {
                arr[index] = arr[index + 1];
                index++;
            }
            arr.length -= 1;
        };

        function Grid(content) {
            var i, j, random = gameConstants.groundUpSpeedPerTic !== 0 || gameConstants.groundSpeedPerTic !== 0;
            this.container = new Array(gameConstants.columnCount);

            //fill hidden
            for (i = 0; i < gameConstants.columnCount; i += 1) { //move it to generic constructor
                this.container[i] = new Array(gameConstants.hiddenRowCount);
                for (j = 0; j < this.container[i].length; j += 1) {
                    this.container[i][j] = blockFactory.newBlock();
                    this.container[i][j].verticalPosition = j * gameConstants.pixelPerBox;
                    if (!random) {
                        this.container[i][j].type = blockFactory.EType.PlaceHolder;
                        this.container[i][j].state = blockFactory.EState.Blocked;
                    }
                }
            }

            //fill visible
            if (!content) { //add random
                var lastColor = -1;
                for (i = 0; i < gameConstants.columnCount; i += 1) {
                    for (j = this.container[i].length; j < gameConstants.startRows; j += 1) {
                        this.container[i].push(blockFactory.newBlock());
                        while ((j % 2 == 0 && lastColor === this.container[i][j].type) ||
                        (i % 2 == 1 && this.container[i - 1][j].type == this.container[i][j].type )) { //never 3 aligned at creation
                            this.container[i][j].type = blockFactory.EType.Random();
                        }
                        lastColor = this.container[i][j].type;
                        this.container[i][j].verticalPosition = j * gameConstants.pixelPerBox;
                    }
                }
            }
            else {
                this.load(content);
            }
        }

        Grid.prototype.addNewLine = function () {
            var i, j;
            for (i = 0; i < gameConstants.columnCount; i += 1) {
                for (j = 0; j < this.container[i].length; j += 1) {
                    this.container[i][j].verticalPosition += gameConstants.pixelPerBox;
                }
                this.container[i].unshift(blockFactory.newBlock());
            }
        };

        //remove at pos in array
        Grid.prototype.removeBlockFixed = function (i, index) {
            blockFactory.releaseBlock(this.container[i][index]);
            //remove the block from i
            spliceOneBlock(this.container[i], index);
            this.makeTopBlockFall(i, index);
        };


        Grid.prototype.insertBlock = function (block, i) {
            for (var j = 0; j < this.container[i].length; j += 1) {
                if (this.container[i][j].verticalPosition > block.verticalPosition) {
                    this.container[i].splice(j, 0, block);
                    return;
                }
            }
            this.container[i].push(block);
        };

        Grid.prototype.findBlock = function (i, j) {
            var index = this.findBlockIndex(i, j);
            if (index === -1) {
                return null;
            }
            return this.container[i][index];
        };

        Grid.prototype.findBlockIndex = function (i, j) {
            var index;
            for (index in this.container[i]) {
                if (this.container[i].hasOwnProperty(index) && this.container[i][index].verticalPosition === gameConstants.pixelPerBox * j) {
                    return parseInt(index);
                }
            }
            return -1;
        };

        Grid.prototype.isBlockIndexFree = function (i, j) {
            var index;
            for (index in this.container[i]) {
                if (this.container[i].hasOwnProperty(index) &&
                    this.container[i][index].verticalPosition >= gameConstants.pixelPerBox * j &&
                    this.container[i][index].verticalPosition < gameConstants.pixelPerBox * (j + 1)) {
                    return false;
                }
            }
            return true;
        };

        Grid.prototype.makeTopBlockFall = function (i, j) {
            if (j < 0) {
                throw "Not my day";
            }
            //blocks on top will fall
            for (var z = j; z < this.container[i].length; z += 1) {
                if (this.container[i][z].state !== blockFactory.EState.Blocked) {
                    break;
                }
                this.container[i][z].setState(blockFactory.EState.Falling);
            }
        };

        Grid.prototype.animateBlockFall = function (i, j, block, minY) {
            block.verticalPosition -= gameConstants.fallSpeedPerTic;
            if (block.verticalPosition < minY) {
                block.verticalPosition = minY;
                if (this.container[i][j - 1].state !== blockFactory.EState.Falling) //by sliding it can be stoping the fall without being lower
                {
                    block.setState(blockFactory.EState.Blocked);
                    block.wasFalling = true;
                }
            }
            return {min: block.verticalPosition + gameConstants.pixelPerBox, deltaY: 0};
        };

        Grid.prototype.animateBlockDisappear = function (i, j, block, minY) {
            block.animationState += gameConstants.disapearSpeedPerTic;
            if (block.animationState > 100 && block.id === -1) {
                //remove it
                this.removeBlockFixed(i, j);
                return {min: minY, deltaY: -1};
            }
            return {min: block.verticalPosition + gameConstants.pixelPerBox, deltaY: 0};
        };

        Grid.prototype.animateSwapped = function (i, j, block, minY) {
            block.animationState += gameConstants.swapPerTic;
            if (block.animationState > 100) {
                if (block.type === blockFactory.EType.PlaceHolder) {
                    this.removeBlockFixed(i, j); //remove this block in particular
                    return {min: minY, deltaY: -1};
                }
                else if (this.container[i][j - 1].state === blockFactory.EState.Falling || this.container[i][j - 1].verticalPosition < block.verticalPosition - gameConstants.pixelPerBox) {
                    block.setState(blockFactory.EState.Falling);
                    this.makeTopBlockFall(i, j + 1);
                }
                else {
                    block.setState(blockFactory.EState.Blocked);
                }
            }
            return {min: block.verticalPosition + gameConstants.pixelPerBox, deltaY: 0};
        };

        Grid.prototype.animateBlock = function (i, j, minY) {
            var block = this.container[i][j];
            block.wasFalling = false;
            switch (block.state) {
                case blockFactory.EState.Blocked:
                    return {min: block.verticalPosition + gameConstants.pixelPerBox, deltaY: 0};
                case blockFactory.EState.Disappearing:
                    return this.animateBlockDisappear(i, j, block, minY);
                case blockFactory.EState.Falling:
                    return this.animateBlockFall(i, j, block, minY);
                case blockFactory.EState.SwappedRight:
                case blockFactory.EState.SwappedLeft:
                    return this.animateSwapped(i, j, block, minY);
            }
            throw "Unsupported animation " + block.state;
        };

        Grid.prototype.animateColumn = function (i) {
            var j, minY, tmp;
            minY = gameConstants.hiddenRowCount * gameConstants.pixelPerBox;
            for (j = gameConstants.hiddenRowCount - 1; j < this.container[i].length; j += 1) {
                tmp = this.animateBlock(i, j, minY);
                minY = tmp.min;
                j += tmp.deltaY;
            }
        };

        Grid.prototype.animate = function () {
            for (var i = 0; i < gameConstants.columnCount; i += 1) {
                this.animateColumn(i);
            }
        };

        Grid.prototype.getMaxFixed = function () {
            var i, j, max = 0;
            //vertical check
            for (i = 0; i < gameConstants.columnCount; i += 1) {
                for (j = gameConstants.hiddenRowCount; j < this.container[i].length; j += 1) {
                    if (this.container[i][j].state !== blockFactory.EState.Blocked) {
                        break;
                    }
                    if (this.container[i][j].verticalPosition > max) {
                        max = this.container[i][j].verticalPosition;
                    }
                }
            }
            return max;
        };

        Grid.prototype.newBlockFall = function (i) {
            var b = blockFactory.newBlock();
            b.setState(blockFactory.EState.Falling);
            b.verticalPosition = (gameConstants.hiddenRowCount + gameConstants.displayedRowCount + 1) * gameConstants.pixelPerBox;
            this.container[i].push(b);
        };

        Grid.prototype.swap = function (x, y) {
            var left = this.findBlock(x, y);
            var right = this.findBlock(x + 1, y);
            if (left !== null && right !== null) //just swap them
            {
                if (left.state === blockFactory.EState.Blocked && right.state === blockFactory.EState.Blocked
                    && (left.type !== blockFactory.EType.PlaceHolder || right.type != blockFactory.EType.PlaceHolder)) {
                    this.swapBlocks(left, right);
                    return true;
                }
            }
            else if (left !== null && this.isBlockIndexFree(x + 1, y) && left.state === blockFactory.EState.Blocked) {
                var ib = blockFactory.newBlock();
                ib.type = blockFactory.EType.PlaceHolder;
                ib.state = blockFactory.EState.SwappedLeft; //avoid set state limitation
                ib.verticalPosition = left.verticalPosition;
                this.insertBlock(ib, x + 1);
                this.swapBlocks(left, ib);
                return true;
            }
            else if (right !== null && this.isBlockIndexFree(x, y) && right.state === blockFactory.EState.Blocked) {
                var tt = blockFactory.newBlock();
                tt.type = blockFactory.EType.PlaceHolder;
                tt.state = blockFactory.EState.SwappedRight;//avoid set state limitation
                tt.verticalPosition = right.verticalPosition;
                this.insertBlock(tt, x);
                this.swapBlocks(tt, right);
                return true;
            }
            return false;
        };

        var swapTmpBlock = blockFactory.newBlock(); //avoid resizing the block cache
        Grid.prototype.swapBlocks = function (left, right) {
            //move them
            swapTmpBlock.loadFrom(left);
            left.loadFrom(right);
            right.loadFrom(swapTmpBlock);
            //tel the animation system to do it slow :)
            left.setState(blockFactory.EState.SwappedLeft);
            right.setState(blockFactory.EState.SwappedRight);
        };

        Grid.prototype.load = function (content) {
            var i, j;
            for (i = 0; i < content.grid.length; i += 1) {
                for (j = 0; j < content.grid[i].length; j += 1) {
                    var b = blockFactory.newBlock();
                    b.state = content.grid[i][j].state;
                    b.type = content.grid[i][j].type;
                    b.verticalPosition = this.container[i].length * gameConstants.pixelPerBox;
                    this.container[i].push(b);
                }
            }
        };

        Grid.prototype.evaluate = function () {
            return gridEvaluator.evaluate(this.container);
        };

        Grid.prototype.blockCount = function () {
            var count = 0;
            for (var i = 0; i < this.container.length; i += 1) {
                count += this.container[i].length - gameConstants.hiddenRowCount;
            }
            return count;
        };

        Grid.prototype.contains = function (color) {
            var count = 0;
            for (var i = 0; i < this.container.length; i += 1) {
                for (var j = gameConstants.hiddenRowCount; j < this.container[i].length; j += 1) {
                    if (this.container[i][j].type === color)
                        count += 1;
                }
            }
            return count;
        };
        return {
            newGrid: function newGrid(content) {
                return new Grid(content);
            }
        };
    }]);
