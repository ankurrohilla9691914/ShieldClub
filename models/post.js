const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const PostPath = path.join('/uploads/users/posts/');

const postSchema = new mongoose.Schema({
    content : {
        type: String,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    post: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},
{
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', PostPath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})

//Static functions
postSchema.statics.uploadedPost = multer({storage : storage}).single('post');
postSchema.statics.postPath = PostPath;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;