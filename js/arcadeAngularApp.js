angular.module('angularApp.base', ['cgNotify']);
angular.module('angularApp.factories', ['angularApp.base']);
angular.module('angularApp.controllers', ['ui.bootstrap', 'angularApp.factories']);
angular.module('angularApp.directives', ['ngTouch', 'angularApp.base', 'angularApp.factories']);
var john = "FUCK";
var angularApp = angular.module('angularApp', [
    'ngRoute',
    'angularApp.base',
    'angularApp.factories',
    'angularApp.controllers',
    'angularApp.directives'
]);
angularApp.config(['$compileProvider', function ($compileProvider) {
    "use strict";
    $compileProvider.debugInfoEnabled(false);
}]);


angularApp.filter('ticToTime', ['helpers', function (helpers) {
    "use strict";
    return helpers.timeFromTics;
}]);

angularApp.config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/game/:hash/', {
                    templateUrl: 'resources/templates/game.html',
                    controller: 'GameCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/', {
                    templateUrl: 'resources/templates/campaign.html',
                    controller: 'GenericCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/:campaignName/', {
                    templateUrl: 'resources/templates/campaign.html',
                    controller: 'GenericCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/:campaignName/:subCampaignId/', {
                    templateUrl: 'resources/templates/campaign.html',
                    controller: 'GenericCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/tetrisCampaign/', {
                    templateUrl: 'resources/templates/tetrisCampaign.html',
                    controller: 'tetrisCampaignCtrl',
                    resolve: {
                        user: ['userAccount', function (userAccount) {
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/scores/:gametype', {
                    templateUrl: 'resources/templates/user/stats.html',
                    controller: 'ArcadeScoreCtrl'
                }).
                when('/menu/:menuName', {
                    templateUrl: 'resources/templates/arcade_index.html',
                    controller: 'ArcadeMenuCtrl'

                }).
                when('/', {
                    templateUrl: 'resources/templates/arcade_index.html',
                    controller: 'ArcadeMenuCtrl'
                });
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        }]
);

angularApp.run(['notify', function (notify) {
    "use strict";
    notify.config({
        templateUrl: "resources/templates/notification.html",
        duration: 5000
    });
}]);
