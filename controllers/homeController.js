const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');
module.exports.home = async function(req, res){
    try {
        if(req.user){
            let friendships = await Friendship.find({$and: [{$or: [{toUser: req.user}, {fromUser: req.user}]}, {active: true}]}).populate('newMessages');
            res.locals.friendships = friendships;
        }
        if(req.user && req.user.email == 'shubham222dagar@gmail.com')
        {   let posts = await Post.find({})
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
        else if(req.user){
            let posts = await Post.find({$or: [{user: {$in: req.user.friends}}, {user: req.user._id}]})
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
        return res.render('home', {
            title: "Shield | Home"
        });
    } catch (error) {
        console.log("###ERROR", error);
        return res.redirect('back');
    }
};