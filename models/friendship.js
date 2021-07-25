const mongoose = require('mongoose');

let friendshipSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    newMessages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
}, {
    timestamps: true
});


module.exports = new mongoose.model('Friendship', friendshipSchema);