
angular.module('angularApp.factories')
    .factory('userAccount', ['$http', '$rootScope', 'storage', function userFactory($http, $rootScope, storage) {
        "use strict";
        function User() {
            this.login = null;
            this.id = -1;
            if (storage.get("Usr_hash") && storage.get("Usr_LastUser")) {
                var that = this;
                $http.get('http://sylvain.luthana.be/tetrisApi.php?login=' + storage.get("Usr_LastUser") + '&hash=' + storage.get("Usr_hash")).success(function (data) {
                    if (data.success) {
                        that.login = storage.get("Usr_LastUser");
                        that.id = data.id;
                        $rootScope.$broadcast("registerChange");
                    }
                    else {
                        storage.set("Usr_hash", null);
                    }
                });
            }
        }
        User.prototype.createUser = function createUser(login, password, cb){
            var that = this;
            $http.get('http://sylvain.luthana.be/tetrisApi.php?add&user='+login+'&pswd='+password).success(function(data){
                if(data.success){
                    that.login = login;
                    storage.set("Usr_LastUser", login);
                    $rootScope.$broadcast("registerChange");
                }
                cb(data.success);
            });
        };

        User.prototype.logout = function logout(){
            this.login = null;
            $rootScope.$broadcast("registerChange");
        };

        User.prototype.isRegistered = function isRegistered() {
            return this.login !== null;
        };

        User.prototype.logIn = function login(user, password, remember, cb){
            var s = 'http://sylvain.luthana.be/tetrisApi.php?login='+user+'&password='+password;
            var that = this;
            $http.get(s).success(function(data){
                if(data.success){
                    storage.set("Usr_LastUser", user);
                    that.login = login;
                    that.id = data.id;
                    $rootScope.$broadcast("registerChange");
                    if(remember){
                        storage.set("Usr_hash", data.hash);
                    }
                    cb(true);
                }
                else{
                    cb(false);
                }
            });
        };


        return new User();
    }]);
