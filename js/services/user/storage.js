angular.module('angularApp.factories')
    .factory('storage', ['api', function storageFactory(api) {
        "use strict";
        function UserStorage() {
            this.storage = {};
            this.inSave = false;
            this.waitingToSave = false;
            this.eventHandler = [];
            this.id = -1;
            this.hash = null;
            this.realStorage;
        }

        //debug
        UserStorage.prototype.impersonate = function(json){
            this.realStorage = this.storage;
            this.storage = JSON.parse(json);
        };
        //debug
        UserStorage.prototype.restore = function(){
            this.storage = this.realStorage;
        };

        UserStorage.prototype.load = function load(data, id, hash) {
            data = JSON.parse(data);
            if (!data)
                this.storage = {};
            else
                this.storage = data;
            this.id = id;
            this.hash = hash;
        };

        UserStorage.prototype.unload = function unload() {
            this.storage = {};
            this.id = -1;
            this.hash = null;
        };
        UserStorage.prototype.get = function (key) {
            var val = this.storage[key];
            if (val == null) {
                return null;
            }

            try {
                return JSON.parse(val);
            }
            catch (e) {
                console.log(e);
            }
            return null;
        };

        UserStorage.prototype.set = function (key, value, flush) {
            if (flush === undefined) {
                flush = true;
            }
            this.storage[key] = JSON.stringify(value);
            if (flush) {
                this.flush();
            }
        };

        UserStorage.prototype.flush = function(){
            if (this.id !== -1 ) {
                this.save();
            }
        };

        UserStorage.prototype.save = function () {
            if(this.inSave){
                this.waitingToSave = true;
            }
            else{
                this.waitingToSave = false;
                this.inSave = true;
                var that = this;
                api.updateUser(this.id, this.hash, JSON.stringify(this.storage)).success(function (e) {
                    that.inSave = false;
                    if(that.waitingToSave){
                        that.save();
                    }
                }).error(function (e) {
                    console.log(e);
                    that.inSave = false;
                    if(that.waitingToSave){
                        that.save();
                    }
                });
            }
        };

        UserStorage.prototype.Keys = {
            scoreEffect :"scoreEffect",
            soundEffect :"soundEffect",
            explosionEffect :"explosionEffect",
            ZoomConfig :"ZoomConfig",
            CubeTheme :"CubeTheme",
            WebTheme :"WebTheme",
            Achievements :"Achievements",
            HexKeyColors :"HexKeyColors"
        };

        UserStorage.prototype.MKeys = {
            UserMap :"UserMap",
            BestGameStats :"BestGameStats",
            TotalGameStats :"TotalGameStats"
        };

        return new UserStorage();
    }]);
