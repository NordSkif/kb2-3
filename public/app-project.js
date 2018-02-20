const content = require('./content/content.json')

var app = new Vue({
    el: '#app',
    data: {

        isActiveImg: false,

        pages: content.pages,
        sidebars: content.sidebars,
        popups: content.popups,

        modals: {
            popup1: {
                active: false
            },
            popup2: {
                active: false
            },
            popup3: {
                active: false
            },
            popup4: {
                active: false
            },
            popup5: {
                active: false
            },
            popup6: {
                active: false
            },
            popupVideo1: {
                id: 'video1',
                active: false,
                play: false
            },
            popupVideo2: {
                id: 'video2',
                active: false,
                play: false
            },
            sidebar1: {
                active: false
            },
            sidebar2: {
                active: false
            },
            gallery: {
                active: false
            }
        }
    },

    computed: {
        waitUser: function() {
            idleTimer = null;
            idleState = false;
            idleWait = 300000;
            var me = this;

            $('body').bind('mousemove click keydown scroll', function() {
                clearTimeout(idleTimer);
                if (idleState == true) {
                    $('.intro').addClass('intro_move');
                }
                idleState = false;
                idleTimer = setTimeout(function() {
                    $('.intro').removeClass('intro_move');
                    mySwiper.slideTo(0);

                    for(var name in me.modals){
                        if(me.modals[name].active) {
                            me.modals[name].active = false;
                        }
                    }

                    $(".popup__block").remove();
                    idleState = true;
                }, idleWait);
            });
        },
        swipeInit: function() {
            // Swiper init (http://idangero.us/swiper/)
            $(function() {
                mySwiper = new Swiper('.swiper-container-main', {
                    speed: 500,
                    direction: 'horizontal',
                    simulateTouch: true,
                    parallax: true,
                    longSwipes: true,
                    longSwipesRatio: 0.1,
                    // откл. на продакшн клавиатуру : начало
                    keyboard: true,
                    // откл. на продакшн клавиатуру : конец
                    on: {},
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets',
                        clickable: true,
                        renderBullet: function(index, className) {
                            return '<span class="' + className + '">' + (index + 1) + '</span>';
                        }
                    }
                });
            });
        },
        gallerySwipeInit: function() {
            // Swiper init (http://idangero.us/swiper/)
            $(function() {
                myGallery = new Swiper('.swiper-container-gallery', {
                    speed: 500,
                    direction: 'horizontal',
                    simulateTouch: true,
                    parallax: true,
                    longSwipes: true,
                    longSwipesRatio: 0.1,
                    // откл. на продакшн клавиатуру : начало
                    keyboard: true,
                    // откл. на продакшн клавиатуру : конец
                    on: {}
                });
            });
        },
        swipeIntroInit: function() {
            // http://stephen.band/jquery.event.move/
            $(function() {
                $('.intro')
                    .on('move click touch', function(e) {
                        $(this).addClass('intro_move')
                    });
            });
        }
    },

    methods: {
        goToSlide: function(event, n, v) {
            mySwiper.slideTo(n, v);
        },
        showModal: function (name) {
            this.modals[name].active = true;
        },
        closeModal: function (name) {
            this.modals[name].active = false;
        },
        playVideoFile: function (name) {

            let me = this;

            id = me.modals[name].id;
            video = document.getElementById(id);

            me.modals[name].play = true;

            video.play();
            video.onended = function() {
                me.modals[name].play = false;
                $('.popup-video__progress-inner').animate({ 'width': 0 }, 1000);
            };
            $(video).on(
                'timeupdate',
                function(event){
                    var width = 1134 / this.duration;
                    width = width * this.currentTime;
                    $('.popup-video__progress-inner').animate({ 'width': width + 'px' }, 5);
                });
        },
        pauseVideoFile: function(name) {

            this.modals[name].play = false;
            video.pause();

            $('.popup-video__progress-inner').stop();
        },
        reloadVideoFile: function (name) {

            this.modals[name].play = false;
            video.load();
            $('.popup-video__progress-inner').animate({'width': 0}, 1000);
        },
        handlerCloseVideoPopup: function (name) {
            this.closeModal(name);
            this.pauseVideoFile(name);
            this.reloadVideoFile(name);

        },
        photoOpen: function(event) {

            this.isActiveImg = true;

            var imgwidth = event.target.clientWidth;
            var imgHeight = event.target.clientHeight;

            var desc = $(event.target).closest('.swiper-slide').find('.text__desc');

            var width = 'auto',
                height = '100%';

            var img = $(event.target);
            var src = img.attr('src');

            $(event.target).closest('#app').find('.popup-photo').append(
                '<img src="' + src + '" class="popup_img" width="' + width + '" height="' + height + '" />' + '</div>');
        },
        photoClose: function(event) {
            this.isActiveImg = false;

            $(event.target).closest('#app').find('.popup_img').remove();
            $(event.target).closest('#app').find('.popup-photo-description').empty();
        }
    }
});


