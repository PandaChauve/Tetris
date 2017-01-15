//FIXME the move to angular is way too partial, some work is needed !

angular.module('angularApp.controllers').controller('ArcadeLostController', ['$scope', '$interval', '$window', '$routeParams','userInput',
    function ($scope, $interval,$window, $routeParams, userInput) {

        function animate(){
                // parameters
                var a = 40,
                    speed = 50,
                    points = [
                        [ , , , ,1,1, , , , , , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1 ],
                        [ , , ,1,1, , , , , , ,1,1, , ,1,1, , ,1,1, , , , , , ,1,1, , , , , , ,1,1, , ,1,1],
                        [ , ,1,1, , , , , , ,1,1, , ,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, ],
                        [ ,1,1, , , , , , ,1,1, , ,1,1, , , , , , ,1,1, , ,1,1, , , , , , ,1,1, ,1,1, , , ],
                        [1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1,1,1,1,1, , ,1,1, , , ,1,1, ,  ]
                    ],
                    colors = [
                        '#ED1156', '#ED194E', '#ED2247', '#ED2B3F', '#EE3438',
                        '#EE3D31', '#EE4529', '#EF4E22', '#EF571A', '#EF6013',
                        '#F0690C', '#E8720E', '#E17B10', '#D98512', '#D28E14',
                        '#CB9816', '#C3A118', '#BCAA1A', '#B4B41C', '#ADBD1E',
                        '#A6C721', '#96C62F', '#87C53E', '#78C44D', '#69C35C',
                        '#5AC26B', '#4AC17A', '#3BC089', '#2CBF98', '#1DBEA7',
                        '#0EBDB6', '#0EBAB0', '#0EB8AA', '#0EB5A4', '#0EB39E',
                        '#0EB098', '#0EAE92', '#0EAB8C', '#0EA986', '#0EA680',
                        '#0EA47B', '#269376', '#3F8372', '#58736E', '#71626A',
                        '#895266', '#A24262', '#BB315E', '#D4215A'
                    ];

                // computed parameters
                var a2 = a/2,
                    h = Math.round(a2*Math.sqrt(3) *100)/100,
                    grid = [points[0].length, points.length],
                    size = [(grid[0]/2+0.5)*a+a*2, grid[1]*h+a*3],
                    nb_colors = colors.length,
                    objects = [],
                    groups = [];


                // init canvas
                var container = document.getElementById('lostSvg');
                container.style.width = size[0]+'px';
                container.style.height = size[1]+'px';

                var simplex = new SimplexNoise(),
                    paper = SVG(container).size(size[0], size[1]).viewbox(0, 0, size[0], size[1]);
                up = paper.defs().path('M'+ a2 +',0 l'+ a2 +','+ h +' l-'+ a +',0 l'+ a2 +',-'+ h),
                    down = paper.defs().path('M0,0 l'+ a +',0 l-'+ a2 +','+ h +' -'+ a2 +',-'+ h);

                // draw objects
                for (var l=0; l<grid[1]; l++) {
                    objects[l] = [];
                    groups[l] = paper.group();

                    for (var c=0; c<grid[0]; c++) {
                        if (!points[l][c]) {
                            continue;
                        }

                        var rnd = Math.round((simplex.noise(c/10, l/10)+1) / 2 * nb_colors),
                            cid = rnd - Math.floor(rnd/nb_colors)*nb_colors,
                            pos = [c*a2+a, l*h+a],
                            use;

                        if ((l%2==0 && c%2==0) || (l%2==1 && c%2==1)) {
                            use = up;
                        }
                        else {
                            use = down;
                        }

                        var el = paper.use(use)
                            .move(pos[0], pos[1])
                            .style('fill:'+colors[cid])
                            .data('i', rnd);

                        groups[l].add(el);
                        objects[l][c] = el;

                    }
                }


                var counter = 0;
                return $interval(function() {
                    // animate position
                    for (var l=0, i=groups.length; l<i; l++) {
                        if (Math.random()<0.5) {
                            groups[l].x(Math.round(Math.random()*a/5));
                        }
                    }

                    // animate colors
                    for (var l=0, i=objects.length; l<i; l++) {
                        for (var c=0, j=objects[l].length; c<j; c++) {
                            if (!objects[l][c]) {
                                continue;
                            }

                            var cid = objects[l][c].data('i') + counter;
                            cid-= Math.floor(cid/nb_colors)*nb_colors;

                            objects[l][c].style('fill:'+colors[cid]);
                        }
                    }

                    counter++;
                    if (counter == nb_colors) {
                        counter = 0;
                    }
                }, speed);
            }

        var animateInterval = animate();

        userInput.clear();
        $scope.lastGame = JSON.parse(localStorage.getItem("ArcadeLastGame"));
        $scope.type = $routeParams.type || "";
        var interval = $interval(function() {
                var reset = userInput.getReset();
                userInput.clearReset();
                if(reset)
                    $window.location.href="#!/";
                else {
                    var actions = userInput.getAllActions();
                    userInput.clear();
                    if (actions.length > 0) {
                        $window.location.href = "#!" + localStorage.getItem("ArcadeLastGameUri");
                    }
                }

            }, 20);

        $scope.$on('$destroy', function() {
            if (angular.isDefined(interval)) {
                $interval.cancel(interval);
                interval = undefined;
                $interval.cancel(animateInterval);
                animateInterval = null;
            }
        });
    }]);

