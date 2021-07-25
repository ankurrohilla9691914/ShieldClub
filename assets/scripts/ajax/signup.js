{
    $('#otp-form').submit(function(event){
        event.preventDefault();
        // $('#create-user').submit();
        $.ajax({
            type: "post",
            url: $(this).prop('action'),
            data: $(this).serialize(),
            success: function(data){
                console.log("OTP SENT");
                if(data.data.status == "new")
                {
                    $("#otp-form button").html("NEW OTP SENT");
                    setTimeout(function(){
                        $("#otp-form button").html("Send Again");
                    },2000);
                }
                if(data.data.status == 'old')
                {
                    $("#otp-form button").html("OTP SENT AGAIN");
                    setTimeout(function(){
                        $("#otp-form button").html("Send Again");
                    },2000);
                }
                $("#otp-form input").prop('readonly', true);
                $('#otp').css('display', 'block');
                $("#signUp-button").css('display', 'block');
                let mail = $('#otp-form input').val();
                $("#sent-email").val(mail);
            }
        })
    })
    $("#create-user").submit(function(event){
        event.preventDefault();
        $.ajax({
            type: "post",
            url: $(this).prop('action'),
            data: $(this).serialize(),
            success: function(data){
                if(data.data)
                {
                    let div = $('#create-user div');
                    div.css('display', 'block');
                    if(data.data.status == "unmatched"){
                        div.html("Confirm Password didn't match!");
                    }
                    else if(data.data.status == "expired")
                        div.html("OTP Expired!");
                    else if(data.data.status == "wrong")
                        div.html("Wrong OTP");
                    else if(data.data.status == "email-exist")
                        div.html('Email already exists!');
                    else
                        div.html('Internal Error!');
                    setTimeout(function(){
                        div.css('display', 'none');
                    },2000)
                }
                else{
                    window.location.href = '/user/sign-in';
                }
            }
        })
    })
}


$('#container a i').mouseenter(function(){
    $(this).html('oogle');
})

$('#container a i').mouseout(function(){
    $(this).html('');
})
