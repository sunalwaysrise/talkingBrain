/**
 * 
 * @authors xiashili
 * @date    2017-05-22
 * @version $Id$
 */


$(function(){
    if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))){
        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 100,
            mobile: true,
            live: true
        });
    };
    wow.init();
    $(function(){
        $(".costTabTit span").click(function(){ 
            $(this).addClass("current").siblings().removeClass("current");
            $('.costTabCont>div:eq('+$(this).index()+')').show().siblings().hide();
        });
    })
})
