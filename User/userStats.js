/**
 * Created by panda on 28/04/2015.
 */

function UserStats(){
    "use strict";
    this.points = {};
    this.timesLow = {}; //some times you want to go fast
    this.timesHigh = {}; //some you don't
}

UserStats.SetMaxStat = function(score, map ,stat){
    "use strict";
    var scores = UserStats.GetUserStats();
    if(!scores[stat].hasOwnProperty(map)){
        scores[stat][map] = [score,0,0,0,0];
    }
    else{
        for(var i = 0; i < scores[stat][map].length; i+=1){
            if(score >= scores[stat][map][i]){
                scores[stat][map].splice(i,0,score);
                scores[stat][map].splice(scores[stat][map].length-1,1);
                break;
            }
        }
    }

    var store = UserStorage.GetStorage();
    store.Set("UserStats_"+stat, scores[stat]);
};

UserStats.SetMinStat = function(score, map ,stat){
    "use strict";
    var scores = UserStats.GetUserStats();
    if(!scores[stat].hasOwnProperty(map)){
        scores[stat][map] = [score,-1,-1,-1,-1];
    }
    else{
        for(var i = 0; i < scores[stat][map].length; i+=1){
            if(score <= scores[stat][map][i] || scores[stat][map][i] === -1){
                scores[stat][map].splice(i,0,score);
                scores[stat][map].splice(scores[stat][map].length-1,1);
                break;
            }
        }
    }

    var store = UserStorage.GetStorage();
    store.Set("UserStats_"+stat, scores[stat]);
};

UserStats.SetHighScore = function(score, map){
    "use strict";
    UserStats.SetMaxStat(score, map, "points");
};

UserStats.SetTime = function(score, map){
    "use strict";
    UserStats.SetMinStat(score, map, "timesLow");
    UserStats.SetMaxStat(score, map, "timesHigh");
};

UserStats.prototype.GetHighScore = function(map) {
    "use strict";
    if(this.points.hasOwnProperty(map))
    {
        return this.points[map];
    }
    return [0,0,0,0,0];
};

UserStats.prototype.GetMinTime = function(map) {
    "use strict";
    if(this.timesLow.hasOwnProperty(map))
    {
        return this.timesLow[map];
    }
    return [-1,-1,-1,-1,-1];
};
UserStats.prototype.GetMaxTime = function(map) {
    "use strict";
    if(this.timesHigh.hasOwnProperty(map))
    {
        return this.timesHigh[map];
    }
    return [0,0,0,0,0];
};

UserStats.GetUserStats = function(){
    "use strict";
    var store = UserStorage.GetStorage();
    var score = store.Get("UserStats_points"); //will only return flat data
    var timesLow = store.Get("UserStats_timesLow"); //will only return flat data
    var timesHigh = store.Get("UserStats_timesHigh"); //will only return flat data
    var ret = new UserStats();
    if(score !== null) {
        ret.points = score;
    }
    if(timesLow !== null){
        ret.timesLow = timesLow;
    }
    if(timesHigh !== null){
        ret.timesHigh = timesHigh;
    }
    return ret;
};