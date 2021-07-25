const nodemailer = require('nodemailer');
const ejs = require('ejs');
const env = require('./environemnt');
const path = require('path');

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log("###Error in rendering templates###", err);
                return;
                mailHTML = template;
            }
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}