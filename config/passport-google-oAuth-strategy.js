const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const env = require('./environemnt');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: env.GOOGLE_AUTH_clientID,
    clientSecret: env.GOOGLE_AUTH_clientSecret,
    clientID: env.GOOGLE_AUTH_callbackURL
},
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log("###Error in google-passport###", err);
                return;
            }

            console.log(profile);

            if(user){
                return done(null, user);
            }
            else{
                User.create({
                    name : profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(15).toString('hex'),
                    avatar: profile.photos[0].value

                }, function(err, user){
                    if(err){
                        console.log("###Error in google-passport###", err);
                        return;
                    }
                    return done(null, user);
                })
            }
        })
    }
))