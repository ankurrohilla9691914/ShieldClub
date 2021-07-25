const User = require('../models/user');
const Message = require('../models/message');
const Friendship = require('../models/friendship');

module.exports.chatSocket = function(chatServer){
    let io = require('socket.io')(chatServer);

    io.sockets.on('connection', function(socket){
        socket.on('join-room', async function (data){
            await socket.join(data.chatID);
            if(socket.adapter.rooms[data.chatID].length == 1){
                data.single = true;
            }
            let user = await User.findById(data.userID);
            let friendship = await Friendship.findById(data.chatID).populate('messages').populate('newMessages');
            if(friendship.newMessages && friendship.newMessages.length !=0 &&friendship.newMessages[0].fromUser != data.userID){
                for(let i = 0; i < friendship.newMessages.length; i++){
                    friendship.messages.push(friendship.newMessages[i]._id);
                    friendship.newMessages.pull(friendship.newMessages[i]._id);
                }
                friendship.save();
            }

            data.messages = friendship.messages;
            data.user = user;
            io.in(data.chatID).emit(`user-joined`, data);
            socket.on('disconnect', function(){
                socket.in(data.chatID).emit('went-offline');
            })
        })
        socket.on('send-message',async function(data){
            try {
            let message = await Message.create({
                message: data.message,
                fromUser: data.userID
            });
            let friendship = await Friendship.findById(data.chatID);
            if(socket.adapter.rooms[data.chatID].length == 1)
            {
                friendship.newMessages.push(message);
                data.single = true;
            }else{
                friendship.messages.push(message);
            }
            friendship.save();
            io.in(data.chatID).emit(`receive-message`, data);
            } catch (error) {
                console.log("###ERROR", error);
            }
        })
    });
} 