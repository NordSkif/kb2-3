(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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
},{"./content/content.json":2}],2:[function(require,module,exports){
module.exports={
	"pages":{
			"intro":{
				"block1":"Гвианский космический центр",
				"block2":"Коснитесь экрана",
			},
			"page2":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			},
			"page3":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			},
			"popup1":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			}
		},
		"sidebars":{
			"sidebar1":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			},
			"sidebar2":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			}
		},
		"popups":{
			"popup1":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			},
			"popup2":{
				"block1":"some text",
				"block2":"some text",
				"block3":"some text",
				"block4":"some text",
				"block5":"some text",
				"block6":"some text",
				"block7":"some text",
				"block8":"some text",
				"block9":"some text",
			}
		},
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvYXBwLXByb2plY3QuanMiLCJwdWJsaWMvY29udGVudC9jb250ZW50Lmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiY29uc3QgY29udGVudCA9IHJlcXVpcmUoJy4vY29udGVudC9jb250ZW50Lmpzb24nKVxyXG5cclxudmFyIGFwcCA9IG5ldyBWdWUoe1xyXG4gICAgZWw6ICcjYXBwJyxcclxuICAgIGRhdGE6IHtcclxuXHJcbiAgICAgICAgaXNBY3RpdmVJbWc6IGZhbHNlLFxyXG5cclxuICAgICAgICBwYWdlczogY29udGVudC5wYWdlcyxcclxuICAgICAgICBzaWRlYmFyczogY29udGVudC5zaWRlYmFycyxcclxuICAgICAgICBwb3B1cHM6IGNvbnRlbnQucG9wdXBzLFxyXG5cclxuICAgICAgICBtb2RhbHM6IHtcclxuICAgICAgICAgICAgcG9wdXAxOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvcHVwMjoge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3B1cDM6IHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9wdXA0OiB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvcHVwNToge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3B1cDY6IHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9wdXBWaWRlbzE6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAndmlkZW8xJyxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwbGF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3B1cFZpZGVvMjoge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICd2aWRlbzInLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBsYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpZGViYXIxOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpZGViYXIyOiB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbGxlcnk6IHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICB3YWl0VXNlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlkbGVUaW1lciA9IG51bGw7XHJcbiAgICAgICAgICAgIGlkbGVTdGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZGxlV2FpdCA9IDMwMDAwMDtcclxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5iaW5kKCdtb3VzZW1vdmUgY2xpY2sga2V5ZG93biBzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChpZGxlVGltZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkbGVTdGF0ZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmludHJvJykuYWRkQ2xhc3MoJ2ludHJvX21vdmUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlkbGVTdGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWRsZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuaW50cm8nKS5yZW1vdmVDbGFzcygnaW50cm9fbW92ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIG15U3dpcGVyLnNsaWRlVG8oMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgbmFtZSBpbiBtZS5tb2RhbHMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihtZS5tb2RhbHNbbmFtZV0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5tb2RhbHNbbmFtZV0uYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQoXCIucG9wdXBfX2Jsb2NrXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkbGVTdGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9LCBpZGxlV2FpdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3dpcGVJbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gU3dpcGVyIGluaXQgKGh0dHA6Ly9pZGFuZ2Vyby51cy9zd2lwZXIvKVxyXG4gICAgICAgICAgICAkKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbXlTd2lwZXIgPSBuZXcgU3dpcGVyKCcuc3dpcGVyLWNvbnRhaW5lci1tYWluJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGVUb3VjaDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbGxheDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBsb25nU3dpcGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdTd2lwZXNSYXRpbzogMC4xLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC+0YLQutC7LiDQvdCwINC/0YDQvtC00LDQutGI0L0g0LrQu9Cw0LLQuNCw0YLRg9GA0YMgOiDQvdCw0YfQsNC70L5cclxuICAgICAgICAgICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAvLyDQvtGC0LrQuy4g0L3QsCDQv9GA0L7QtNCw0LrRiNC9INC60LvQsNCy0LjQsNGC0YPRgNGDIDog0LrQvtC90LXRhlxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsOiAnLnN3aXBlci1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2J1bGxldHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckJ1bGxldDogZnVuY3Rpb24oaW5kZXgsIGNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCI+JyArIChpbmRleCArIDEpICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2FsbGVyeVN3aXBlSW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIFN3aXBlciBpbml0IChodHRwOi8vaWRhbmdlcm8udXMvc3dpcGVyLylcclxuICAgICAgICAgICAgJChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG15R2FsbGVyeSA9IG5ldyBTd2lwZXIoJy5zd2lwZXItY29udGFpbmVyLWdhbGxlcnknLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgICAgICBzaW11bGF0ZVRvdWNoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFsbGF4OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdTd2lwZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ1N3aXBlc1JhdGlvOiAwLjEsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0L7RgtC60LsuINC90LAg0L/RgNC+0LTQsNC60YjQvSDQutC70LDQstC40LDRgtGD0YDRgyA6INC90LDRh9Cw0LvQvlxyXG4gICAgICAgICAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC+0YLQutC7LiDQvdCwINC/0YDQvtC00LDQutGI0L0g0LrQu9Cw0LLQuNCw0YLRg9GA0YMgOiDQutC+0L3QtdGGXHJcbiAgICAgICAgICAgICAgICAgICAgb246IHt9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzd2lwZUludHJvSW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGVwaGVuLmJhbmQvanF1ZXJ5LmV2ZW50Lm1vdmUvXHJcbiAgICAgICAgICAgICQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuaW50cm8nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbignbW92ZSBjbGljayB0b3VjaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaW50cm9fbW92ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICAgIGdvVG9TbGlkZTogZnVuY3Rpb24oZXZlbnQsIG4sIHYpIHtcclxuICAgICAgICAgICAgbXlTd2lwZXIuc2xpZGVUbyhuLCB2KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNob3dNb2RhbDogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbHNbbmFtZV0uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlTW9kYWw6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxzW25hbWVdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGxheVZpZGVvRmlsZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZCA9IG1lLm1vZGFsc1tuYW1lXS5pZDtcclxuICAgICAgICAgICAgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgICAgICBtZS5tb2RhbHNbbmFtZV0ucGxheSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2aWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgIHZpZGVvLm9uZW5kZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG1lLm1vZGFsc1tuYW1lXS5wbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkKCcucG9wdXAtdmlkZW9fX3Byb2dyZXNzLWlubmVyJykuYW5pbWF0ZSh7ICd3aWR0aCc6IDAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICQodmlkZW8pLm9uKFxyXG4gICAgICAgICAgICAgICAgJ3RpbWV1cGRhdGUnLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IDExMzQgLyB0aGlzLmR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggKiB0aGlzLmN1cnJlbnRUaW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wb3B1cC12aWRlb19fcHJvZ3Jlc3MtaW5uZXInKS5hbmltYXRlKHsgJ3dpZHRoJzogd2lkdGggKyAncHgnIH0sIDUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYXVzZVZpZGVvRmlsZTogZnVuY3Rpb24obmFtZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RhbHNbbmFtZV0ucGxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpO1xyXG5cclxuICAgICAgICAgICAgJCgnLnBvcHVwLXZpZGVvX19wcm9ncmVzcy1pbm5lcicpLnN0b3AoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbG9hZFZpZGVvRmlsZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxzW25hbWVdLnBsYXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmlkZW8ubG9hZCgpO1xyXG4gICAgICAgICAgICAkKCcucG9wdXAtdmlkZW9fX3Byb2dyZXNzLWlubmVyJykuYW5pbWF0ZSh7J3dpZHRoJzogMH0sIDEwMDApO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGFuZGxlckNsb3NlVmlkZW9Qb3B1cDogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZU1vZGFsKG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlVmlkZW9GaWxlKG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbG9hZFZpZGVvRmlsZShuYW1lKTtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG90b09wZW46IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlSW1nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWd3aWR0aCA9IGV2ZW50LnRhcmdldC5jbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgdmFyIGltZ0hlaWdodCA9IGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVzYyA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcuc3dpcGVyLXNsaWRlJykuZmluZCgnLnRleHRfX2Rlc2MnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICdhdXRvJyxcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9ICcxMDAlJztcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWcgPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgIHZhciBzcmMgPSBpbWcuYXR0cignc3JjJyk7XHJcblxyXG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnI2FwcCcpLmZpbmQoJy5wb3B1cC1waG90bycpLmFwcGVuZChcclxuICAgICAgICAgICAgICAgICc8aW1nIHNyYz1cIicgKyBzcmMgKyAnXCIgY2xhc3M9XCJwb3B1cF9pbWdcIiB3aWR0aD1cIicgKyB3aWR0aCArICdcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ1wiIC8+JyArICc8L2Rpdj4nKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBob3RvQ2xvc2U6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmVJbWcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcjYXBwJykuZmluZCgnLnBvcHVwX2ltZycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnI2FwcCcpLmZpbmQoJy5wb3B1cC1waG90by1kZXNjcmlwdGlvbicpLmVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLyAgICAgICAgIEZ1bmN0aW9ucyAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vL2NvbnNvbGUubG9nKGFwcC5jb250ZW50KVxyXG5cclxuZnVuY3Rpb24gcGFnYW5Jc0Nsb3NlKG9iaikge1xyXG4gICAgbGV0IG1vZGFscyA9IGFwcC5tb2RhbHMsXHJcbiAgICAgICAgbyA9IG9iajtcclxuICAgICQoby5lbGVtZW50KS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIG1vZGFscykge1xyXG4gICAgICAgICAgICBpZiAobW9kYWxzW2VsZW1dWydhY3RpdmUnXSkge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZFbGVtID0gZWxlbVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWN0aXZFbGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3aXBlQ2xvc2VTaWRlYmFyKG9iamVjdCkge1xyXG4gICAgbGV0IG8gPSBvYmplY3QsXHJcbiAgICAgICAgc3RhcnRYID0gMCxcclxuICAgICAgICBtb2RhbHMgPSBhcHAubW9kYWxzLFxyXG4gICAgICAgIGRpc3QsXHJcbiAgICAgICAgYWN0aXZFbGVtLFxyXG4gICAgICAgIGN1clBvcztcclxuXHJcbiAgICAkKG8uZWxlbWVudCkub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgbGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTsgLy8g0L/QtdGA0LLQsNGPINGC0L7Rh9C60LAg0L/RgNC40LrQvtGB0L3QvtCy0LXQvdC40Y9cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0b3VjaG9iailcclxuICAgICAgICBkaXN0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIG1vZGFscykge1xyXG4gICAgICAgICAgICBpZiAobW9kYWxzW2VsZW1dWydhY3RpdmUnXSkge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZFbGVtID0gZWxlbVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYWN0aXZFbGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhcnRYID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WClcclxuICAgIH0pO1xyXG5cclxuICAgICQoby5lbGVtZW50KS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07IC8vINC/0LXRgNCy0LDRjyDRgtC+0YfQutCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNGPINC00LvRjyDQtNCw0L3QvdC+0LPQviDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIGRpc3QgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKSAtIHN0YXJ0WDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3QpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChvLmVsZW1lbnQpLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZGlzdCA+IG8uZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgbW9kYWxzW2FjdGl2RWxlbV1bJ2FjdGl2ZSddID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2Nsb3NlZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vY29uc29sZS5sb2coYXBwLm1vZGFscylcclxuXHJcbmZ1bmN0aW9uIHN3aXBlQ2xvc2VQb3B1cChvYmplY3QpIHtcclxuICAgIGxldCBvID0gb2JqZWN0LFxyXG4gICAgICAgIHN0YXJ0WSA9IDAsXHJcbiAgICAgICAgbW9kYWxzID0gYXBwLm1vZGFscyxcclxuICAgICAgICBkaXN0LCBhY3RpdkVsZW0sIGN1clBvcztcclxuXHJcbiAgICAkKG8uZWxlbWVudCkub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgbGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTsgLy8g0L/QtdGA0LLQsNGPINGC0L7Rh9C60LAg0L/RgNC40LrQvtGB0L3QvtCy0LXQvdC40Y9cclxuICAgICAgICBkaXN0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIG1vZGFscykge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtKVxyXG4gICAgICAgICAgICBpZiAobW9kYWxzW2VsZW1dWydhY3RpdmUnXSkge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZFbGVtID0gZWxlbVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYWN0aXZFbGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhcnRZID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSlcclxuICAgIH0pO1xyXG5cclxuICAgICQoby5lbGVtZW50KS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07IC8vINC/0LXRgNCy0LDRjyDRgtC+0YfQutCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNGPINC00LvRjyDQtNCw0L3QvdC+0LPQviDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIGRpc3QgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKSAtIHN0YXJ0WTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3QpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChvLmVsZW1lbnQpLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZGlzdCA+IG8uZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgbW9kYWxzW2FjdGl2RWxlbV1bJ2FjdGl2ZSddID0gZmFsc2U7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2Nsb3NlZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIFBlcmZlY3Qgc2Nyb2xsYmFyIChodHRwczovL2dpdGh1Yi5jb20vdXRhdHRpL3BlcmZlY3Qtc2Nyb2xsYmFyKVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgICQoJy5zaWRlYmFyX19ibG9jay13aXRoLXNjcm9sbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHBzID0gbmV3IFBlcmZlY3RTY3JvbGxiYXIodGhpcyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgcGFnYW5Jc0Nsb3NlKHtcclxuICAgICAgICBlbGVtZW50OiAnLnN3aXBlci1wYWdpbmF0aW9uLWJ1bGxldCcsXHJcbiAgICAgICAgdGFyZ2V0RWxlbTogJ2lzQWN0aXZlJ1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHN3aXBlQ2xvc2VTaWRlYmFyKHtcclxuICAgICAgICBlbGVtZW50OiAnLnNpZGViYXItd3JhcHBlcicsXHJcbiAgICAgICAgZGlzdGFuY2U6IDMwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLyDQtdGB0LvQuCDRgyDQvdCw0YEgaXNBY3RpdmVTaWRlYmFyQnVyYW4xLCDRgtC+INC/0LjRiNC10LwgaXNBY3RpdmVTaWRlYmFyXHJcbiAgICB9KTtcclxuXHJcbiAgICBzd2lwZUNsb3NlUG9wdXAoe1xyXG4gICAgICAgIGVsZW1lbnQ6ICcucG9wdXAnLFxyXG4gICAgICAgIGRpc3RhbmNlOiAzMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vINC10YHQu9C4INGDINC90LDRgSBpc0FjdGl2ZVBvcHVwQnVyYW4xLCDRgtC+INC/0LjRiNC10LwgaXNBY3RpdmVQb3B1cFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGxvbmdTbGlkZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgIGxldCBvZmZzZXQgPSAwO1xyXG4gICAgICAkKGNvbnRhaW5lcikub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBvZmZzZXQgPSAkKHRoaXMpLnNjcm9sbExlZnQoKTtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzd2lwZXItbm8tc3dpcGluZycpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhvZmZzZXQsIDApO1xyXG4gICAgICB9KTtcclxuICAgICAgJChjb250YWluZXIpLm9uKCd0b3VjaGVuZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAob2Zmc2V0ID4gMTM0MCkge1xyXG4gICAgICAgICAgbXlTd2lwZXIuc2xpZGVOZXh0KDEwMDApO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ29rJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9mZnNldCA8IDUpIHtcclxuICAgICAgICAgIG15U3dpcGVyLnNsaWRlUHJldigxMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIGxvbmdTbGlkZXIoJy5sb25nU2xpZGVyX19jb250YWluZXInKTtcclxuXHJcbiAgICBteVN3aXBlci5vbignc2xpZGVDaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2hhbmdlY29sb3JoZWFkZXIoKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IGNoYW5nZUhlYWRlckNvbG9yID0ge1xyXG4gICAgICAgIG1ha2VMaWdodDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJCgnLmhlYWRlcl9fY29udGFpbmVyJykuYWRkQ2xhc3MoJ2hlYWRlcl9fY29udGFpbmVyLWxpZ2h0JykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY29udGFpbmVyLWRhcmsnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ha2VEYXJrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCcuaGVhZGVyX19jb250YWluZXInKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb250YWluZXItbGlnaHQnKS5hZGRDbGFzcygnaGVhZGVyX19jb250YWluZXItZGFyaycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBjaGFuZ2Vjb2xvcmhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgY3VycmVudFNsaWRlTnVtYmVyID0gbXlTd2lwZXIuYWN0aXZlSW5kZXg7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudFNsaWRlTnVtYmVyKTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRTbGlkZSA9IG15U3dpcGVyLnNsaWRlc1tjdXJyZW50U2xpZGVOdW1iZXJdO1xyXG5cclxuICAgICAgICBpZiAoICQoY3VycmVudFNsaWRlKS5maW5kKCcud3JhcHBlcicpLmhhc0NsYXNzKCdzbGlkZS1saWdodCcpICkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcItGC0LXQutGD0YnQuNC5INGB0LvQsNC50LQg0YHQstC10YLQu9GL0LkhXCIpO1xyXG4gICAgICAgICAgICBjaGFuZ2VIZWFkZXJDb2xvci5tYWtlTGlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfQotC10LrRg9GJ0LjQuSDRgdC70LDQudC0INGC0ZHQvNC90YvQuScpO1xyXG4gICAgICAgICAgICBjaGFuZ2VIZWFkZXJDb2xvci5tYWtlRGFyaygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBjdXJyZW50U2xpZGVOdW1iZXIgPT09IDEgfHwgY3VycmVudFNsaWRlTnVtYmVyID09PSAwKSB7XHJcbiAgICAgICAgICAgICQoJyNmaXJzdEJhY2tncm91bmQnKS5jc3MoXCJvcGFjaXR5XCIsICcxJyk7XHJcbiAgICAgICAgICAgICQoJyNsYXN0QmFja2dyb3VuZCcpLmNzcyhcIm9wYWNpdHlcIiwgJzAnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICQoJyNmaXJzdEJhY2tncm91bmQnKS5jc3MoXCJvcGFjaXR5XCIsICcwJyk7XHJcbiAgICAgICAgICAgICQoJyNsYXN0QmFja2dyb3VuZCcpLmNzcyhcIm9wYWNpdHlcIiwgJzEnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGFuZ2Vjb2xvcmhlYWRlcigpO1xyXG59KTsiLCJtb2R1bGUuZXhwb3J0cz17XHJcblx0XCJwYWdlc1wiOntcclxuXHRcdFx0XCJpbnRyb1wiOntcclxuXHRcdFx0XHRcImJsb2NrMVwiOlwi0JPQstC40LDQvdGB0LrQuNC5INC60L7RgdC80LjRh9C10YHQutC40Lkg0YbQtdC90YLRgFwiLFxyXG5cdFx0XHRcdFwiYmxvY2syXCI6XCLQmtC+0YHQvdC40YLQtdGB0Ywg0Y3QutGA0LDQvdCwXCIsXHJcblx0XHRcdH0sXHJcblx0XHRcdFwicGFnZTJcIjp7XHJcblx0XHRcdFx0XCJibG9jazFcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2syXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrM1wiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazRcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s1XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNlwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazdcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s4XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrOVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdH0sXHJcblx0XHRcdFwicGFnZTNcIjp7XHJcblx0XHRcdFx0XCJibG9jazFcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2syXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrM1wiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazRcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s1XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNlwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazdcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s4XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrOVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdH0sXHJcblx0XHRcdFwicG9wdXAxXCI6e1xyXG5cdFx0XHRcdFwiYmxvY2sxXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrMlwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazNcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s0XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazZcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s3XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrOFwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazlcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XCJzaWRlYmFyc1wiOntcclxuXHRcdFx0XCJzaWRlYmFyMVwiOntcclxuXHRcdFx0XHRcImJsb2NrMVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazJcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2szXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNFwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazVcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s2XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrN1wiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazhcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s5XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJzaWRlYmFyMlwiOntcclxuXHRcdFx0XHRcImJsb2NrMVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazJcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2szXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNFwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazVcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s2XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrN1wiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazhcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s5XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFwicG9wdXBzXCI6e1xyXG5cdFx0XHRcInBvcHVwMVwiOntcclxuXHRcdFx0XHRcImJsb2NrMVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazJcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2szXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNFwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazVcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s2XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrN1wiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazhcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s5XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0fSxcclxuXHRcdFx0XCJwb3B1cDJcIjp7XHJcblx0XHRcdFx0XCJibG9jazFcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2syXCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrM1wiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazRcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s1XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrNlwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdFx0XCJibG9jazdcIjpcInNvbWUgdGV4dFwiLFxyXG5cdFx0XHRcdFwiYmxvY2s4XCI6XCJzb21lIHRleHRcIixcclxuXHRcdFx0XHRcImJsb2NrOVwiOlwic29tZSB0ZXh0XCIsXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcbn0iXX0=
