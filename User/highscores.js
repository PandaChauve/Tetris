/**
 * Created by panda on 28/04/2015.
 */

function UserHighScores(){
    "use strict";
    this.arcadeScore = [0,0,0,0,0];
}

UserHighScores.prototype.SetArcadeScore = function(score){
    "use strict";
    for(var i = 0; i < this.arcadeScore.length; i+=1){
        if(score >= this.arcadeScore[i]){
            this.arcadeScore.splice(i,0,score);
            this.arcadeScore.splice(this.arcadeScore.length-1,1);
            var stor = UserStorage.GetStorage();
            stor.Set("UserHighScores", this);
            break;
        }
    }
};

UserHighScores.GetHighScore = function(){
    "use strict";
    var stor = UserStorage.GetStorage();
    var score = stor.Get("UserHighScores"); //will only return flat data
    var ret = new UserHighScores();
    if(score !== null){
        ret.arcadeScore = score.arcadeScore;
    }

    return ret;

};