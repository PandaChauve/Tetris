angular.module('angularApp.controllers')
    .controller('tetrisCampaignCtrl', ['$scope', '$routeParams','$window', 'storage', function ($scope, $routeParams, $window, storage) {
        "use strict";

        $scope.startCampaign = function (i) {
            $window.location.href=('#!/campaign/tetris/' + i);
        };
        updateScope(true);
        storage.registerToEvent(this, updateScope); //not sure the storage is ready
        function updateScope(sync){

            $scope.campaigns = [{
                link : '1',
                active : true
            }];
            for(var i = 2; i < 7; i+= 1) {
                $scope.campaigns.push({
                    link: i,
                    active: storage.get('UserMapcampaign/tetrisAttack/' + (i-1) + '/ta_' + (i-1) + '_10')
                });
            }
            if(!sync){
                $scope.$apply();
            }
        }
    }]);
