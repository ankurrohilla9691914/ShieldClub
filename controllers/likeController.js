const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){

    try {
        let likedOn;
        let deleted = false;
        if(req.query.type == 'Post'){
            likedOn = await Post.findById(req.query.id);
        }else{
            likedOn = await Comment.findById(req.query.id);
        }
        let liked = await Like.findOne({
            likedOnId: likedOn._id,
            onModel: req.query.type,
            user: req.user._id
        });

        if(liked){
            likedOn.likes.pull(liked._id);
            likedOn.save();
            liked.remove();
            deleted = true;
        }else{
            let like = await Like.create({
                likedOnId: likedOn._id,
                onModel: req.query.type,
                user: req.user._id
            });
            likedOn.likes.push(like._id);
            likedOn.save();
        }

        return res.status(200).json({
            message: 'Request Successful',
            data: {
                deleted : deleted
            }
        });
    } catch (error) {
        console.log("###", error);
        return res.status(200).json({
            message: 'Internal Error',
            data: {
                error : error
            }
        })
    }
    
}