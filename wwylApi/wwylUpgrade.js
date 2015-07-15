/**
 * Created by panda on 15/07/2015.
 */
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('tetrisApi.sqlite');

db.all("SELECT * from users", {}, function(err, rows){
    "use strict";
    if(err || !rows){
        console.log("can't update db " + err.message );
        return;
    }

    for(var z = 0; z < rows.length; z++){
        var row = rows[z];
        console.log(row.name);
        var data = JSON.parse(row.data);
        for(var key in data){
            data[key] = JSON.parse(data[key]);
        }
        db.run("UPDATE users set data = $data where user_id = $id", {
            $data : JSON.stringify(data),
            $id: row.user_id
        }, function(err){
            if(err){
                console.log("can't update db field" + err.message );
            }
        })
    }
});
