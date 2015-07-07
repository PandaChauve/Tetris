
angular.module('angularApp.directives').directive("mngTetrisGame", ['$swipe', 'game','audio', 'userInput', function($swipe, game, audio, userInput){
    "use strict";
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            var startX, startY, endX, endY;
            var scaleX = 1;
            var scaleY = 1;
            var lastClick = -1;

            var tap = function(){
                var current = new Date().getTime();
                if(current - lastClick < 300){
                    userInput.press(13);
                }
                lastClick = current;
            };
            element.bind('click', tap);

            if(document.documentElement.clientWidth < 448)//FIXME magic number
            {
                scaleX = document.documentElement.clientWidth / 448;
            }
            if(document.documentElement.clientHeight < 600)//FIXME magic number
            {
                scaleY = document.documentElement.clientHeight / 600;
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
                    if(Math.abs(startX - endX)/scaleX > 30){
                        game.slide(startX/scaleX, 600 - startY/scaleY, endX/scaleX, 600 - endY/scaleY); //FIXME 600 is canvas height
                    }
                }
            });
            game.linkToDom(element[0], attrs.mngTetrisGame, scaleX, scaleY);

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
