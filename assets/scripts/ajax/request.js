let declineRequest = function(aTag){
    $.ajax({
        type: 'get',
        url: $(aTag).prop('href'),
        success: function(data){
            let div = $(aTag)[0].parentElement;
            $(div).html('<button type="button" class="btn btn-outline-danger" disabled>Rejected</button>');
        },
        error: function(err){
            console.log(err.responseText);
        }
    })
}

$('.decline').click(function(event){
    event.preventDefault();
    declineRequest($(this));
})

let acceptRequest = function(aTag){
    $.ajax({
        type: 'get',
        url: $(aTag).prop('href'),
        success: function(data){
            let div = $(aTag)[0].parentElement;
            $(div).html('<button type="button" class="btn btn-outline-success animate__animated animate__zoomIn animate__faster" disabled>Accepted</button>');
        },
        error: function(err){
            console.log(err.responseText);
        }
    })
}

$('.accept').click(function(event){
    event.preventDefault();
    acceptRequest(this);
})