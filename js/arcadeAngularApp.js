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
                templateUrl: 'resources/templates/arcade/game.html',
                controller: 'ArcadeGameCtrl'
            }).when('/lost/', {
                templateUrl: 'resources/templates/arcade/lost.html',
                controller: 'ArcadeLostController'
            }).when('/lost/:type', {
                templateUrl: 'resources/templates/arcade/lost.html',
                controller: 'ArcadeLostController'
            }).
                when('/menu/:menuName', {
                    templateUrl: 'resources/templates/arcade/menu.html',
                    controller: 'ArcadeMenuCtrl'
                }).
                when('/', {
                    templateUrl: 'resources/templates/arcade/menu.html',
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
