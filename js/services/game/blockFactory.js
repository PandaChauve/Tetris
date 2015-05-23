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

        Block.prototype.getHexColor = function () {
            switch (this.type) {
                case Block.EType.Blue:
                    return 0x000090;
                case Block.EType.Green:
                    return 0x009000;
                case Block.EType.Grey:
                    return 0x505050;
                case Block.EType.Red:
                    return 0x900000;
                case Block.EType.Orange:
                    return 0xdc6e13;
                case Block.EType.Purple:
                    return 0x582a72;
            }
            return 0x000000;
        };

        return {
            newBlock : function(){
                return new Block();
            },
            cloneBlock : function(b){
                var r = new Block();
                r.loadFrom(b);
                return r;
            },
            EState : Block.EState,
            EType : Block.EType

        };
    }]);
