const mongoose = require('mongoose');
const User = require('../models/user');
const Friendship = require('../models/friendship');
const Post = require('../models/post');
const Otp = require('../models/opt');
const fs = require('fs');
const path = require('path');
const otpMailer = require('../mailers/otpMailer');
const newUserMailer = require('../mailers/newUser');

module.exports.SignIn = function(req, res){
    if(req.isAuthenticated())
        return res.redirect('/home');
    return res.render('SignIn', {
        title: "Shield | Sign In"
    });
}

module.exports.SignUp = function(req, res){
    if(req.isAuthenticated())
        return res.redirect('/home');
    return res.render('SignUp', {
        title: "Shield | Sign Up"
    });
}

module.exports.sendOTP = async function(req, res){
    try {
        if(req.xhr){
            let otp = await Otp.findOne({email: req.body.email});
            let status = '';
            if(otp){
                otpMailer.otp(req.body.email, otp.otp);
                status = "old";
            }
            if(!otp){
                let minm = 100000; 
                let maxm = 999999; 
                let newotp = Math.floor(Math .random() * (maxm - minm + 1));
                otp = await Otp.create({otp: newotp, email: req.body.email});
                status = "new";
                otpMailer.otp(req.body.email, newotp);
            }
            return res.status(200).json({
                message: "OTP SENT",
                data: {
                    status: status
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}

module.exports.create = async function(req, res){
    try {
        if(req.body.password != req.body.cpassword)
        {
            if(req.xhr)
                return res.status(200).json({
                    message: "Password didn't match!",
                    data: {
                        status: "unmatched"
                    }
                })
            console.log("Password didn't match!");
            return res.redirect('back');
        }
        let user = await User.findOne({email : req.body.email});
        if(!user)
        {
            let otp = await Otp.findOne({
                email: req.body.email
            });
            if(!otp){
                return res.staus(200).json({
                    message: "Otp Expired!",
                    data: {
                        status: 'expired'
                    }
                });
            }
            if(otp.otp == req.body.otp)
            {
                user  = await User.create(req.body);
                otp.remove();
                newUserMailer.welcome(user.email, user.name);
                if(req.xhr)
                    return res.status(200).json({
                        message: "Created",
                    });
                return res.render('signIn');
            }else{
                if(req.xhr)
                    return res.status(200).json({
                        message: "Wrong OTP",
                        data: {
                            status: "wrong"
                        }
                    })
                return res.redirect('back');
            }
        }
        else
        {
            if(req.xhr)
                return res.status(200).json(200, {
                    message: "Email already exists!",
                    data: {
                        status: "email-exist"
                    }
                })
            console.log('Email already exists!');
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
    
};

module.exports.createSession = function(req, res){
    return res.redirect('/home');
}

module.exports.profile = async function(req, res){
    try {
        let user = await User.findById(req.params.id);
        res.locals.profileUser = user;
        if(user._id == req.user.id){
            let posts = await Post.find({user: req.params.id})
                .populate('user')
                .populate({
                    path: "comments",
                    populate :{
                        path: 'user'
                    },
                }).populate({
                    path: "comments",
                    populate: {
                        path: 'likes'
                    }
                })
                .populate('likes')
                .sort('-createdAt');
            res.locals.posts = posts;
        }
        let isFriends = await Friendship.findOne({toUser: req.params.id, fromUser: req.user._id}).populate('messages').populate('newMessages');
        if(!isFriends){
            isFriends = await Friendship.findOne({fromUser: req.params.id, toUser: req.user._id}).populate('messages').populate('newMessages');
        }
        let iscurrFriends = await User.findOne({_id: req.user.id, friends: {$in : req.params.id}});
        if(!isFriends){
            res.locals.status = 'Request';
        }else{
            let fromUser = await User.findById(req.user._id);
            let toUser = await User.findById(req.params.id);
            let isMypending = await User.findOne({_id: fromUser._id, pendingRequests: {$in : isFriends._id}});
            let isHispending = await User.findOne({_id: toUser._id, pendingRequests: {$in : isFriends._id}});
            if(isMypending){
                res.locals.status = 'Accept';
            }else if(isHispending){
                res.locals.status = 'Cancel';
            }else{
                if(iscurrFriends){
                    res.locals.status = 'Unfriend';
                    let posts = await Post.find({user: req.params.id})
                    .populate('user')
                    .populate({
                        path: "comments",
                        populate :{
                            path: 'user'
                        },
                    }).populate({
                        path: "comments",
                        populate: {
                            path: 'likes'
                        }
                    })
                    .populate('likes')
                    .sort('-createdAt');
                    res.locals.friendship = isFriends;
                    res.locals.posts = posts;
                }else{
                    res.locals.status = 'Request';
                }
            }
        }
        return res.render('profile', {
            title: `${user.name}`
        });
    } catch (error) {
        console.log("###", error);
    }
    return res.redirect('back');
}

module.exports.SignOut = function(req, res){
    req.logout();
    return res.redirect('sign-in');
}

//Update with files

 module.exports.UpdateProfile = async function(req, res){
    try {
        let user = await User.findById(req.user.id);
        User.uploadedAvatar(req, res, function(err){
            if(err)
                console.log("###ERR###", err);
            user.name = req.body.name;
            if(req.file){
                if(user.avatar){
                    if(fs.existsSync(path.join(__dirname, '..', user.avatar)))
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
        })
    } catch (error) {
        console.log("******", error);
    }
    return res.redirect('back');
}

//My requests
module.exports.myRequests = async function(req, res){
    let requests = await User.findById(req.user.id)
    .populate({
        path: 'pendingRequests',
        populate: {
            path: 'fromUser'
        }
    });
    res.locals.requests = requests.pendingRequests;
    return res.render('requests', {
        title: "My Requests"
    });
}

//Create friendship

module.exports.modifyFriendship = async function(req, res){
    try {
        let isFriends = await Friendship.findOne({toUser: req.params.id, fromUser: req.user._id});
        if(!isFriends){
            isFriends = await Friendship.findOne({fromUser: req.params.id, toUser: req.user._id});
        }

        let iscurrFriends = await User.findOne({_id: req.user.id, friends: {$in : req.params.id}});

        if(!isFriends){
            let friendship = await Friendship.create({
                fromUser: req.user._id,
                toUser: req.params.id,
                active: false
            });
            await User.findByIdAndUpdate(req.params.id, {$push : {pendingRequests : friendship._id}});
            if(req.xhr){
                return res.status(200).json({
                    message: "Request Sent",
                    data: {
                        status: "Cancel"
                    }
                });
            }
        }else{
            let fromUser = await User.findById(req.user._id);
            let toUser = await User.findById(req.params.id);
            let isMypending = await User.findOne({_id: fromUser._id, pendingRequests: {$in : isFriends._id}});
            let isHispending = await User.findOne({_id: toUser._id, pendingRequests: {$in : isFriends._id}});

            if(isMypending){
                await isMypending.update({$pull: {pendingRequests: isFriends._id}});
                await fromUser.friends.push(toUser._id);
                await toUser.friends.push(fromUser._id);
                await fromUser.save();
                await toUser.save();
                isFriends.active = true;
                await isFriends.save();
                if(req.xhr){
                    return res.status(200).json({
                        message: "Request Accepted",
                        data: {
                            status: "Unfriend",
                            profUser_id: toUser._id
                        }
                    });
                }
            }else if(isHispending){
                await isHispending.update({$pull: {pendingRequests: isFriends._id}});
                if(req.xhr){
                    return res.status(200).json({
                        message: "Request Cancelled",
                        data: {
                            status: "Request"
                        }
                    });
                }
            }else{
                if(iscurrFriends){
                    await toUser.update({$pull: {friends: fromUser._id}});
                    await fromUser.update({$pull: {friends: toUser._id}});
                    isFriends.active = false;
                    await isFriends.save();
                    if(req.xhr){
                        return res.status(200).json({
                            message: "Unfriended",
                            data: {
                                status: "RequestU",
                                id: req.params.id
                            }
                        });
                    }
                }else{
                    isFriends.fromUser = req.user.id;
                    isFriends.toUser = req.params.id;
                    await isFriends.save();
                    await toUser.pendingRequests.push(isFriends._id);
                    await toUser.save();
                    if(req.xhr){
                        return res.status(200).json({
                            message: "Request Sent",
                            data: {
                                status: "Cancel"
                            }
                        });
                    }
                }
            }
        }
        return res.redirect('back');
    } catch (error) {
        console.log('###', error);
    }
    return res.redirect('back');
}

//Deleting Friend Request
module.exports.deleteRequest = async function(req, res){
    try {
        let friendship = await Friendship.findOne({fromUser: req.params.id, toUser: req.user._id});
        if(!friendship)
            friendship = await Friendship.findOne({toUser: req.user._id, fromUser: req.params.id});
        let user = await User.findById(req.user._id);
        await user.update({$pull: {pendingRequests: friendship._id}});
        user.save();
        if(req.xhr){
            return res.status(200).json({
                message: "Declined Friend Request",
            });
        }
    } catch (error) {
        console.log('###', error);
    }
    return res.redirect('back');
}

module.exports.search = function(req, res){
    return res.render('search', {
        title: "Search"
    });
}

module.exports.searchUsers = async function(req, res){
    try {
        let users = await User.find({name: {$regex: `${req.body.name}`, $options: "$i"}});
        res.locals.searchedUsers = users;
    } catch (error) {
        console.log('###', error);
    }
    return res.render('search', {
            title: `Search | ${req.body.name}`
    });
}


module.exports.setting = function(req, res){
    return res.render('setting', {
        title: "Settings"
    });
}

module.exports.updatePassword = async function(req, res){
    try {
        let user = await User.findById(req.user.id);
        if(req.body.prevPass != user.password){
            if(req.xhr){
                return res.status(200).json({
                    message: "Entered Wrong Password",
                    data: {
                        status: 0  //If entered password is Wrong
                    }
                })
            }
        }else{
            if(req.body.newPass == req.body.conPass){
                await user.update({password: req.body.newPass});
                await user.save();
                if(req.xhr){
                    return res.status(200).json({
                        message: "Password Changed",
                        data: {
                            status: 1  //If entered password is Updated
                        }
                    })
                }
            }else{
                if(req.xhr){
                    return res.status(200).json({
                        message: "New Password did not matched",
                        data: {
                            status: 2
                        }
                    })
                }
            }
        }
    } catch (error) {
        console.log('###', error);
    }    
    return res.redirect('back');
}