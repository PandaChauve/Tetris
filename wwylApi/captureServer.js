var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function padTo8(number) {
    if (number<=9999999) { number = ("000000000"+number).slice(-8); }
    return number;
}
function handler (req, res) {
}
var counter = 0;
var d = new Date().toJSON().slice(0,10);
io.on('connection', function (socket) {
    socket.on('image', function (data) {
        var base64Data = data.replace(/^data:image\/png;base64,/, "");

        fs.writeFile("captures\\"+(d)+"_"+padTo8(counter)+".png", base64Data, 'base64', function(err) {console.log(err);});
        counter += 1
    });
});
