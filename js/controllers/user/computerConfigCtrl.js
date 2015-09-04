angular.module('angularApp.controllers')
.controller('ComputerConfigCtrl', ['$scope', 'systemConfig','audio',
        function ($scope, systemConfig, audio) {
            "use strict";
         
			$scope.keys = systemConfig.Keys;
			
			$scope.data = {
				antialiasing : systemConfig.get(systemConfig.Keys.antialiasing),
				lowtexture : systemConfig.get(systemConfig.Keys.useLambertMaterial),
				lowRez : systemConfig.get(systemConfig.Keys.cssScaling),
                score: systemConfig.get(systemConfig.Keys.scores),
                sound: systemConfig.get(systemConfig.Keys.sound),
                explosion: systemConfig.get(systemConfig.Keys.explosions),
				fps: systemConfig.get(systemConfig.Keys.fps),
                zoom : systemConfig.get(systemConfig.Keys.zoom),
                touchAndSlide : systemConfig.get(systemConfig.Keys.touchAndSlide),
            };

            $scope.updateCheckBox = function (key, value) {
                systemConfig.set(key, !value);
                if(key === systemConfig.Keys.sound){
                    audio.resetConfig();
                }
            };
			
			
        }]);
