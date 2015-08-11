angular.module('angularApp.directives')
    .directive('ngCx', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngCx', function(width) {
                elem.attr('cx', width);
            });
        };
    }).directive('ngDx', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngDx', function(width) {
                elem.attr('dx', width);
            });
        };
    }).directive('ngCy', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngCy', function(width) {
                elem.attr('cy', width);
            });
        };
    }).directive('ngTransform', function() {
        return function(scope, elem, attrs) {
            attrs.$observe('ngTransform', function(width) {
                elem.attr('transform', width);
            });
        };
    });
