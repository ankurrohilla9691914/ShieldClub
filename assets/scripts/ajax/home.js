{
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
                    <a href="comment/delete/${comment._id}" style="font-size: 15px;">Delete</a>
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

}