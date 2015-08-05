angular.module('angularApp.controllers')
    .controller('AboutCtrl', ['$scope', '$anchorScroll','$location', function ($scope, $anchorScroll, $location) {
        "use strict";
        $scope.gotoAnchor = function(x) {
            var newHash = x;
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash( x);
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        };
    }]);
