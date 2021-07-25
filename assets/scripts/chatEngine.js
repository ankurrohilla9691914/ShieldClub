class ChatEngine{
    constructor(chatBox, chatID, userID){
        this.chatBox = $(`#${chatBox}`);
        this.userID = userID;
        this.chatID = chatID;

        this.socket = io.connect("http://localhost:5000");

        if(this.userID){
            this.connectionHandler();
        }
    }
    connectionHandler(){
        let self = this;

        this.socket.on('connect', function () {
            console.log("Connection established...");
            self.socket.emit(`join-room`, {
                userID: self.userID,
                chatID: self.chatID
            });

            self.socket.on('user-joined', function(data){
                if(!data.single)
                {$('#online-status').css('background-color', 'rgb(0, 250, 33)');
                $('#seen').remove();
                let lastMsg = $('#messages > li');
                lastMsg = lastMsg[lastMsg.length - 1];
                if($(lastMsg).css('text-align') == 'right'){
                    $('#messages').append('<div id="seen">seen</div>');
                }}
            })
        });
        $('#send-message > form').submit(function(event){
            event.preventDefault();
            let msg = $('#send-message > form > input').val();
            if(msg != '')
                self.socket.emit('send-message', {
                    message: msg,
                    userID: self.userID,
                    chatID: self.chatID
                });
                $('#send-message > form > input').val('');
        })
        self.socket.on('receive-message', function(data){
            $('#seen').remove();
            if(data.userID != self.userID){
                $('#messages').append(`<li style="text-align: left;"><div style="background-color: orange; word-wrap: break-word; display: inline-block;">${data.message}</div></li>`);
            }
            else{
                $('#messages').append(`<li style="text-align: right;"><div style="background-color: skyblue; word-wrap: break-word; display: inline-block;">${data.message}</div></li>`);
                if(!data.single)
                    $('#messages').append('<div id="seen">seen</div>');
            }
            $($("#messages")[0].parentElement).scrollTop($("#messages").height());
        })
        self.socket.on('went-offline', function(){
            $('#online-status').css('background-color', 'grey');
        })
    }
}