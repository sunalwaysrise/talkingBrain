/**
 * 
 * @authors xiashili
 * @date    2017-05-22
 * @version $Id$
 */


$(function(){
      $(window).scroll(function(){
        var wh = $(window).height();
        var iTop = $(window).scrollTop(); 
        if(iTop>wh){
            $(".clickTotop").show()
        }else{
            $(".clickTotop").hide()
        }
    })
    $(".clickTotop").click(function(){
        $('body,html').animate({"scrollTop":0},500)
    })
})

