(function(){
    "use strict";
    var scores = UserHighScores.GetHighScore();
    var txt = "<h1>High Scores</h1><span>";
    txt += scores.arcadeScore.join("</span><span>");
    txt += "</span>";
    $("#highScores").html(txt);
})();