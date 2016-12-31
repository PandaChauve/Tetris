angular.module('angularApp.controllers')
    .controller('GenericCampaignCtrl', ['$scope', '$routeParams', '$window', 'storage', function ($scope, $routeParams, $window, storage) {
        "use strict";
        var i, j;
        $scope.startMap = function (i) {
            $window.location.href=('#!/game/' + i);
        };
        $scope.getClass = function (i, active) {
            if (!active) {
                return "mapNodeDisabled";
            }
            return "mapNode mapNodeActive_" + i;
        };

        $scope.getTextClass = function (i, active) {
            if (!active) {
                return "mapTextNodeDisabled";
            }
            return "mapTextNode";
        };
        $scope.campaign = $routeParams.campaignName || "tutorial";
        var count = $routeParams.subCampaignId || 1;
        updateScope();
        function updateScope(){
            $scope.maps = [];
            $scope.title = "";
            switch ($scope.campaign) {
                case 'challenges':
                    $scope.title = "Challenges";
                    $scope.maps.push({
                        name: CryptoJS.MD5('campaign/puzzle/puzzle_1'),
                        active: true
                    });
                    for (i = 2; i < 11; i += 1) {
                        $scope.maps.push({
                            name: CryptoJS.MD5('campaign/puzzle/puzzle_' + i),
                            active: storage.get('UserMapcampaign/puzzle/puzzle_' + (i - 1))
                        });
                    }
                    break;
                case 'timelimit':
                    $scope.title = "Time Limit";
                    $scope.maps.push({
                        name: CryptoJS.MD5('campaign/timeLimit/timelimit_1'),
                        active: true
                    });
                    for (i = 2; i < 11; i += 1) {
                        $scope.maps.push({
                            name: CryptoJS.MD5('campaign/timeLimit/timelimit_' + i),
                            active: storage.get('UserMapcampaign/timeLimit/timelimit_' + (i - 1))
                        });
                    }
                    break;
                case 'tetris':
                    $scope.title = "Tetris Attack - "+count;
                    i = count; //str
                    j = 1;
                    $scope.maps.push({
                        name: CryptoJS.MD5('campaign/tetrisAttack/' + i + '/ta_' + i + '_' + j),
                        active: (i == 1 || storage.get('UserMapcampaign/tetrisAttack/' + (i - 1) + '/ta_' + (i - 1) + '_10'))
                    });

                    for (j = 2; j < 11; j += 1) {
                        $scope.maps.push({
                            name: CryptoJS.MD5('campaign/tetrisAttack/' + i + '/ta_' + i + '_' + j),
                            active: (storage.get('UserMapcampaign/tetrisAttack/' + i + '/ta_' + i + '_' + (j - 1)))
                        });
                    }
                    break;
                default:
                    $scope.title = "Tutorial";
                    $scope.maps.push({
                        name: CryptoJS.MD5('campaign/arcade/arcade_1'),
                        active: true
                    });
                    for (i = 2; i < 11; i += 1) {
                        $scope.maps.push({
                            name: CryptoJS.MD5('campaign/arcade/arcade_' + i),
                            active: storage.get('UserMapcampaign/arcade/arcade_' + (i - 1))
                        });
                    }
                    break;
            }
        };
    }]);
