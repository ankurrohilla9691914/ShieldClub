const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');
const fs = require('fs');
const path = require('path');
const Like = require('../models/like');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports.createPost = function(req, res){
        
        Post.uploadedPost(req, res, function(err){
            if(err)
                console.log("###ERR###", err);
            Post.create({},async function(err, post){
                if(err)
                {
                    console.log(err, "Error in creating post");
                    return res.redirect('back');
                }
                post.content = req.body.content;
                post.user = req.user._id;
                if(req.file){
                    post.post = Post.postPath + req.file.filename;
                }

                // Compress Image TODO

                // let image = function(path){
                //     console.log(path);
                //     gulp.src(path)
                //     .pipe(imagemin())
                //     .pipe(gulp.dest(path));
                    
                // }
                // await image(post.post);
                
                post.save();
            });
        })
        return res.redirect('/home');
}

module.exports.newPost = function(req, res){
    return res.render('newPost', {
        title: "Shield | New Post"
    });
}

module.exports.deletePost = async function(req, res){
    try {
        let post = await Post.findById(req.params.id).populate('comments');
        if(post.user == req.user.id)
        {
            await Like.deleteMany({_id: {$in: post.comments.likes}});
            await Comment.deleteMany({post : req.params.id});
            await Like.deleteMany({
                onModel: 'Post',
                likedOnId: req.params.id
            });
            if(post.post)
            {
                if(fs.existsSync(path.join(__dirname, '..', post.post)))
                {
                    fs.unlinkSync(path.join(__dirname, '..', post.post));
                }
            }
            post.remove();
            for(comment of post.comments){
                await Like.deleteMany({_id: {$in : comment.likes}});
            }

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            return res.redirect('back');
        }
        else{
            console.log("You can't delete this post");
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}