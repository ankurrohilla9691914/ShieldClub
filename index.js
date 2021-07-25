const express = require('express');
const app = express();
require('./config/time').time(app);
require('./config/view-helper')(app);
const expressLayouts = require('express-ejs-layouts');
const logger = require('morgan');
const port = 1000;
const cookieParser = require('cookie-parser');
const db = require("./config/mongoose");
const env = require('./config/environemnt');
const session = require('express-session');
const passport = require('passport');
const passportJWT = require('./config/passport-jwt');
const passportLocal = require('./config/passport-local-strategy'); 
const passportGoogle = require('./config/passport-google-oAuth-strategy');
const multer = require('multer');
const mongoStore = require('connect-mongo')(session);
const upload = multer();
const chatServer = require('http').Server(app);
const chatSocket = require('./config/socket').chatSocket(chatServer);
chatServer.listen(5000);
const path = require('path');
console.log("Chat server running on port: 5000");

app.set("view engine",'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use('/uploads',express.static(path.join(__dirname, env.uploadPath)));
app.use(express.static(env.assetPath));
app.use(express.urlencoded({extended: false}));
app.use(expressLayouts);
app.use(cookieParser());
app.use(logger(env.morgan.mode, env.morgan.options))
app.set("layout extractScripts", true);
// app.set("layout extractStyles", true);


app.use(session({
        name: 'shield',
        secret: env.sessionCookieKey,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000*60*60*24)
        },
        store: new mongoStore({
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || "connect-mongo setup ok");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use('/', require('./routers/index'));

app.listen(port, function(err){
    if(err)
        console.log(`ERROR IN RUNNING SERVER AT ${port}`);
    else
    console.log(`SUCCESSFULLY RUNNING SERVER AT ${port}`);
});
