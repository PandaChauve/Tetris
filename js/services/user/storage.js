angular.module('angularApp.factories')
    .factory('storage', ['$http', function storageFactory($http) {
        "use strict";
        function UserStorage() {
            this.storage = {};
            this.userId = -1;
        }

        UserStorage.prototype.load = function load(userid) {
            this.storage = {};
            this.userId = -1;
            var that = this;
            $http.get("http://sylvain.luthana.be/tetrisApi.php?userdata=storage&user_id=" + userid).success(function (data) {
                try {
                    if (!data)
                        that.storage = {};
                    else
                        that.storage = data;
                    that.userId = userid;
                }
                catch (e) {
                    console.log(e);
                }
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
            if(flush === undefined){
                flush = true;
            }
            this.storage[key] = JSON.stringify(value);
            if (this.userId !== -1 && flush) {
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //FIXME
                $http.post('http://sylvain.luthana.be/tetrisApi.php?p', {
                    'user_id': this.userId,
                    'type': 'storage',
                    'userdata': JSON.stringify(this.storage)
                })
                    .success(function (e) {
                        console.log(e);

                    })
                    .error(function (e) {
                        console.log(e);
                    });

            }
        };
        return new UserStorage();
    }]);
