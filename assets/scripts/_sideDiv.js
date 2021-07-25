var intr;
$(".menu-option").mouseenter(function(){
    var i = $(this).children('i');
    i.toggleClass('i-float');
    intr = setInterval(function(){
        i.toggleClass('i-float');
    }, 500);
});

$(".menu-option").mouseleave(function(){
    clearInterval(intr);
    $(this).children('i').removeClass('i-float');
});