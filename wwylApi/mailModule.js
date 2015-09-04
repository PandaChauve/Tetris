var config = require("./mailModuleConfig.js");
/* mailmoduleconfig content
 password not on github ^^

 module.exports = {
 host: "whenwillyoulose.com",
 auth: {
 user: 'contact@whenwillyoulose.com',
 pass: '*********'
 }
 };

 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport(config));

function SendMail(title, message, dest){
    "use strict";
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'contact@whenwillyoulose.com', // sender address
        to: dest, // list of receivers
        subject: title, // Subject line
        text: message
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
}

module.exports = {
    send : SendMail
};
