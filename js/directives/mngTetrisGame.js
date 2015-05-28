
angular.module('angularApp.directives').directive("mngTetrisGame", ['game','audio', function(game, audio){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            game.linkToDom(element[0],attrs.mngTetrisGame);

            scope.$on('$destroy', function() {
                game.unlinkToDom(element[0],attrs.mngTetrisGame);
            });
            scope.$on('newSwaps', function() {
                "use strict";
                audio.play(audio.ESounds.swap);
            });
            scope.$on('newScore', function() {
                "use strict";
                audio.play(audio.ESounds.score);
            });
        }
    };
}]);
