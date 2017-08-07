/**
 * 
 * @authors xiashili
 * @date    2017-05-22
 * @version $Id$
 */


$(function(){
    var swiper = new Swiper('.home-banner', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        autoplay: 3000,
        autoplayDisableOnInteraction : false
    });
})
$(function(){
    var swiper = new Swiper('.homeRatingMain', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        autoplay: 3000,
        autoplayDisableOnInteraction : false
    });
})
$(function(){
    var swiper = new Swiper('.homeTeamSwiper .swiper-container', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 6,
        spaceBetween: 50,
        // autoplay: 3000,
        autoplayDisableOnInteraction : false
    });
})
