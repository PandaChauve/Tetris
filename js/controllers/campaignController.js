angular.module('angularApp.controllers')
    .controller('CampaignCtrl', ['$scope', '$routeParams', 'storage', function ($scope, $routeParams, storage) {
    "use strict";
    var i, j;
    $scope.campaign = $routeParams.name || "arcade";
    var count = $routeParams.count || 1;
    $scope.maps = [];
    switch ($scope.campaign) {
        case 'puzzle':
            $scope.maps.push('campaign/puzzle/puzzle_1');
            for (i = 2; i < 3; i += 1) {
                if(storage.get('UserMapcampaign/puzzle/puzzle_'+ (i-1))){
                    $scope.maps.push('campaign/puzzle/puzzle_' + i);
                }
            }
            break;
        case 'timelimit':
            $scope.maps.push('campaign/timeLimit/timelimit_1');
            for (i = 2; i < 3; i += 1) {
                if(storage.get('UserMapcampaign/timeLimit/timelimit_'+ (i-1))){
                    $scope.maps.push('campaign/timeLimit/timelimit_' + i);
                }
            }
            break;
        case 'tetris':
            i = count;
            j = 1;
            if(count === 1 || storage.get('UserMapcampaign/tetrisAttack/' + (i-1) + '/ta_' + (i-1) + '_10')){
                $scope.maps.push('campaign/tetrisAttack/' + i + '/ta_' + i + '_' + j);
            }
            for (j = 2; j < 11; j += 1) {
                if(storage.get('UserMapcampaign/tetrisAttack/' + i + '/ta_' + i + '_' + (j-1))){
                    $scope.maps.push('campaign/tetrisAttack/' + i + '/ta_' + i + '_' + j);
                }
            }

            break;
        default:
            $scope.maps.push('campaign/arcade/arcade_1');
            for (i = 2; i < 4; i += 1) {
                if(storage.get('UserMapcampaign/arcade/arcade_' + (i-1))){
                    $scope.maps.push('campaign/arcade/arcade_' + i);
                }
            }
            break;
    }

}]);
