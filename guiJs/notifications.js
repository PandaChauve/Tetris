/**
 * Created by panda on 11/05/2015.
 */

function Notifications() {
    "use strict";
    this.notificationZone = $("#notificationZone");
    this.count = 0;
}

Notifications.prototype.notify = function (content) {
    "use strict";
    this.count += 1;
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now() + "_" + this.count;
    this.notificationZone.append($("<div class='notification' id='" + uniqid + "'>" + content + "</div>"));
    $("#" + uniqid).slideDown("slow");
    setTimeout(function () {
        $("#" + uniqid).slideUp("slow", function () {
            $(this).remove();
        });
    }, 10000);

};