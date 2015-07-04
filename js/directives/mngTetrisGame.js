
angular.module('angularApp.directives').directive("mngTetrisGame", ['$swipe', 'game','audio', function($swipe, game, audio){
    "use strict";
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            var startX, startY, endX, endY;
            var scale = 1;
            var width = 448;

            if(document.documentElement.clientWidth < 448)//FIXME magic number
            {
                scale = document.documentElement.clientWidth / 448;
            }

            $swipe.bind(element, {
                'start': function(coords) {
                    var bound = element[0].getBoundingClientRect();
                    startX = coords.x - bound.left;
                    startY = coords.y - bound.top;
                },
                'end': function(coords) {
                    var bound = element[0].getBoundingClientRect();
                    endX = coords.x - bound.left;
                    endY = coords.y - bound.top;
                    game.slide(startX/scale, 600 - startY, endX/scale, 600 - endY); //FIXME 600 is canvas height
                }
            });
            game.linkToDom(element[0], attrs.mngTetrisGame, scale);

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
