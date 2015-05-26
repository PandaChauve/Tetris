angular.module('angularApp.controllers')
    .controller('tetrisCampaignCtrl', ['$scope', '$routeParams', 'storage', function ($scope, $routeParams, storage) {
        "use strict";

        $scope.pages = ['campaign?name=tetris&count=1'];
        for(var i = 2; i < 7; i+= 1) {
            if(storage.get('UserMapcampaign/tetrisAttack/' + (i-1) + '/ta_' + (i-1) + '_10')) {
                $scope.pages.push('campaign?name=tetris&count='+i);
            }
        }
    }]);
