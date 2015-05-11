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
    var foot = "";
    if(didWin){
        head = "<h1>Gratz ! You did it !</h1>";
        if(this.gameConfig.next !== undefined && game.config.next !== ""){
            foot = "<p ><a class='bigBtn' href='game.html?game="+game.config.next+"' >Try the next one ?</a></p>";
        }
    }
    else{
        head = ("<h1>Sorry, you failed !</h1>");
        foot = "<p><span id=\"tryAgain\" class='bigBtn'>Try again ?</span></p>";
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
    popup.append($(foot));

    popup.append($("<p><span id=\"publishSimple\" class='bigBtn'>Publish your score ?</span></p>"));

    var p = $("<div id='gamePopup'></div>");
    p.append(popup);
    $('body').append(p);

    var map = this.gameName;
    $("#publishSimple").click(function(){

        var store = UserStorage.GetStorage();
        var name = store.Get("UserName") || "";

        name = prompt("Who are you ?", name);
        store.Set("UserName", name);
        $.get("http://sylvain.luthana.be/api.php?add&name="+name+"&value="+stats.score+"&map="+ map);
    });

    $("#tryAgain").click(Reset);

};

EndGameScreen.prototype.SetRetryCallBack = function(cb){
    "use strict";
    this.retryCb = cb;
};