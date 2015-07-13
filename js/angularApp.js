
angular.module('angularApp.base', ['cgNotify']);
angular.module('angularApp.factories', ['angularApp.base']);
angular.module('angularApp.controllers', ['ui.bootstrap', 'angularApp.factories']);
angular.module('angularApp.directives', ['ngTouch', 'angularApp.base', 'angularApp.factories']);

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
                when('/scores', {
                    templateUrl: 'templates/scores.html',
                    controller: 'ScoresCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/achievements', {
                    templateUrl: 'templates/user/achievements.html',
                    controller: 'AchievementsCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/achievements/:userid', {
                    templateUrl: 'templates/user/achievements.html',
                    controller: 'AchievementsCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/rules', {
                    templateUrl: 'templates/rules.html',
                    controller: 'RulesCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/game/:hash', {
                    templateUrl: 'templates/game.html',
                    controller: 'GameCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign', {
                    templateUrl: 'templates/campaign.html',
                    controller: 'CampaignCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/:campaignName', {
                    templateUrl: 'templates/campaign.html',
                    controller: 'CampaignCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/campaign/:campaignName/:subCampaignId', {
                    templateUrl: 'templates/campaign.html',
                    controller: 'CampaignCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/tetrisCampaign', {
                    templateUrl: 'templates/tetrisCampaign.html',
                    controller: 'tetrisCampaignCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/stats', {
                    templateUrl: 'templates/user/stats.html',
                    controller: 'StatCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/stats/:userid', {
                    templateUrl: 'templates/user/stats.html',
                    controller: 'StatCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/user/account', {
                    templateUrl: 'templates/user/account.html',
                    controller: 'UserAccountCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/user/config', {
                    templateUrl: 'templates/user/config.html',
                    controller: 'UserConfigCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/about', {
                    templateUrl: 'templates/about.html',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                }).
                when('/', {
                    templateUrl: 'templates/index.html',
                    controller: 'IndexCtrl',
                    resolve: {
                        user : ['userAccount', function(userAccount){
                            "use strict";
                            return userAccount.start();
                        }]
                    }
                });

            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        }]
);

angularApp.run(['notify', function (notify) {
    "use strict";
    notify.config({
        templateUrl: "templates/notification.html",
        duration : 5000
    });
}]);
