angular.module('angularApp.controllers')
.controller('ComputerConfigCtrl', ['$scope', 'systemConfig',
        function ($scope, systemConfig) {
            "use strict";
         
			$scope.keys = storage.Keys;
			
			$scope.data = {
				antialiasing : systemConfig.get(storage.Keys.antialiasing),
				texture : systemConfig.get(storage.Keys.useLambertMaterial),
				highRez : !systemConfig.get(storage.Keys.cssScaling),
                score: systemConfig.get(storage.Keys.scores),
                sound: systemConfig.get(storage.Keys.sound),
                explosion: systemConfig.get(storage.Keys.explosions),
				fps: systemConfig.get(storage.Keys.fps),
				zoom : systemConfig.get(storage.Keys.zoom)
            };

            $scope.updateCheckBox = function (name) {
                systemConfig.set(name, !$scope.data[name]);
            };
			
			
        }]);
