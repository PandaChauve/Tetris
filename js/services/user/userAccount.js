angular.module('angularApp.factories')
    .factory('userAccount', ['$q', '$rootScope', '$route', '$window', '$timeout', 'storage', 'api', function userFactory($q, $rootScope, $route, $window, $timeout, storage, api) {
        "use strict";
        function createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length >= 2) return parts.pop().split(";").shift();
            return null;
        }

        function User() {
            this.eventHandler = [];
            this.username = null;
            this.id = -1;
            this.hash = null;
            this.started = false;
            this.email = null;
        }

        User.prototype.start = function () {
            var that = this;
            return $q(function (resolve, reject) { //never reject, you can play offline !
                if (that.started) {
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
                        that.email = data.email;
                        that.id = data.id;
                        that.hash = data.hash;
                        storage.load(data.data, that.id, that.hash);
                        that.loadTheme();
                        that.broadcast();
                        resolve(that.username);
                    }
                    else {
                        localStorage.removeItem("Usr_hash");
                        localStorage.removeItem("Usr_LastUserId");
                        resolve(null);
                    }
                }).error(function (e) {
                    localStorage.removeItem("Usr_hash");
                    localStorage.removeItem("Usr_LastUserId");
                    resolve(null);
                });
            });
        };

        User.prototype.registerToEvent = function (obj, fct) {
            this.eventHandler.push({objet: obj, callback: fct});
        };

        User.prototype.createUser = function createUser(login, password, cb) {
            var that = this;
            api.createUser(login, password).success(function (data) {
                if (data.success) {
                    that.username = login;
                    that.logIn(login, password, cb);
                }
                else {
                    console.log(data.message);
                    cb(false);
                }
            }).error(function (err) {
                if (err) {
                    console.log(err + err.message);
                }
                cb(false, "An error occurred while contacting our server, please retry later.");
            });
        };

        User.prototype.resetPassword = function resetPassword(id, cb) {
            var that = this;
            api.resetPassword(id)
                .success(function (data) {
                    if(data.success)
                    {
                        cb("An email as been sent to your account, it may go in your spam.");
                    }
                    else{
                        cb(data.message);
                        console.log(data);
                    }

                }).error(function (err) {
                    if (err) {
                        console.log(err + err.message);
                    }
                    cb("An error occurred while contacting our server, please retry later.");
                });
        };

        User.prototype.updateUser = function updateUser(login, password, email, cb) {
            var that = this;
            api.updateUser(this.id, this.hash, null, login, password, email).success(function (data) {
                if (data.success) {
                    that.username = login;
                    that.id = data.id;
                    that.hash = data.hash;
                    that.logIn(login, password, cb);
                    that.email = data.email;
                }
                else {
                    cb(false);
                    console.log(data.error);
                }
            });
        };

        User.prototype.broadcast = function () {
            for (var i = 0; i < this.eventHandler.length; i += 1) {
                this.eventHandler[i].callback.apply(this.eventHandler[i].objet, [this.username]);
            }
        };
        User.prototype.logout = function logout() {
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
        User.prototype.loadTheme = function () {

            var t = storage.get(storage.Keys.WebTheme) || "slate";
            t = t.toLowerCase();
            var s = getCookie("csstheme");
            createCookie("csstheme", t, 365);
            if (s != t) { //already good don't reload
                $("#switchableTheme").attr("href", "bootswatch/" + t + ".min.css");
            }
        };

        User.prototype.setTheme = function (style) {
            storage.set(storage.Keys.WebTheme, style);
            this.loadTheme();
        };

        User.prototype.logIn = function login(user, password, cb) {
            var that = this;
            api.loadUser(user, password).success(function (data) {
                if (data.success) {
                    localStorage.setItem("Usr_LastUserId", data.id);
                    localStorage.setItem("Usr_hash", data.hash);
                    that.username = user;
                    that.id = data.id;
                    that.hash = data.hash;
                    storage.load(data.data, that.id, that.hash);
                    that.broadcast();
                    that.loadTheme();
                    $route.reload();
                    cb(true, data.message);
                }
                else {
                    console.log(data.message);
                    cb(false);
                }
            }).error(function (err) {
                if (err) {
                    console.log(err + err.message);
                }
                cb(false, "An error occurred while contacting our server, please retry later.");
            });
        };
        return new User();
    }]);
