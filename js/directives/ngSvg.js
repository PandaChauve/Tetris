angular.module('angularApp.directives')
    .directive('ngCx', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngCx', function(width) {
                elem.attr('cx', width);
            });
        };
    }).directive('ngCy', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngCy', function(width) {
                elem.attr('cy', width);
            });
        };
    });