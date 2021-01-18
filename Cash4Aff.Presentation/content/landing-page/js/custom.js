$(document).ready(function() {
    "use strict";

    //PRE LOADING
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
    $('body').delay(350).css({
        'overflow': 'visible'
    });

    //GOOGLE MAP - SCROLL REMOVE
    $('.land-3-agen-right')
        .on('click', function() {
            $(this).find('iframe').addClass('clicked')
        })
        .on('mouseleave', function() {
            $(this).find('iframe').removeClass('clicked')
        });


    $(window).scroll(function() {
        if ($(document).scrollTop() > 200) {
            $('.header').addClass('header1');
        } else {
            $('.header').removeClass('header1');
        }
    });
    $(window).scroll(function() {
        if ($(document).scrollTop() > 400) {
            $('.header').addClass('header2');
        } else {
            $('.header').removeClass('header2');
        }
    });

    $(document).on('click', 'a[href^="#"]', function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });

});