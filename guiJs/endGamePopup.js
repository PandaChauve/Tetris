/**
 * Created by panda on 10/05/2015.
 */


function EndGameScreen(config, gameName){
    "use strict";
    this.retryCb = null;
    this.gameConfig = config;
    this.gameName = gameName;
}


EndGameScreen.prototype.Hide = function(){
    "use strict";
    $("<div id='gamePopup'></div>").remove();
};

EndGameScreen.prototype.Display = function(stats, didWin){
    "use strict";
    function GettotString(val, count, formater){
        if(formater === undefined) {
            formater = Math.floor;
        }
        var txt = formater(val) + " (" + formater(val/count) + ")";
        return txt;
    }
    var userStats = UserStats.GetUserStats();
    var bg = userStats.GetBestGameStats(this.gameName);
    var tg = userStats.GetTotalGameStats(this.gameName);
    var popup = $("<div id='gamePopupContent'></div>");
    var head;
    if(didWin){
        head = "<h1>Gratz ! You did it !</h1>";
        if(this.gameConfig.next !== undefined && game.config.next !== ""){
            head += "<p><a href='game.html?game="+game.config.next+"'>Try the next one ?</a></p>";
        }
    }
    else{
        head = ("<h1>Sorry, you failed !</h1>");
        head += "<p><span id=\"tryAgain\" class='btn'>Do you want to try again ?</span></p><br /><br />";
    }
    popup.html(head);
    var table = $("<table>");
    var line = $("<tr><th>Stat</th><th>Current</th><th>Best</th><th>Total (mean)</th></tr>");
    table.append(line);

    line = $("<tr><td>Score</td><td>"+stats.score+"</td><td>"+bg.score+'</td><td>'+GettotString(tg.score, tg.gameCount)+"</td></tr>");
    table.append(line);
    line = $("<tr><td>Time</td><td>"+TimeFromTics(stats.time)+"</td><td>"+TimeFromTics(bg.time)+'</td><td>'+GettotString(tg.time, tg.gameCount, TimeFromTics)+"</td></tr>");
    table.append(line);
    line = $("<tr><td>Blocks</td><td>"+stats.blockDestroyed+"</td><td>"+bg.blockDestroyed+'</td><td>'+GettotString(tg.blockDestroyed, tg.gameCount)+"</td></tr>");
    table.append(line);
    line = $("<tr><td>Swaps</td><td>"+stats.swapCount+"</td><td>/</td><td>"+GettotString(tg.swapCount, tg.swapCount)+"</td></tr>");
    table.append(line);

    popup.append(table);

    var p = $("<div id='gamePopup'></div>");
    p.append(popup);
    $('body').append(p);

    $("#tryAgain").click(Reset);

};

EndGameScreen.prototype.SetRetryCallBack = function(cb){
    "use strict";
    this.retryCb = cb;
};