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
        console.log($(commentForm[i]).children('form').children('input')[0].focus());
    })
}

$('.like').click(function(){
    $(this).children('i').toggleClass('far');
    $(this).children('i').toggleClass('fas');
    $(this).children('i').toggleClass('red-like');
    $(this).children('i').toggleClass('animate__animated animate__bounceIn');
})

$('.pop-comment').click(function(){
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

var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
            fileName = e.target.value.split( `\\` ).pop();
            
        console.log(fileName, label,labelVal);

        if( fileName )
        {
            label.innerHTML = fileName;
            $(label).removeClass('btn-dark');
            $(label).addClass('btn-success');
        }
		else
			label.innerHTML = labelVal;
	});
});

$(document).ready($($("#messages")[0].parentElement).scrollTop($("#messages").height()));
