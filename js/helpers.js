/**
 * Created by panda on 26/04/2015.
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i += 1) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
}

function TimeFromTics(totaTics) {
    "use strict";
    var totalSec = Math.floor(totaTics / 60);
    var minutes = Math.floor(totalSec / 60);
    var seconds = totalSec % 60;
    var tics = Math.floor((totaTics % 60 ) / 6);
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) + "." + tics;
}