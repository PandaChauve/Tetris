
angular.module('angularApp.directives').directive("mngTetrisGame", ['$swipe', 'game', 'KeyboardInput', 'systemConfig', function($swipe, game, KeyboardInput, systemConfig){
    "use strict";
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            if(!Detector.webgl){
                Detector.addGetWebGLMessage( document.getElementById('game'));
                return;
            }
            var startX, startY, endX, endY;
            var scale = 1;
            var lastClick = -1;
            var useSingleClick = !systemConfig.get(systemConfig.Keys.touchAndSlide);
            var tap = function(coords){
                var swapped = false;
                if(useSingleClick){
                    var bound = element[0].getBoundingClientRect();
                    endX = coords.pageX - bound.left;
                    endY = coords.pageY - bound.top;
                    swapped = game.touchSwap(endX / scale, 600 - endY / scale); //FIXME 600 is canvas height
                }
                if(!swapped){
                    var current = new Date().getTime();
                    if(current - lastClick < 300){
                        KeyboardInput.press(13);
                    }
                    lastClick = current;

                }
            };

            if(document.documentElement.clientWidth < 448)//FIXME magic number
            {
                scale = document.documentElement.clientWidth / 448;
            }
            if(document.documentElement.clientHeight < 600 && document.documentElement.clientHeight / 600 < scale)//FIXME magic number
            {
                scale = document.documentElement.clientHeight / 600;
            }
            element.bind('click', tap);
            if(!useSingleClick) {
                $swipe.bind(element, {
                    'start': function (coords) {
                        var bound = element[0].getBoundingClientRect();
                        startX = coords.x - bound.left;
                        startY = coords.y - bound.top;
                    },
                    'end': function (coords) {
                        var bound = element[0].getBoundingClientRect();
                        endX = coords.x - bound.left;
                        endY = coords.y - bound.top;
                        if (Math.abs(startX - endX) / scale > 30) {
                            game.slide(startX / scale, 600 - startY / scale, endX / scale, 600 - endY / scale); //FIXME 600 is canvas height
                        }
                    }
                });
            }
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
