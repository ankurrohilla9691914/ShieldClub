const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let post = await Post.find({})
    .populate('user')
    .populate({
        path: "comments",
        populate :{
            path: 'user'
        }
    });

    return res.status(200).json({
        message: "List of Posts",
        Post : post
    })
}

module.exports.deletePost = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);
        if(post.user = req.user.id)
        {
            post.remove();
            await Comment.deleteMany({post : req.params.id});
            return res.status(200).json({
                message: "Post and assosiated comment deleted successfully"
            })
        }
        return res.status(200).json({
            message: "You can not delete this post"
        })
    } catch (error) {
        console.log("********",error);
    }
}