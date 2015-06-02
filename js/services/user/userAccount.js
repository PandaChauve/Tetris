
angular.module('angularApp.factories')
    .factory('userAccount', ['$http', '$rootScope', '$route', '$window', '$timeout', 'storage', function userFactory($http, $rootScope, $route, $window, $timeout, storage) {
        "use strict";
        function User() {
            this.eventHandler = [];
            this.username = null;
            this.id = -1;
            if (localStorage.getItem("Usr_LastUser") && localStorage.getItem("Usr_hash")) {
                var that = this;
                $http.get('http://sylvain.luthana.be/tetrisApi.php?login=' + localStorage.getItem("Usr_LastUser") + '&hash=' + localStorage.getItem("Usr_hash")).success(function (data) {
                    if (data.success) {
                        that.username = localStorage.getItem("Usr_LastUser");
                        that.id = data.id;
                        that.broadcast();
                        storage.load(that.id);
                    }
                    else {
                        localStorage.setItem("Usr_hash", null);
                    }
                });
            }
        }

        User.prototype.registerToEvent = function(obj, fct){
            this.eventHandler.push({objet: obj, callback: fct});
        };

        User.prototype.unregister = function(obj){
            for(var i = 0; i < this.eventHandler.length; i+= 1){
                if(this.eventHandler[i].objet === obj)
                {
                    this.eventHandler = this.eventHandler.splice(i, 1);
                    break;
                }
            }
        };

        User.prototype.createUser = function createUser(login, password, cb){
            var that = this;
            $http.get('http://sylvain.luthana.be/tetrisApi.php?add&user='+login+'&pswd='+password).success(function(data){
                if(data.success){
                    that.username = login;
                    that.logIn(login, password, cb);
                }
            });
        };
        User.prototype.broadcast = function(){
            for(var i = 0; i < this.eventHandler.length; i+= 1) {
                this.eventHandler[i].callback.apply(this.eventHandler[i].objet, [this.username]);
            }
        };
        User.prototype.logout = function logout(){
            localStorage.setItem("Usr_hash", "");
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
            var s = 'http://sylvain.luthana.be/tetrisApi.php?login='+user+'&password='+password;
            var that = this;
            $http.get(s).success(function(data){
                if(data.success){
                    localStorage.setItem("Usr_LastUser", user);
                    localStorage.setItem("Usr_hash", data.hash);
                    that.username = user;
                    that.id = data.id;
                    storage.load(that.id);
                    that.broadcast();
                    cb(true);
                }
                else{
                    cb(false);
                }
            });
        };
        return new User();
    }]);
