const nodeMailer = require('../config/nodemailer');

exports.otp = (email, otp) => {
    nodeMailer.transporter.sendMail({
        name: "Shield",
        from: "dagar@shield.com",
        to: email,
        subject: "One Time Password",
        html: `<h3>Your one time password for sign up: ${otp}</h3><h5>Otp will expire in nearly 10 minutes</h5>`
    },(err, mail) => {
        if(err){
            console.log(err);
            return;
        }
        return;
    })
}