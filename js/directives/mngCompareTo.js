angular.module('angularApp.directives').directive("mngCompareTo",function() {
    "use strict";
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=mngCompareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.mngCompareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
