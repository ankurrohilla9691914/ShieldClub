$("input").focusin(function(){
    $(this).addClass('click-input');
});
$("input").focusout(function(){
    if($(this)[0].value == "")
    {
        $(this).removeClass('click-input');
        return;
    }
});

var flash = setInterval(function(){
    $("button").toggleClass('button-flash');
}, 200);

setTimeout(function(){
    clearInterval(flash);
}, 1300);


$(".var-link").attr('href', '/user/sign-up');
$('.var-link').html('Sign Up');