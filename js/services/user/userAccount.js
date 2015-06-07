
angular.module('angularApp.factories')
    .factory('userAccount', ['$q', '$rootScope', '$route', '$window', '$timeout', 'storage', 'api', function userFactory($q,$rootScope, $route, $window, $timeout, storage, api) {
        "use strict";
        function User() {
            this.eventHandler = [];
            this.username = null;
            this.id = -1;
            this.started = false;
        }

        User.prototype.start = function(){
            var that = this;
            return $q(function(resolve, reject){ //never reject, you can play offline !
                if(that.started){
                    resolve(that.username);
                    return;
                }
                if (!localStorage.getItem("Usr_LastUserId") || !localStorage.getItem("Usr_hash")) {
                    resolve(null);
                    return;
                }
                api.loadUserId(localStorage.getItem("Usr_LastUserId"), localStorage.getItem("Usr_hash")).success(function (data) {
                    if (data.success) {
                        that.started = true;
                        that.username = data.name;
                        that.id = data.id;
                        that.hash = data.hash;
                        that.broadcast();
                        storage.load(data.data, that.id, that.hash);
                        resolve(that.username);
                    }
                    else {
                        localStorage.removeItem("Usr_hash");
                        localStorage.removeItem("Usr_LastUserId");
                        resolve(null);
                    }
                }).error(function(e){
                    localStorage.removeItem("Usr_hash");
                    localStorage.removeItem("Usr_LastUserId");
                    resolve(null);
                });
            });
        };

        User.prototype.registerToEvent = function(obj, fct){
            this.eventHandler.push({objet: obj, callback: fct});
        };

        User.prototype.createUser = function createUser(login, password, cb){
            var that = this;
            api.createUser(login, password).success(function(data){
                if(data.success){
                    that.username = login;
                    that.logIn(login, password, cb);
                }
                else{
                    cb(false);
                }
            });
        };
        User.prototype.broadcast = function(){
            for(var i = 0; i < this.eventHandler.length; i+= 1) {
                this.eventHandler[i].callback.apply(this.eventHandler[i].objet, [this.username]);
            }
        };
        User.prototype.logout = function logout(){
            localStorage.removeItem("Usr_hash");
            localStorage.removeItem("Usr_LastUserId");
            this.login = null;
            storage.unload();
            this.broadcast();
            $window.location.href = "#!/";
            $window.location.reload();
        };

        User.prototype.isRegistered = function isRegistered() {
            return this.username !== null;
        };

        User.prototype.logIn = function login(user, password, cb){
            var that = this;
            api.loadUser(user, password).success(function(data){
                if(data.success){
                    localStorage.setItem("Usr_LastUserId", data.id);
                    localStorage.setItem("Usr_hash", data.hash);
                    that.username = user;
                    that.id = data.id;
                    that.hash = data.hash;
                    storage.load(data.data, that.id, that.hash);
                    that.broadcast();
                    $route.reload();
                    cb(true);
                }
                else{
                    cb(false);
                }
            });
        };
        return new User();
    }]);
