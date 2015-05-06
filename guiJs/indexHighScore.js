(function(){
    "use strict";
    function  TicToTime(arra){
        for(var i = 0; i < arra.length; i+= 1){
            arra[i] = TimeFromTics(arra[i]);
        }
        return arra;
    }
    var scores = UserStats.GetUserStats();

    var txt = "<h1>High Scores</h1><span>";
    txt += scores.GetHighScore("classic").join("</span><span>");
    txt += "</span>";
    txt += "<h1>Highest times</h1><span>";
    txt += TicToTime(scores.GetMaxTime("classic")).join("</span><span>");
    txt += "</span>";
    $("#highScores").html(txt);
})();