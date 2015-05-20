/**
 * Created by panda on 28/04/2015.
 */

function UserStats() {
    "use strict";
    this.points = {};
    this.timesLow = {}; //some times you want to go fast
    this.timesHigh = {}; //some you don't
    this.bestGameStats = {};
    this.totalGameStats = {};
}

UserStats.prototype.SetMaxStat = function (score, map, stat) {
    "use strict";
    if (!this[stat].hasOwnProperty(map)) {
        this[stat][map] = [score, 0, 0, 0, 0];
    }
    else {
        for (var i = 0; i < this[stat][map].length; i += 1) {
            if (score >= this[stat][map][i]) {
                this[stat][map].splice(i, 0, score);
                this[stat][map].splice(this[stat][map].length - 1, 1);
                break;
            }
        }
    }

    var store = UserStorage.GetStorage();
    store.Set("UserStats_" + stat, this[stat]);
};

UserStats.prototype.SetMinStat = function (score, map, stat) {
    "use strict";
    if (!this[stat].hasOwnProperty(map)) {
        this[stat][map] = [score, -1, -1, -1, -1];
    }
    else {
        for (var i = 0; i < this[stat][map].length; i += 1) {
            if (score <= this[stat][map][i] || this[stat][map][i] === -1) {
                this[stat][map].splice(i, 0, score);
                this[stat][map].splice(this[stat][map].length - 1, 1);
                break;
            }
        }
    }

    var store = UserStorage.GetStorage();
    store.Set("UserStats_" + stat, this[stat]);
};

UserStats.prototype.AddGame = function (game, map) {
    "use strict";
    var store = UserStorage.GetStorage();
    if (!this.bestGameStats.hasOwnProperty(map)) {
        this.bestGameStats[map] = game;
    }
    else {
        GameStats.KeepBest(this.bestGameStats[map], game);
    }
    store.Set("UserStats_bestGameStats", this.bestGameStats);

    if (!this.totalGameStats.hasOwnProperty(map)) {
        this.totalGameStats[map] = game;
    }
    else {
        GameStats.Append(this.totalGameStats[map], game);
    }
    store.Set("UserStats_totalGameStats", this.totalGameStats);

    this.SetMaxStat(game.score, map, "points");
    this.SetMinStat(game.time, map, "timesLow");
    this.SetMaxStat(game.time, map, "timesHigh");
};


UserStats.prototype.GetBestGameStats = function (map) {
    "use strict";
    if (this.bestGameStats.hasOwnProperty(map)) {
        return this.bestGameStats[map];
    }
    var ret = new GameStats(map);
    return ret;
};

UserStats.prototype.GetTotalGameStats = function (map) {
    "use strict";
    if (this.totalGameStats.hasOwnProperty(map)) {
        return this.totalGameStats[map];
    }
    var ret = new GameStats(map);
    return ret;
};


UserStats.prototype.GetHighScore = function (map) {
    "use strict";
    if (this.points.hasOwnProperty(map)) {
        return this.points[map];
    }
    return [0, 0, 0, 0, 0];
};

UserStats.prototype.GetMinTime = function (map) {
    "use strict";
    if (this.timesLow.hasOwnProperty(map)) {
        return this.timesLow[map];
    }
    return [-1, -1, -1, -1, -1];
};

UserStats.prototype.GetMaxTime = function (map) {
    "use strict";
    if (this.timesHigh.hasOwnProperty(map)) {
        return this.timesHigh[map];
    }
    return [0, 0, 0, 0, 0];
};

UserStats.GetUserStats = function () {
    "use strict";
    var store = UserStorage.GetStorage();
    var score = store.Get("UserStats_points"); //will only return flat data
    var timesLow = store.Get("UserStats_timesLow"); //will only return flat data
    var timesHigh = store.Get("UserStats_timesHigh"); //will only return flat data
    var bestGameStats = store.Get("UserStats_bestGameStats"); //will only return flat data
    var totalGameStats = store.Get("UserStats_totalGameStats"); //will only return flat data
    var ret = new UserStats();
    if (score !== null) {
        ret.points = score;
    }
    if (timesLow !== null) {
        ret.timesLow = timesLow;
    }
    if (timesHigh !== null) {
        ret.timesHigh = timesHigh;
    }
    if (bestGameStats !== null) {
        ret.bestGameStats = bestGameStats;
    }
    if (totalGameStats !== null) {
        ret.totalGameStats = totalGameStats;
    }
    return ret;
};