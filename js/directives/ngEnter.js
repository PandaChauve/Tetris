//need to find the source of this one, it's not mine ...
angular.module('angularApp.directives')
    .directive('ngEnter', ['$document', function ($document) {
    "use strict";
    return {
        scope: {
            ngEnter: "&"
        },
        link: function (scope, element, attrs) {
            var enterWatcher = function (event) {
                if (event.which === 13) {
                    scope.ngEnter();
                    $document.unbind("keydown keypress", enterWatcher);
                }
            };
            $document.bind("keydown keypress", enterWatcher);
        }
    };
}]);
