const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const env = require('./environemnt');
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
var opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwtKey
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done) {
    User.findById(jwtPayload._id, function(err, user) {
        if (err) {
            console.log(err, 'Error in finding user using JWT');
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;