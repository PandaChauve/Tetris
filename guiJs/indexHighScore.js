(function(){
    "use strict";
    var scores = UserStats.GetHighScores();

    var txt = "<h1>High Scores</h1><span>";
    txt += scores.GetHighScore("classic").join("</span><span>");
    txt += "</span>";
    $("#highScores").html(txt);
})();