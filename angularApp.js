
var angularApp = angular.module('angularApp', [
    'ngRoute',
    'statsControllers',
    'gameControllers'
]);
angularApp.controller('HeaderCtrl', function($scope, $location){
    "use strict";
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});

angularApp.filter('ticToTime', function() {
    return TimeFromTics;
});

angularApp.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
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