angular.module('angularApp.factories')
    .factory('blockFactory', [function blockFactoryCreator() {
        "use strict";
        function Block() {
            this.type = Block.EType.Random();
            this.group = -1;
            this.state = Block.EState.Blocked;
            this.verticalPosition = 0;
            this.animationState = 0;
            this.id = -1;
            this.threeObject = null; //optimisation required to avoid the lookup in the scene
            this.wasFalling = false;
        }
		
		Block.prototype.reset = function(){
			this.type = Block.EType.Random();
            this.group = -1;
            this.state = Block.EState.Blocked;
            this.verticalPosition = 0;
            this.animationState = 0;
            this.id = -1;
            this.threeObject = null; //optimisation required to avoid the lookup in the scene
            this.wasFalling = false;
		}

        Block.prototype.clone = function () {
            var ret = new Block();
            ret.loadFrom(this);
            return ret;
        };

        Block.prototype.loadFrom = function (cpy) {
            this.type = cpy.type;
            this.group = cpy.group;
            this.state = cpy.state;
            this.verticalPosition = cpy.verticalPosition;
            this.animationState = cpy.animationState;
            this.id = cpy.id;
            this.threeObject = cpy.threeObject;
			this.wasFalling = cpy.wasFalling;
        };

        Block.prototype.setState = function (state) {
            this.state = state;
            this.animationState = 0;
        };

        Block.EState = {
            Blocked: 1,
            Falling: 2,
            Disappearing: 3,
            SwappedLeft: 4,
            SwappedRight: 5
        };

        Block.EType = {
            Purple: 0,
            Red: 1,
            Green: 2,
            Blue: 3,
            Grey: 4,
            Orange: 5,
            PlaceHolder: 6,
            Random: function () {
                return Math.floor(Math.random() * Block.EType.PlaceHolder);
            }
        };

		
		var blockCache = [];

        return {
			releaseBlock : function(b){
				b.reset();
				blockCache.push(b);
				console.log("cached : " + blockCache.length);
			},
            newBlock : function(){
				if(blockCache.length == 0){
					return new Block();					
				}
				console.log("used : " + blockCache.length);
				return blockCache.pop();
            },
            cloneBlock : function(b){
                var r = this.newBlock();
                r.loadFrom(b);
                return r;
            },
            EState : Block.EState,
            EType : Block.EType

        };
    }]);
