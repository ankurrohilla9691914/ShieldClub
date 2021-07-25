{
    let toggle = function(aTag){
        $.ajax({
            type: 'get',
            url: $(aTag).prop('href'),
            success: function(data){
                let button = $(aTag).children('button');
                button.removeClass('btn-primary');
                button.removeClass('btn-danger');
                button.removeClass('btn-success');
                button.removeClass('btn-info');
                button.html('');
                let status = data.data.status;
                if(status == "Request"){
                    button.addClass('btn-primary');
                    $($($(aTag)[0].parentElement).children('div')).html("");
                    button.html('Add Friend');
                }else if(status == "RequestU"){
                    button.remove();
                    $('#warning-unfriend').remove();
                    $('.start-chat').remove();
                    $("#relation-div").html(`
                        <a id="modify-relation" href="/user/modify-friendship/${data.data.id}">
                            <button class="btn btn-primary">Add Friend</button>
                        </a>
                    `)
                    $("#relation-div").append(`<span id='disabled-button' class="d-inline-block" tabindex="0" data-placement="right" data-toggle="tooltip" title="Add friend to start a chat">
                    <button class="btn btn-primary" style="pointer-events: none;" type="button" disabled><i class="fas fa-comment-alt"></i></button>
                    </span>`);
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    });
                    $('#modify-relation').click(function(event){
                        console.log("Click");
                        event.preventDefault();
                        toggle(this);
                    });
                    $("#posts").remove();
                }else if(status == 'Cancel'){
                    button.html('');
                    button.addClass('btn-info');
                    $($($(aTag)[0].parentElement).children('div')).html("<br><h5>Request Sent</h5>");
                    button.html('Cancel Request');
                }else{
                    button.addClass('btn-danger');
                    $('#relation-div').html(`
                    <div id="warning-unfriend" style="display: inline-block;">
                        <div data-toggle="modal" data-target="#exampleModal">
                            <button class="btn btn-danger">Unfriend</button>                    
                        </div>
                        <!-- Modal -->
                        <div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" style="top: 40%">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="">Unfriend</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body" style="text-align: left;">
                                        Remove this user from your friend list
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                        <a id="modify-relation" href="/user/modify-friendship/${data.data.profUser_id}">
                                            <button type="button" class="btn btn-danger" data-dismiss="modal">
                                                Unfriend
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
                    $('#modify-relation').click(function(event){
                        console.log("Click");
                        event.preventDefault();
                        toggle(this);
                    })
                    $('#decline').remove();
                    $('#disabled-button').remove();
                }
            },
            error: function(err){
                console.log(err.responseText);
            }
        })
    }
    $('#modify-relation').click(function(event){
        console.log("Click");
        event.preventDefault();
        toggle(this);
    })

    let declineRequest = function(aTag){
        $.ajax({
            type: 'get',
            url: $(aTag).prop('href'),
            success: function(data){
                $('#decline').remove();
                let button = $('#modify-relation button');
                button.removeClass('btn-success');
                button.addClass('btn-primary');
                button.html("Add Friend");
            },
            error: function(err){
                console.log(err.responseText);
            }
        })
    }

    $('#decline').click(function(event){
        event.preventDefault();
        declineRequest(this);
    })

    // For post section from ajax/home.js
    let createComment = function(newComm){
        $.ajax({
            type : 'post',
            url: $(newComm).prop('action'),
            data: $(newComm).serialize(),
            success: function(data){
                let newComment = data.data.comment;
                let newCommentHTML = addComment(newComment);
                if(!newComment.user.avatar){
                    $(newCommentHTML).find('img').attr('src', '/uploads/users/default/avatar');
                }
                $(`#post-${newComm.postid.value} .all-comments`).append(newCommentHTML);
                let commentDiv = $(`#post-${newComm.postid.value}`).children('.response-box').children('div').children('.toggle-comment');
                let commentCount = commentDiv.attr('data-comments');
                commentCount++;
                commentDiv.attr('data-comments', `${commentCount}`);
                commentDiv.html(`(${commentCount})`);
                let addedComment = $(`#comment-${newComment._id}`);
                addedComment.find('.delete > a').click(function(event){
                    event.preventDefault();
                    deleteComment(this);
                });
                addedComment.find('.toggle-like').click(function(event){
                    event.preventDefault();
                    toggleLike($(this));
                });
                addedComment.find('.like-com').click(function(){
                    if($(this).children('div').html() == 'Like'){
                        $(this).children('div').html('Unlike');
                    }
                    else{
                        $(this).children('div').html('Like')
                    }
                });
            }, error: function(err){
                console.log(err.responseText);
            }
        })
    }
    let addComment = function(comment){
        return $(`<div id='comment-${comment._id}' class="comment">
        <div class=" pl-3 pb-2 d-flex">
            <div class="m-2">
                    <img src="${comment.user.avatar}" alt="Profile" width="30" height="30" style="border-radius: 100%;">
            </div>
            <div class="d-flex" style="width: 100%; justify-content: space-between;">
                <div class="post-user-name pt-1 pl-2" style="width: 84%;">
                    <div class="" style="font-weight: 500;">
                        ${comment.user.name}
                        <span class="" style="font-size: 13px; color: grey;">Just Now</span>
                    </div>
                    <div style="display: inline-flex; width: 100%; justify-content: space-between;">
                        <div style="display: flex;">
                            ${comment.comment}
                            <a href="/like/toggle/?id=${comment._id}&type=Comment" style="font-size: 15px;" class="toggle-like pl-3 like-com">
                                <div>Like</div>
                            </a>
                        </div>
                        <div class="pr-3 like-count">
                            <div data-likes="${comment.likes.length}">
                                ${comment.likes.length} Likes
                            </div>
                        </div>
                    </div>
                </div>
                <div class="delete">
                    <a href="/comment/delete/${comment._id}" style="font-size: 15px;">Delete</a>
                </div>
            </div>
        </div>`)
    }
    $('.post-comments').children('form').submit(function(e){
        e.preventDefault();
        createComment(this);
        $($(this).children('input')[0]).prop('value', '');
    });
    
    let deleteComment = function(aTag){
        $.ajax({
            type : 'get',
            url: $(aTag).prop('href'),
            success: function(data){
                let commentDiv = $($(`#comment-${data.data.comment_id}`)[0].parentElement.parentElement).children('.response-box').children('div').children('.toggle-comment');
                let commentCount = commentDiv.attr('data-comments');
                commentCount--;
                commentDiv.attr('data-comments', `${commentCount}`);
                commentDiv.html(`(${commentCount})`);
                $(`#comment-${data.data.comment_id}`).remove();
            }, error: function(err){
                console.log(err.responseText);
            }
        });
    }

    $('.delete').children('a').click(function(event){
        event.preventDefault();
        deleteComment(this);
    });

    let toggleLike = function(aTag){
        $.ajax({
            type: 'get',
            url: aTag.prop('href'),
            success: function(data){
                let likeDiv = $(aTag[0].parentElement.parentElement).children('.like-count').children('div');
                let likeCount = likeDiv.attr('data-likes');
                if(data.data.deleted){
                    likeCount--;
                }
                else{
                    likeCount++;
                }
                likeDiv.attr('data-likes', `${likeCount}`);
                likeDiv.html(`${likeCount} Likes`);
            }
        });
    }

    $('.toggle-like').click(function(event){
        event.preventDefault();
        toggleLike($(this));
    })
    let deletePost = function(deleteLink){
        $.ajax({
            type : 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            }, error: function(err){
                console.log(err.responseText);
            }
        })
    };
    $('.ajax-delete').click(function(event){
    event.preventDefault();
    deletePost(this);
    });
}
