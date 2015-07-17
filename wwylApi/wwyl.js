var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('tetrisApi.sqlite');
var mail = require('./mailModule.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var crypto = require('crypto');

mail.send("WWYL Api restarted", "Check if it's normal !", "sylvain.chevremont@gmail.com"); //test the mail system and alert me for api restart


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    next();
});


var router = express.Router();
router.get('/', function (req, res) {
    res.json({success: false, message: 'Sorry this is the api'});
});

router.route('/scores').post(function (req, res) {
    db.run("INSERT INTO scores VALUES($score, $user, $map)", {
        $score: req.body.score,
        $user: req.body.user,
        $map: req.body.map
    }, function(err){
        "use strict";
        if(err){
            res.json(CreateError("can't add score", err));
        }
        else{
            db.run("DELETE FROM scores WHERE map = $map and user_id = $user and score < (SELECT score FROM scores WHERE map = $map and user_id = $user order by score DESC LIMIT 1 OFFSET 2 )", {
                $user: req.body.user,
                $map: req.body.map
            }, function(err){
                if(err){
                    res.json(CreateError("Can't clean db", err));
                }
                else{
                    res.json({success: true, message: 'New score, db cleaned'});
                }
            });
        }
    });
});

router.route('/scores/:map').get(function (req, res) {
    db.all("SELECT s.score, u.name FROM scores as s, users as u WHERE s.user_id = u.rowid and s.map=$map ORDER BY score DESC limit 50", {$map: req.params.map},
        function (err, rows) {
            if(err){
                res.json(CreateError("can't read scores ...", err));
            }
            else{
                res.json(rows);
            }
    });
});

router.route('/users').post(function (req, res) {
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var salt = makeid();
    var shasum = crypto.createHash('sha512');
    shasum.update(salt + req.body.password);
    var hash = shasum.digest('hex');
    db.run("INSERT INTO users VALUES(NULL, $userName, $hash, $salt, NULL, NULL)", {
        $userName: req.body.userName,
        $hash: hash,
        $salt: salt
    }, function (err) {
        if (err === null) {
            res.json({
                success: true,
                message: "user created"
            });
        }
        else {
            res.json(CreateError("can't create user, already exists ?", err));

        }
    });
});

function GetUser(req, res) {
    db.get("SELECT * from users where user_id=$userId and hash=$hash", {
        $hash: req.params.hash,
        $userId: req.params.userid
    }, function (err, row) {
        if (err || !row) {
            res.json(CreateError("Invalid user", err));
        }
        else {
            res.json({
                id: row.user_id,
                name: row.name,
                email: row.email,
                hash: row.hash,
                data: row.data,
                success: true
            });
        }
    });
}
router.route('/users/:userid').get(function (req, res) {
    db.get("SELECT * from users where user_id=$userId", {
        $userId: req.params.userid
    }, function (err, row) {
        if (err || !row) {
            res.json(CreateError("Invalid user", err));
        }
        else {
            res.json({
                id: row.user_id,
                name: row.name,
                email: "INVALID CREDENTIALS",
                hash: "INVALID CREDENTIALS",
                data: row.data,
                success: true
            });
        }
    });
});


router.route('/users/:userid/:hash').put(function (req, res) {
    db.get("SELECT * from users where user_id=$userId and hash=$hash", {
        $userId: req.params.userid,
        $hash: req.params.hash
    }, function (err, row) {
        if (err || !row) {
            res.json(CreateError("Invalid user", err));
            return;
        }
        var hash = req.params.hash;
        if(req.body.password) {
            var shasum = crypto.createHash('sha512');
            shasum.update(row.salt + req.body.password);
            hash = shasum.digest('hex');
        }
        var name = row.name;
        if(req.body.name){
            name = req.body.name;
        }
        var data = row.data;
        if(req.body.data){
            data = req.body.data;
        }
        var email = row.email;
        if(req.body.email){
            email = req.body.email;
        }
        db.run("UPDATE users set data=$data, hash=$newHash, name=$name, email=$email where user_id=$userId and hash=$hash", {
            $hash: req.params.hash,
            $userId: req.params.userid,
            $newHash: hash,
            $data: data,
            $name: name,
            $email: email
        }, function(err){
            if(err){
                res.json(CreateError("Invalid user", err));
                return;
            }
            else{
                req.params.hash = hash;
                GetUser(req, res);
            }
        });

    });
}).get(function (req, res) {
    GetUser(req, res);
});

router.route('/users/validate').post(function (req, res) {
    db.get("SELECT * FROM users WHERE name = $name", {
        $name: req.body.name
    }, function (err, row) {
        if (err || !row) {
            res.json(CreateError("can't find user", err));
        }
        else {
            var shasum = crypto.createHash('sha512');
            shasum.update(row.salt + req.body.password);
            var hash = shasum.digest('hex');
            if (hash != row.hash) {
                res.json(CreateError("invalid password", null));
            }
            else {
                res.json({
                    success: true,
                    id: row.user_id,
                    name: row.name,
                    hash: row.hash,
                    data: row.data,
                    message: "user found"
                });
            }
        }
    });
});

function CreateError(msg, err){
    "use strict";
    if(err){
        console.log(msg + " " +err+ " "+ err.message );
        return { success: false, message: msg, error: err.message};
    }
    else{
        console.log(msg + " " + err );
        return { success: false, message: msg, error: err};
    }
}

app.use('/wwylApi', router);
app.listen(1337);

console.log("started");
