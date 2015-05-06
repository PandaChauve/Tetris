/**
 * Created by panda on 28/04/2015.
 */

function UserStats(){
    "use strict";
    this.points = {};
    this.times = {};
}

UserStats.SetMaxStat = function(score, map ,stat){
    "use strict";
    var scores = UserStats.UserStats();
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
    var scores = UserStats.UserStats();
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
    return UserStats.SetMaxStat(score, map, "points");
};

UserStats.SetTime = function(score, map){
    "use strict";
    return UserStats.SetMinStat(score, map, "times");
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
    if(this.times.hasOwnProperty(map))
    {
        return this.times[map];
    }
    return [-1,-1,-1,-1,-1];
};

UserStats.UserStats = function(){
    "use strict";
    var store = UserStorage.GetStorage();
    var score = store.Get("UserStats_points"); //will only return flat data
    var time = store.Get("UserStats_time"); //will only return flat data
    var ret = new UserStats();
    if(score !== null){
        ret.points = score;
        ret.times = time;
    }
    return ret;
};