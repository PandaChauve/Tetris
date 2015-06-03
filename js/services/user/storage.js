angular.module('angularApp.factories')
    .factory('storage', ['$http', function storageFactory($http) {
        "use strict";
        function UserStorage() {
            this.storage = {};
            this.userId = -1;
            this.inSave = false;
            this.waitingToSave = false;
            this.eventHandler = [];
        }

        UserStorage.prototype.registerToEvent = function (obj, fct) {
            this.eventHandler.push({objet: obj, callback: fct});
        };

        UserStorage.prototype.unregister = function (obj) {
            for (var i = 0; i < this.eventHandler.length; i += 1) {
                if (this.eventHandler[i].objet === obj) {
                    this.eventHandler = this.eventHandler.splice(i, 1);
                    break;
                }
            }
        };

        UserStorage.prototype.broadcast = function () {
            for (var i = 0; i < this.eventHandler.length; i += 1) {
                this.eventHandler[i].callback.apply(this.eventHandler[i].objet);
            }
        };
        UserStorage.prototype.load = function load(userid) {
            this.storage = {};
            this.userId = -1;
            var that = this;
            $http.get("http://sylvain.luthana.be/tetrisApi.php?userdata=storage&user_id=" + userid).success(function (data) {
                setTimeout(function(){ //FIXME remove this debug code once all the async cache issue answered
                    try {
                        if (!data)
                            that.storage = {};
                        else
                            that.storage = data;
                        that.userId = userid;
                        that.broadcast();
                    }
                    catch (e) {
                        console.log(e);
                    }
                }, 0);
            })
                .error(function (e) {
                    console.log(e);
                    that.userId = userid;
                });

        };
        UserStorage.prototype.unload = function unload() {
            this.storage = {};
            this.userId = -1;
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
            if (this.userId !== -1 && flush) {
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
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //FIXME
                $http.post('http://sylvain.luthana.be/tetrisApi.php?p', {
                    'user_id': this.userId,
                    'type': 'storage',
                    'userdata': JSON.stringify(this.storage)
                }).success(function (e) {
                    that.inSave = false;
                    if(that.waitingToSave){
                        that.save();
                    }
                }).error(function (e) {
                    console.log(e);
                    this.inSave = false;
                    if(that.waitingToSave){
                        that.save();
                    }
                });
            }
        };
        return new UserStorage();
    }]);
