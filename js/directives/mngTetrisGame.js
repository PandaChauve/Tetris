
angular.module('angularApp.directives').directive("mngTetrisGame", ['$swipe', 'game', 'userInput', function($swipe, game, userInput){
    "use strict";
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            var startX, startY, endX, endY;
            var scale = 1;
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
                scale = document.documentElement.clientWidth / 448;
            }
            if(document.documentElement.clientHeight < 600 && document.documentElement.clientHeight / 600 < scale)//FIXME magic number
            {
                scale = document.documentElement.clientHeight / 600;
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
                    if(Math.abs(startX - endX)/scale > 30){
                        game.slide(startX/scale, 600 - startY/scale, endX/scale, 600 - endY/scale); //FIXME 600 is canvas height
                    }
                }
            });
            game.linkToDom(element[0], attrs.mngTetrisGame, scale, scale);

            scope.$on('$destroy', function() {
                game.unlinkToDom(element[0],attrs.mngTetrisGame);
            });

            scope.test = function(e){
                console.log(e);
            };
        }
    };
}]);
