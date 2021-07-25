const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AvatarPath = path.join('/uploads/users/avatar');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required : true
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    },
    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    pendingRequests:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ]
},{
    timestamps : true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AvatarPath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})

//Static functions
user.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
user.statics.avatarPath = AvatarPath;

const User = mongoose.model('User', user);

module.exports = User;