////////////////////         Functions          ///////////////////

//console.log(app.content)

function paganIsClose(obj) {
    let modals = app.modals,
        o = obj;
    $(o.element).on('click', function() {
        for (let elem in modals) {
            if (modals[elem]['active']) {
                activElem = elem
                console.log(activElem);
            }
        }
    })
}

function swipeCloseSidebar(object) {
    let o = object,
        startX = 0,
        modals = app.modals,
        dist,
        activElem,
        curPos;

    $(o.element).on('touchstart', function(e) {
        let touchobj = e.changedTouches[0]; // первая точка прикосновения
        // console.log(touchobj)
        dist = 0;
        for (let elem in modals) {
            if (modals[elem]['active']) {
                activElem = elem
                // console.log(activElem);
            }
        }

        startX = parseInt(touchobj.clientX)
    });

    $(o.element).on('touchmove', function(e) {
        let touchobj = e.changedTouches[0]; // первая точка прикосновения для данного события
        dist = parseInt(touchobj.clientX) - startX;
        //console.log(dist);
    });

    $(o.element).on('touchend', function(e) {
        if (dist > o.distance) {
            modals[activElem]['active'] = false;
            //console.log('closed')
        }
    });
}

//console.log(app.modals)

function swipeClosePopup(object) {
    let o = object,
        startY = 0,
        modals = app.modals,
        dist, activElem, curPos;

    $(o.element).on('touchstart', function(e) {
        let touchobj = e.changedTouches[0]; // первая точка прикосновения
        dist = 0;
        for (let elem in modals) {
            // console.log(elem)
            if (modals[elem]['active']) {
                activElem = elem
                // console.log(activElem);
            }
        }

        startY = parseInt(touchobj.clientY)
    });

    $(o.element).on('touchmove', function(e) {
        let touchobj = e.changedTouches[0]; // первая точка прикосновения для данного события
        dist = parseInt(touchobj.clientY) - startY;
        //console.log(dist);
    });

    $(o.element).on('touchend', function(e) {
        if (dist > o.distance) {
            modals[activElem]['active'] = false;
            //console.log('closed')
        }
    });
}

// Perfect scrollbar (https://github.com/utatti/perfect-scrollbar)

window.addEventListener('load', function() {
    $('.sidebar__block-with-scroll').each(function() {
        var ps = new PerfectScrollbar(this);
    });


    paganIsClose({
        element: '.swiper-pagination-bullet',
        targetElem: 'isActive'
    });


    swipeCloseSidebar({
        element: '.sidebar-wrapper',
        distance: 300
                                      /// если у нас isActiveSidebarBuran1, то пишем isActiveSidebar
    });

    swipeClosePopup({
        element: '.popup',
        distance: 300
                                    /// если у нас isActivePopupBuran1, то пишем isActivePopup
    });

    let longSlider = function (container) {
      let offset = 0;
      $(container).on('scroll', function () {
        offset = $(this).scrollLeft();
        $(this).addClass('swiper-no-swiping');

        console.log(offset, 0);
      });
      $(container).on('touchend', function () {
        if (offset > 1340) {
          mySwiper.slideNext(1000);
          console.log('ok');
        }
        else if (offset < 5) {
          mySwiper.slidePrev(1000);
        }
      });
    };
    longSlider('.longSlider__container');

    mySwiper.on('slideChange', function () {
        changecolorheader();
    });
    let changeHeaderColor = {
        makeLight: function () {
          $('.header__container').addClass('header__container-light').removeClass('header__container-dark');
        },
        makeDark: function () {
          $('.header__container').removeClass('header__container-light').addClass('header__container-dark');
        }
    }
    let changecolorheader = function () {
        let currentSlideNumber = mySwiper.activeIndex;
        console.log(currentSlideNumber);

        let currentSlide = mySwiper.slides[currentSlideNumber];

        if ( $(currentSlide).find('.wrapper').hasClass('slide-light') ) {
            // console.log("текущий слайд светлый!");
            changeHeaderColor.makeLight();
        }
        else {
            // console.log('Текущий слайд тёмный');
            changeHeaderColor.makeDark();
        }

        if ( currentSlideNumber === 1 || currentSlideNumber === 0) {
            $('#firstBackground').css("opacity", '1');
            $('#lastBackground').css("opacity", '0');
        }
        else {
            $('#firstBackground').css("opacity", '0');
            $('#lastBackground').css("opacity", '1');
        }
    }
    changecolorheader();
});