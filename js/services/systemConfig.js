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
			if(value == undefined)
				value = null;
            localStorage.setItem("systemConfig_" + key, JSON.stringify(value));
        };
        SystemConfig.prototype.get = function(key) {
            var ret = localStorage.getItem("systemConfig_" + key);
            if (ret != null) {
				try{
					ret = JSON.parse(ret);					
				}
				catch(e){
					console.log(e);
					ret = null;
				}
            }
            if (ret != null) {
                return ret;
            }
            if (isMobile.any()) {
                return this.defaultMobile(key);
            }
            return this.defaultDesktop(key);

        };
        SystemConfig.prototype.defaultDesktop = function(key) {
            switch (key) {
                case this.Keys.antialiasing:
                    return true;
                case this.Keys.useLambertMaterial:
                    return false;
                case this.Keys.sound:
                    return true;
                case this.Keys.scores:
                    return true;
                case this.Keys.explosions:
                    return true;
                case this.Keys.zoom:
                    return false;
                case this.Keys.cssScaling:
                    return false;
                case this.Keys.fps:
                    return false;
            }
            throw "what key is that";
        };
        SystemConfig.prototype.defaultMobile = function(key) {
            switch (key) {
                case this.Keys.antialiasing:
                    return false;
                case this.Keys.useLambertMaterial:
                    return true;
                case this.Keys.sound:
                    return false;
                case this.Keys.scores:
                    return false;
                case this.Keys.explosions:
                    return false;
                case this.Keys.zoom:
                    return true;
                case this.Keys.cssScaling:
                    return true;
                case this.Keys.fps:
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