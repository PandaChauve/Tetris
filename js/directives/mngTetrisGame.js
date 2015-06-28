
angular.module('angularApp.directives').directive("mngTetrisGame", ['$swipe', 'game','audio', function($swipe, game, audio){
    "use strict";
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            $swipe.bind(element, {
                'start': function(coords) {
                    console.log(coords);
                },
                'end': function(coords) {
                    console.log(coords);
                }
            });
            game.linkToDom(element[0], attrs.mngTetrisGame);

            scope.$on('$destroy', function() {
                game.unlinkToDom(element[0],attrs.mngTetrisGame);
            });
            scope.$on('newSwaps', function() {
                audio.play(audio.ESounds.swap);
            });
            scope.$on('newScore', function() {
                audio.play(audio.ESounds.score);
            });
            scope.test = function(e){
                console.log(e);
            };
        }
    };
}]);
