const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

module.exports.createComment = async function(req, res){
    if(req.isAuthenticated()){
        try {
            let post = await Post.findById(req.body.postid).populate('user');
            if(post){
            let comment = await Comment.create({
                comment : req.body.comment,
                user: req.user._id,
                post: req.body.postid
            });
            if(comment)
            {
                post.comments.push(comment);
                post.save();
            }

            comment = await comment.populate('user').execPopulate();
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Added"
                });
            }
            return res.redirect('back');
        }
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
}

module.exports.deleteComment = async function(req, res){
    try {
        let comment = await Comment.findById(req.params.id);
        let postId = comment.post;
        comment.remove();

        await Post.findByIdAndUpdate(postId, {$pull : {comments : req.params.id}});
        await Like.deleteMany({
            onModel: 'Comment',
            likedOnId: req.params.id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Comment Deleted!"
            });
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}