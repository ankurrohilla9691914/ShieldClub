$($('.menu-option')[1]).css('background-color', "#0303d6");

$($("#side-menu #stick").children('a')[1]).click(function(event){
    event.preventDefault();
});

var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
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