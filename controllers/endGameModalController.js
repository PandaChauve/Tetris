
var angularAppC = angular.module('angularApp.controllers');
angularAppC.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'won', 'gameName', 'statistics', function ($scope, $modalInstance, won, gameName, statistics) {
    $scope.won = won;
    $scope.published = false;
    $scope.publish = function () {
        "use strict";
        if (!$scope.published) {
            $scope.published = true;
            var store = UserStorage.GetStorage();
            var name = store.Get("UserName") || "";

            name = prompt("Who are you ?", name);
            if (name) {
                store.Set("UserName", name);

                var ciphertext = stringToHex(des("wireshar", "yop" + statistics.score, 1, 0)); //just for avoiding zfa on wireshark
                $.get("http://sylvain.luthana.be/api.php?add&name=" + name + "&value=" + ciphertext + "&map=" + gameName);
            }
            else {
                $scope.published = false;
            }
        }
    };

    $scope.nextGame = function () {
        $modalInstance.close();
    };

    $scope.stop = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.stats = (function () {
        "use strict";
        function GetMean(val, count, formater) {
            if (formater === undefined) {
                formater = Math.floor;
            }
            return formater(val / count);
        }

        var userStats = UserStats.GetUserStats();
        var bg = userStats.GetBestGameStats(gameName);
        var tg = userStats.GetTotalGameStats(gameName);
        var ret = [];
        ret.push({
            name: "Score",
            value: statistics.score,
            best: bg.score,
            sum: tg.score,
            mean: GetMean(tg.score, tg.gameCount)
        });
        ret.push({
            name: "Time",
            value: TimeFromTics(statistics.time),
            best: TimeFromTics(bg.time),
            sum: TimeFromTics(tg.time),
            mean: GetMean(tg.time, tg.gameCount, TimeFromTics)
        });
        ret.push({
            name: "Blocks",
            value: statistics.blockDestroyed,
            best: bg.blockDestroyed,
            sum: tg.blockDestroyed,
            mean: GetMean(tg.blockDestroyed, tg.gameCount)
        });
        ret.push({
            name: "Swaps",
            value: statistics.swapCount,
            best: bg.swapCount,
            sum: tg.swapCount,
            mean: GetMean(tg.swapCount, tg.gameCount)
        });
        ret.push({
            name: "Efficiency",
            value: (statistics.score / statistics.swapCount).toFixed(2),
            best: "/",
            sum: "/",
            mean: (tg.score / tg.swapCount).toFixed(2)
        });
        return ret;
    })();


}]);
