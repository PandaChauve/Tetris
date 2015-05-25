
angular.module('angularApp.base', ['cgNotify']);
angular.module('angularApp.factories', ['angularApp.base']);
angular.module('angularApp.controllers', ['ui.bootstrap', 'angularApp.factories']);
angular.module('angularApp.directives', ['angularApp.base', 'angularApp.factories']);

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
                    controller: 'ScoresCtrl'
                }).
                when('/achievements', {
                    templateUrl: 'templates/achievements.html',
                    controller: 'AchievementsCtrl'
                }).
                when('/rules', {
                    templateUrl: 'templates/rules.html'
                }).
                when('/game', {
                    templateUrl: 'templates/game.html',
                    controller: 'GameCtrl'
                }).
                when('/campaign', {
                    templateUrl: 'templates/campaign.html',
                    controller: 'CampaignCtrl'
                }).
                when('/stats', {
                    templateUrl: 'templates/stats.html',
                    controller: 'StatCtrl'
                }).
                when('/', {
                    templateUrl: 'templates/scores.html',
                    controller: 'ScoresCtrl'
                });

            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        }]
);

angularApp.run(['notify', function (notify) {
    "use strict";
    notify.config({
        templateUrl: "templates/notification.html",
        duration : 5000,
    });
}]);
