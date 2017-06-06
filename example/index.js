import MGesture from '../src/index';

let w = $(window).width();

$('.item').css({
    width:w+'px',
    height:(w+48)+'px',
});

let mgestureSticker = new MGesture({
    receiver: '.js-par',
    operator: '.el-1',
    drag: true,
    pinch: true,
    rotate: true,
    singlePinch: {
        buttonId: 'js-pinch',
    },
    singleRotate: {
        buttonId: 'js-pinch',
    },
    limit: true,
});

$('.js-img').on('load',()=>{
    new MGesture({
        receiver: '.js-crop',
        operator: '.js-img',
        drag: true,
        limit:'crop',
    });
});

$('.js-el').on('click', function(e) {
    $('.js-el').removeClass('active');
    $(this).addClass('active');
    mgestureSticker.switchOperator(this);
    e.stopPropagation();
});

$('.js-par').on('click',function(){
    $('.js-el').removeClass('active');
    mgestureSticker.freeze(true);
});

$('.js-btn').on('click',function(){
    $('.js-wrap').toggleClass('switch');
});
$('.Button').on('touchstart',function(){
    $(this).addClass('taped');
});
$('.Button').on('touchend',function(){
    $(this).removeClass('taped');
});
