
angular.module('angularApp.factories')
    .factory('userAccount', ['$http', '$rootScope', '$route', '$window', 'storage', function userFactory($http, $rootScope, $route, $window, storage) {
        "use strict";
        function User() {
            this.login = null;
            this.id = -1;
            if (localStorage.getItem("Usr_LastUser") && localStorage.getItem("Usr_hash")) {
                var that = this;
                $http.get('http://sylvain.luthana.be/tetrisApi.php?login=' + localStorage.getItem("Usr_LastUser") + '&hash=' + localStorage.getItem("Usr_hash")).success(function (data) {
                    if (data.success) {
                        that.login = localStorage.getItem("Usr_LastUser");
                        that.id = data.id;
                        storage.load(that.id);
                        $rootScope.$broadcast("registerChange");
                    }
                    else {
                        localStorage.setItem("Usr_hash", null);
                    }
                });
            }
        }
        User.prototype.createUser = function createUser(login, password, cb){
            var that = this;
            $http.get('http://sylvain.luthana.be/tetrisApi.php?add&user='+login+'&pswd='+password).success(function(data){
                if(data.success){
                    that.login = login;
                    that.logIn(login, password, cb);
                }
            });
        };

        User.prototype.logout = function logout(){
            this.login = null;
            storage.unload();
            $rootScope.$broadcast("registerChange");
            localStorage.setItem("Usr_hash", "");
            $window.location.href = "#!/";
            $window.location.reload();
        };

        User.prototype.isRegistered = function isRegistered() {
            return this.login !== null;
        };

        User.prototype.logIn = function login(user, password, cb){
            var s = 'http://sylvain.luthana.be/tetrisApi.php?login='+user+'&password='+password;
            var that = this;
            $http.get(s).success(function(data){
                if(data.success){
                    localStorage.setItem("Usr_LastUser", user);
                    that.login = login;
                    that.id = data.id;
                    storage.load(that.id);
                    $rootScope.$broadcast("registerChange");
                    localStorage.setItem("Usr_hash", data.hash);
                    cb(true);
                    $route.reload();
                }
                else{
                    cb(false);
                }
            });
        };


        return new User();
    }]);
