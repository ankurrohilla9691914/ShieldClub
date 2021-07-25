const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDirectory = path.join(__dirname, '../productionLogs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


const production= {
    name: "production",
    assetPath: process.env.assetPath,
    uploadPath: process.env.uploadPath,
    sessionCookieKey: process.env.sessionCookieKey,
    db: process.env.db,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILER_ID,
            pass: process.env.MAILER_PASS
        }
    },
    GOOGLE_AUTH_clientID: process.env.GOOGLE_AUTH_clientID,
    GOOGLE_AUTH_clientSecret: process.env.GOOGLE_AUTH_clientSecret,
    GOOGLE_AUTH_callbackURL: process.env.GOOGLE_AUTH_callbackURL,
    jwtKey: process.env.jwtKey,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = production;