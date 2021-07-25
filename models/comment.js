const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
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

module.exports = mongoose.model('Comment', commentSchema);