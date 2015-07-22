angular.module('angularApp.factories')
    .factory('systemConfig', ['storage', function systemConfigFactory(storage) {
        "use strict";
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        function SystemConfig() {};
        SystemConfig.prototype.set = function(key, value) {
            localstorage.setItem("systemConfig_" + key, JSON.stringify(value));
        };
        SystemConfig.prototype.get = function(key) {
            var ret = localstorage.getItem("systemConfig_" + key);
            if (ret != null) {
                ret = JSON.parse(ret);
            }
            if (ret != null) {
                return ret;
            }
            if (isMobile.any()) {
                return this.defaultMobile(key);
            }
            return this.defaultDesktop(key);

        };
        SystemConfig.prototype.defaultDestop = function(key) {
            switch (key) {
                case this.Keys.antialiasing:
                    return true;
                case this.useLambertMaterial:
                    return true;
                case this.sound:
                    return true;
                case this.scores:
                    return true;
                case this.explosions:
                    return true;
                case this.zoom:
                    return false;
                case this.cssScaling:
                    return false;
                case this.fps:
                    return false;
            }
            throw "what key is that";
        };
        SystemConfig.prototype.defaultMobile = function(key) {
            switch (key) {
                case this.Keys.antialiasing:
                    return false;
                case this.useLambertMaterial:
                    return true;
                case this.sound:
                    return false;
                case this.scores:
                    return false;
                case this.explosions:
                    return false;
                case this.zoom:
                    return true;
                case this.cssScaling:
                    return true;
                case this.fps:
                    return false;
            }
            throw "what key is that";
        };

        SystemConfig.prototype.Keys = {
            antialiasing: 0,
            useLambertMaterial: 1,
            sound: 2,
            scores: 3,
            explosions: 4,
            zoom: 5,
            cssScaling: 6,
            fps : 7

        };

        return new SystemConfig();
    }]);