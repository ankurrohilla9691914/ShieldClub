$($('.menu-option')[4]).css('background-color', "#0303d6");

$($("#side-menu #stick").children('a')[4]).click(function(event){
    event.preventDefault();
});

$('#update').submit(function(event){
    event.preventDefault();
    let self = $(this);
    $.ajax({
        type: 'post',
        url: $(this).prop('action'),
        data: $(this).serialize(),
        success: function(data){
            if(data.data.status == 1)
            self.children('div').html(`<div class="alert alert-success" role="alert">
                Password changed successfully!
                </div>`)
            else if(data.data.status == 0)
            self.children('div').html(`<div class="alert alert-danger" role="alert">
                    Entered a wrong password!
                </div>`)
            else if(data.data.status == 2)
                self.children('div').html(`<div class="alert alert-warning" role="alert">
                    Confirm password don't match!
                </div>`)
        }
    })
    self.children('input').val('');
})