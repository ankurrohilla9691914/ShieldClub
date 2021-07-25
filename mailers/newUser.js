const nodeMailer = require('../config/nodemailer');

exports.welcome = (email, name) => {
    nodeMailer.transporter.sendMail({
        from: "dagar@shield.com",
        to: email,
        subject: "Welcome",
        html: `<h3>Hi <strong>${name}</strong>, Welcome to shield social media website! Glad to have you.</h3>`
    },(err, mail) => {
        if(err){
            console.log(err);
            return;
        }
        return;
    })
}