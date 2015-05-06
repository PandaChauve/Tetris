/**
 * Created by panda on 28/04/2015.
 */

function UserHighScores(){
    "use strict";
    this.storage = {};
}

UserHighScores.SetHighScore = function(score, map){
    "use strict";
    var scores = UserHighScores.GetHighScores();
    if(!scores.storage.hasOwnProperty(map)){
        scores.storage[map] = [score,0,0,0,0];
    }
    else{
        for(var i = 0; i < scores.storage[map].length; i+=1){
            if(score >= scores.storage[map][i]){
                scores.storage[map].splice(i,0,score);
                scores.storage[map].splice(scores.storage[map].length-1,1);
                break;
            }
        }
    }

    var store = UserStorage.GetStorage();
    store.Set("UserHighScores", scores.storage);
};

UserHighScores.prototype.GetHighScore = function(map) {
    "use strict";
    if(this.storage.hasOwnProperty(map))
    {
        return this.storage[map];
    }
    return [0,0,0,0,0];
};

UserHighScores.GetHighScores = function(){
    "use strict";
    var store = UserStorage.GetStorage();
    var score = store.Get("UserHighScores"); //will only return flat data
    var ret = new UserHighScores();
    if(score !== null){
        if(score.arcadeScore !== undefined){
            score.storage = {classic: score.arcadeScore};
        }
        ret.storage = score;
    }
    return ret;
};