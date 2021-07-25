const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    likedOnId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refpath: 'onModel'
    },
    onModel:{
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Like', likeSchema);