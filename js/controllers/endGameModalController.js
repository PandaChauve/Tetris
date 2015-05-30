angular.module('angularApp.controllers')
    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'gameName', 'userStats', 'stateChecker', 'helpers', 'storage', 'audio',
        function ($scope, $modalInstance, gameName, userStats, stateChecker, helpers, storage, audio) {
            "use strict";
            audio.play(audio.ESounds.end);
            $scope.won = stateChecker.victory();
            $scope.published = false;

            $scope.nextGame = function () {
                $modalInstance.close();
            };

            $scope.stop = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.stats = (function () {
                function getMean(val, count, formater) {
                    if (formater === undefined) {
                        formater = Math.floor;
                    }
                    return formater(val / count);
                }

                var bg = userStats.getBestGameStats(gameName);
                var tg = userStats.getTotalGameStats(gameName);
                var cu = userStats.getCurrentGame();
                var ret = [];
                ret.push({
                    name: "Score",
                    value: cu.score,
                    best: bg.score,
                    sum: tg.score,
                    mean: getMean(tg.score, tg.gameCount)
                });
                ret.push({
                    name: "Time",
                    value: helpers.timeFromTics(cu.time),
                    best: helpers.timeFromTics(bg.time),
                    sum: helpers.timeFromTics(tg.time),
                    mean: getMean(tg.time, tg.gameCount, helpers.timeFromTics)
                });
                ret.push({
                    name: "Blocks",
                    value: cu.blockDestroyed,
                    best: bg.blockDestroyed,
                    sum: tg.blockDestroyed,
                    mean: getMean(tg.blockDestroyed, tg.gameCount)
                });
                ret.push({
                    name: "Swaps",
                    value: cu.swapCount,
                    best: bg.swapCount,
                    sum: tg.swapCount,
                    mean: getMean(tg.swapCount, tg.gameCount)
                });
                ret.push({
                    name: "Efficiency",
                    value: (cu.score / cu.swapCount).toFixed(2),
                    best: "/",
                    sum: "/",
                    mean: (tg.score / tg.swapCount).toFixed(2)
                });
                return ret;
            })();

        }]);
