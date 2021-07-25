$($('.menu-option')[0]).css('background-color', "#0303d6");

$($("#side-menu #stick").children('a')[0]).click(function(event){
    event.preventDefault();
});

$('.press').click(function(){
    $(this).addClass('animate__animated animate__zoomIn');
    setTimeout(function(){
        $('button').removeClass('animate__animated animate__zoomIn');
    }, 1000);
});

var posts = $('.pop-comment');
var commentForm = $('.post-comments');

for(let i = 0; i < posts.length; i++){
    $(posts[i]).click(function(){
        $(commentForm[i]).css('display', 'block');
        $(commentForm[i]).children('form').children('input')[0].focus();
    })
}

$('.like').click(function(){
    $(this).children('i').toggleClass('far');
    $(this).children('i').toggleClass('fas');
    $(this).children('i').toggleClass('red-like');
    $(this).children('i').toggleClass('animate__animated animate__bounceIn');
})

$('.like-com').click(function(){
    if($(this).children('div').html() == 'Like'){
        $(this).children('div').html('Unlike');
    }
    else{
        $(this).children('div').html('Like')
    }
})

$('.pop-comment').click(function(){
    $(this).children('i').toggleClass('animate__animated animate__bounceIn');
})