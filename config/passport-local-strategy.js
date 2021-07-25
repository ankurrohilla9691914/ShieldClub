const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');


passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function(email, password, done){
        User.findOne({email : email}, function(err, user){
            if(err)
            {
                console.log('Error in finding user -> passport');
                return done(err);
            }
            if(!user || user.password != password){
                console.log("Invalid Email/Password");
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user -> passport');
            return done(err);
        }
        return done(null, user);
    });
});

//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = async function(req, res, next){
    if(req.isAuthenticated()){
        let user = await User.findById(req.user.id).populate('friends').populate('likes');
        res.locals.user = user;
        res.locals.admin = "shubham222dagar@gmail.com";
    }
    next();
}

module.exports = passport;