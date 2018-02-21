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
                    noSwipingClass: 'swiper-no-swiping',
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
        galleryInit: function () {
            // Swiper init (http://idangero.us/swiper/)
            $(function () {
              myGallery = new Swiper('.gallery__swiper-container', {
                speed: 700,
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
                  el: '.gallery__swiper-pagination',
                  clickable: true
                },
                // navigation: {
                //   nextEl: '.gallery__swiper-button-next',
                //   prevEl: '.gallery__swiper-button-prev'
                // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvYXBwLXByb2plY3QuanMiLCJwdWJsaWMvY29udGVudC9jb250ZW50Lmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiY29uc3QgY29udGVudCA9IHJlcXVpcmUoJy4vY29udGVudC9jb250ZW50Lmpzb24nKVxuXG52YXIgYXBwID0gbmV3IFZ1ZSh7XG4gICAgZWw6ICcjYXBwJyxcbiAgICBkYXRhOiB7XG5cbiAgICAgICAgaXNBY3RpdmVJbWc6IGZhbHNlLFxuXG4gICAgICAgIHBhZ2VzOiBjb250ZW50LnBhZ2VzLFxuICAgICAgICBzaWRlYmFyczogY29udGVudC5zaWRlYmFycyxcbiAgICAgICAgcG9wdXBzOiBjb250ZW50LnBvcHVwcyxcblxuICAgICAgICBtb2RhbHM6IHtcbiAgICAgICAgICAgIHBvcHVwMToge1xuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3B1cDI6IHtcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9wdXAzOiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvcHVwNDoge1xuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3B1cDU6IHtcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9wdXA2OiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBvcHVwVmlkZW8xOiB7XG4gICAgICAgICAgICAgICAgaWQ6ICd2aWRlbzEnLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGxheTogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3B1cFZpZGVvMjoge1xuICAgICAgICAgICAgICAgIGlkOiAndmlkZW8yJyxcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHBsYXk6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lkZWJhcjE6IHtcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lkZWJhcjI6IHtcbiAgICAgICAgICAgICAgICBhY3RpdmU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2FsbGVyeToge1xuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgICB3YWl0VXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZGxlVGltZXIgPSBudWxsO1xuICAgICAgICAgICAgaWRsZVN0YXRlID0gZmFsc2U7XG4gICAgICAgICAgICBpZGxlV2FpdCA9IDMwMDAwMDtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG5cbiAgICAgICAgICAgICQoJ2JvZHknKS5iaW5kKCdtb3VzZW1vdmUgY2xpY2sga2V5ZG93biBzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaWRsZVRpbWVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaWRsZVN0YXRlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmludHJvJykuYWRkQ2xhc3MoJ2ludHJvX21vdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWRsZVN0YXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWRsZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmludHJvJykucmVtb3ZlQ2xhc3MoJ2ludHJvX21vdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgbXlTd2lwZXIuc2xpZGVUbygwKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIG5hbWUgaW4gbWUubW9kYWxzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1lLm1vZGFsc1tuYW1lXS5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5tb2RhbHNbbmFtZV0uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKFwiLnBvcHVwX19ibG9ja1wiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWRsZVN0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LCBpZGxlV2FpdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc3dpcGVJbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFN3aXBlciBpbml0IChodHRwOi8vaWRhbmdlcm8udXMvc3dpcGVyLylcbiAgICAgICAgICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbXlTd2lwZXIgPSBuZXcgU3dpcGVyKCcuc3dpcGVyLWNvbnRhaW5lci1tYWluJywge1xuICAgICAgICAgICAgICAgICAgICBzcGVlZDogNTAwLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGVUb3VjaDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYWxsYXg6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGxvbmdTd2lwZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG5vU3dpcGluZ0NsYXNzOiAnc3dpcGVyLW5vLXN3aXBpbmcnLFxuICAgICAgICAgICAgICAgICAgICBsb25nU3dpcGVzUmF0aW86IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgLy8g0L7RgtC60LsuINC90LAg0L/RgNC+0LTQsNC60YjQvSDQutC70LDQstC40LDRgtGD0YDRgyA6INC90LDRh9Cw0LvQvlxuICAgICAgICAgICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgLy8g0L7RgtC60LsuINC90LAg0L/RgNC+0LTQsNC60YjQvSDQutC70LDQstC40LDRgtGD0YDRgyA6INC60L7QvdC10YZcbiAgICAgICAgICAgICAgICAgICAgb246IHt9LFxuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYnVsbGV0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJCdWxsZXQ6IGZ1bmN0aW9uKGluZGV4LCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNsYXNzTmFtZSArICdcIj4nICsgKGluZGV4ICsgMSkgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBnYWxsZXJ5SW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gU3dpcGVyIGluaXQgKGh0dHA6Ly9pZGFuZ2Vyby51cy9zd2lwZXIvKVxuICAgICAgICAgICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIG15R2FsbGVyeSA9IG5ldyBTd2lwZXIoJy5nYWxsZXJ5X19zd2lwZXItY29udGFpbmVyJywge1xuICAgICAgICAgICAgICAgIHNwZWVkOiA3MDAsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gICAgICAgICAgICAgICAgc2ltdWxhdGVUb3VjaDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXJhbGxheDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb25nU3dpcGVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxvbmdTd2lwZXNSYXRpbzogMC4xLFxuICAgICAgICAgICAgICAgIC8vINC+0YLQutC7LiDQvdCwINC/0YDQvtC00LDQutGI0L0g0LrQu9Cw0LLQuNCw0YLRg9GA0YMgOiDQvdCw0YfQsNC70L5cbiAgICAgICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAvLyDQvtGC0LrQuy4g0L3QsCDQv9GA0L7QtNCw0LrRiNC9INC60LvQsNCy0LjQsNGC0YPRgNGDIDog0LrQvtC90LXRhlxuICAgICAgICAgICAgICAgIG9uOiB7fSxcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICBlbDogJy5nYWxsZXJ5X19zd2lwZXItcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgICBjbGlja2FibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRpb246IHtcbiAgICAgICAgICAgICAgICAvLyAgIG5leHRFbDogJy5nYWxsZXJ5X19zd2lwZXItYnV0dG9uLW5leHQnLFxuICAgICAgICAgICAgICAgIC8vICAgcHJldkVsOiAnLmdhbGxlcnlfX3N3aXBlci1idXR0b24tcHJldidcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN3aXBlSW50cm9Jbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGVwaGVuLmJhbmQvanF1ZXJ5LmV2ZW50Lm1vdmUvXG4gICAgICAgICAgICAkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoJy5pbnRybycpXG4gICAgICAgICAgICAgICAgICAgIC5vbignbW92ZSBjbGljayB0b3VjaCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2ludHJvX21vdmUnKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgICAgZ29Ub1NsaWRlOiBmdW5jdGlvbihldmVudCwgbiwgdikge1xuICAgICAgICAgICAgbXlTd2lwZXIuc2xpZGVUbyhuLCB2KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2hvd01vZGFsOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RhbHNbbmFtZV0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xvc2VNb2RhbDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxzW25hbWVdLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBwbGF5VmlkZW9GaWxlOiBmdW5jdGlvbiAobmFtZSkge1xuXG4gICAgICAgICAgICBsZXQgbWUgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZCA9IG1lLm1vZGFsc1tuYW1lXS5pZDtcbiAgICAgICAgICAgIHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgICAgICAgICBtZS5tb2RhbHNbbmFtZV0ucGxheSA9IHRydWU7XG5cbiAgICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgIHZpZGVvLm9uZW5kZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtZS5tb2RhbHNbbmFtZV0ucGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICQoJy5wb3B1cC12aWRlb19fcHJvZ3Jlc3MtaW5uZXInKS5hbmltYXRlKHsgJ3dpZHRoJzogMCB9LCAxMDAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkKHZpZGVvKS5vbihcbiAgICAgICAgICAgICAgICAndGltZXVwZGF0ZScsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSAxMTM0IC8gdGhpcy5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAqIHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wb3B1cC12aWRlb19fcHJvZ3Jlc3MtaW5uZXInKS5hbmltYXRlKHsgJ3dpZHRoJzogd2lkdGggKyAncHgnIH0sIDUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBwYXVzZVZpZGVvRmlsZTogZnVuY3Rpb24obmFtZSkge1xuXG4gICAgICAgICAgICB0aGlzLm1vZGFsc1tuYW1lXS5wbGF5ID0gZmFsc2U7XG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpO1xuXG4gICAgICAgICAgICAkKCcucG9wdXAtdmlkZW9fX3Byb2dyZXNzLWlubmVyJykuc3RvcCgpO1xuICAgICAgICB9LFxuICAgICAgICByZWxvYWRWaWRlb0ZpbGU6IGZ1bmN0aW9uIChuYW1lKSB7XG5cbiAgICAgICAgICAgIHRoaXMubW9kYWxzW25hbWVdLnBsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgIHZpZGVvLmxvYWQoKTtcbiAgICAgICAgICAgICQoJy5wb3B1cC12aWRlb19fcHJvZ3Jlc3MtaW5uZXInKS5hbmltYXRlKHsnd2lkdGgnOiAwfSwgMTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZXJDbG9zZVZpZGVvUG9wdXA6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlTW9kYWwobmFtZSk7XG4gICAgICAgICAgICB0aGlzLnBhdXNlVmlkZW9GaWxlKG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRWaWRlb0ZpbGUobmFtZSk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgcGhvdG9PcGVuOiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlSW1nID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIGltZ3dpZHRoID0gZXZlbnQudGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdmFyIGltZ0hlaWdodCA9IGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgICAgIHZhciBkZXNjID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5zd2lwZXItc2xpZGUnKS5maW5kKCcudGV4dF9fZGVzYycpO1xuXG4gICAgICAgICAgICB2YXIgd2lkdGggPSAnYXV0bycsXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gJzEwMCUnO1xuXG4gICAgICAgICAgICB2YXIgaW1nID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgdmFyIHNyYyA9IGltZy5hdHRyKCdzcmMnKTtcblxuICAgICAgICAgICAgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJyNhcHAnKS5maW5kKCcucG9wdXAtcGhvdG8nKS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiJyArIHNyYyArICdcIiBjbGFzcz1cInBvcHVwX2ltZ1wiIHdpZHRoPVwiJyArIHdpZHRoICsgJ1wiIGhlaWdodD1cIicgKyBoZWlnaHQgKyAnXCIgLz4nICsgJzwvZGl2PicpO1xuICAgICAgICB9LFxuICAgICAgICBwaG90b0Nsb3NlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZUltZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnI2FwcCcpLmZpbmQoJy5wb3B1cF9pbWcnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcjYXBwJykuZmluZCgnLnBvcHVwLXBob3RvLWRlc2NyaXB0aW9uJykuZW1wdHkoKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vICAgICAgICAgRnVuY3Rpb25zICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9jb25zb2xlLmxvZyhhcHAuY29udGVudClcblxuZnVuY3Rpb24gcGFnYW5Jc0Nsb3NlKG9iaikge1xuICAgIGxldCBtb2RhbHMgPSBhcHAubW9kYWxzLFxuICAgICAgICBvID0gb2JqO1xuICAgICQoby5lbGVtZW50KS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiBtb2RhbHMpIHtcbiAgICAgICAgICAgIGlmIChtb2RhbHNbZWxlbV1bJ2FjdGl2ZSddKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZFbGVtID0gZWxlbVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFjdGl2RWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBzd2lwZUNsb3NlU2lkZWJhcihvYmplY3QpIHtcbiAgICBsZXQgbyA9IG9iamVjdCxcbiAgICAgICAgc3RhcnRYID0gMCxcbiAgICAgICAgbW9kYWxzID0gYXBwLm1vZGFscyxcbiAgICAgICAgZGlzdCxcbiAgICAgICAgYWN0aXZFbGVtLFxuICAgICAgICBjdXJQb3M7XG5cbiAgICAkKG8uZWxlbWVudCkub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07IC8vINC/0LXRgNCy0LDRjyDRgtC+0YfQutCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNGPXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRvdWNob2JqKVxuICAgICAgICBkaXN0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiBtb2RhbHMpIHtcbiAgICAgICAgICAgIGlmIChtb2RhbHNbZWxlbV1bJ2FjdGl2ZSddKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZFbGVtID0gZWxlbVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFjdGl2RWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydFggPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRYKVxuICAgIH0pO1xuXG4gICAgJChvLmVsZW1lbnQpLm9uKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07IC8vINC/0LXRgNCy0LDRjyDRgtC+0YfQutCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNGPINC00LvRjyDQtNCw0L3QvdC+0LPQviDRgdC+0LHRi9GC0LjRj1xuICAgICAgICBkaXN0ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCkgLSBzdGFydFg7XG4gICAgICAgIC8vY29uc29sZS5sb2coZGlzdCk7XG4gICAgfSk7XG5cbiAgICAkKG8uZWxlbWVudCkub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZGlzdCA+IG8uZGlzdGFuY2UpIHtcbiAgICAgICAgICAgIG1vZGFsc1thY3RpdkVsZW1dWydhY3RpdmUnXSA9IGZhbHNlO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2xvc2VkJylcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vL2NvbnNvbGUubG9nKGFwcC5tb2RhbHMpXG5cbmZ1bmN0aW9uIHN3aXBlQ2xvc2VQb3B1cChvYmplY3QpIHtcbiAgICBsZXQgbyA9IG9iamVjdCxcbiAgICAgICAgc3RhcnRZID0gMCxcbiAgICAgICAgbW9kYWxzID0gYXBwLm1vZGFscyxcbiAgICAgICAgZGlzdCwgYWN0aXZFbGVtLCBjdXJQb3M7XG5cbiAgICAkKG8uZWxlbWVudCkub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07IC8vINC/0LXRgNCy0LDRjyDRgtC+0YfQutCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNGPXG4gICAgICAgIGRpc3QgPSAwO1xuICAgICAgICBmb3IgKGxldCBlbGVtIGluIG1vZGFscykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbSlcbiAgICAgICAgICAgIGlmIChtb2RhbHNbZWxlbV1bJ2FjdGl2ZSddKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZFbGVtID0gZWxlbVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFjdGl2RWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydFkgPSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZKVxuICAgIH0pO1xuXG4gICAgJChvLmVsZW1lbnQpLm9uKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07IC8vINC/0LXRgNCy0LDRjyDRgtC+0YfQutCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNGPINC00LvRjyDQtNCw0L3QvdC+0LPQviDRgdC+0LHRi9GC0LjRj1xuICAgICAgICBkaXN0ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSkgLSBzdGFydFk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZGlzdCk7XG4gICAgfSk7XG5cbiAgICAkKG8uZWxlbWVudCkub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZGlzdCA+IG8uZGlzdGFuY2UpIHtcbiAgICAgICAgICAgIG1vZGFsc1thY3RpdkVsZW1dWydhY3RpdmUnXSA9IGZhbHNlO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2xvc2VkJylcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyBQZXJmZWN0IHNjcm9sbGJhciAoaHR0cHM6Ly9naXRodWIuY29tL3V0YXR0aS9wZXJmZWN0LXNjcm9sbGJhcilcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAkKCcuc2lkZWJhcl9fYmxvY2std2l0aC1zY3JvbGwnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcHMgPSBuZXcgUGVyZmVjdFNjcm9sbGJhcih0aGlzKTtcbiAgICB9KTtcblxuXG4gICAgcGFnYW5Jc0Nsb3NlKHtcbiAgICAgICAgZWxlbWVudDogJy5zd2lwZXItcGFnaW5hdGlvbi1idWxsZXQnLFxuICAgICAgICB0YXJnZXRFbGVtOiAnaXNBY3RpdmUnXG4gICAgfSk7XG5cblxuICAgIHN3aXBlQ2xvc2VTaWRlYmFyKHtcbiAgICAgICAgZWxlbWVudDogJy5zaWRlYmFyLXdyYXBwZXInLFxuICAgICAgICBkaXN0YW5jZTogMzAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLyDQtdGB0LvQuCDRgyDQvdCw0YEgaXNBY3RpdmVTaWRlYmFyQnVyYW4xLCDRgtC+INC/0LjRiNC10LwgaXNBY3RpdmVTaWRlYmFyXG4gICAgfSk7XG5cbiAgICBzd2lwZUNsb3NlUG9wdXAoe1xuICAgICAgICBlbGVtZW50OiAnLnBvcHVwJyxcbiAgICAgICAgZGlzdGFuY2U6IDMwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vINC10YHQu9C4INGDINC90LDRgSBpc0FjdGl2ZVBvcHVwQnVyYW4xLCDRgtC+INC/0LjRiNC10LwgaXNBY3RpdmVQb3B1cFxuICAgIH0pO1xuXG4gICAgbGV0IGxvbmdTbGlkZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICQoY29udGFpbmVyKS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBvZmZzZXQgPSAkKHRoaXMpLnNjcm9sbExlZnQoKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc3dpcGVyLW5vLXN3aXBpbmcnKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhvZmZzZXQsIDApO1xuICAgICAgfSk7XG4gICAgICAkKGNvbnRhaW5lcikub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob2Zmc2V0ID4gMTM0MCkge1xuICAgICAgICAgIG15U3dpcGVyLnNsaWRlTmV4dCgxMDAwKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb2snKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvZmZzZXQgPCA1KSB7XG4gICAgICAgICAgbXlTd2lwZXIuc2xpZGVQcmV2KDEwMDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGxvbmdTbGlkZXIoJy5sb25nU2xpZGVyX19jb250YWluZXInKTtcblxuICAgIG15U3dpcGVyLm9uKCdzbGlkZUNoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbmdlY29sb3JoZWFkZXIoKTtcbiAgICB9KTtcbiAgICBsZXQgY2hhbmdlSGVhZGVyQ29sb3IgPSB7XG4gICAgICAgIG1ha2VMaWdodDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQoJy5oZWFkZXJfX2NvbnRhaW5lcicpLmFkZENsYXNzKCdoZWFkZXJfX2NvbnRhaW5lci1saWdodCcpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2NvbnRhaW5lci1kYXJrJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG1ha2VEYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCgnLmhlYWRlcl9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY29udGFpbmVyLWxpZ2h0JykuYWRkQ2xhc3MoJ2hlYWRlcl9fY29udGFpbmVyLWRhcmsnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgY2hhbmdlY29sb3JoZWFkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBjdXJyZW50U2xpZGVOdW1iZXIgPSBteVN3aXBlci5hY3RpdmVJbmRleDtcbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudFNsaWRlTnVtYmVyKTtcblxuICAgICAgICBsZXQgY3VycmVudFNsaWRlID0gbXlTd2lwZXIuc2xpZGVzW2N1cnJlbnRTbGlkZU51bWJlcl07XG5cbiAgICAgICAgaWYgKCAkKGN1cnJlbnRTbGlkZSkuZmluZCgnLndyYXBwZXInKS5oYXNDbGFzcygnc2xpZGUtbGlnaHQnKSApIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi0YLQtdC60YPRidC40Lkg0YHQu9Cw0LnQtCDRgdCy0LXRgtC70YvQuSFcIik7XG4gICAgICAgICAgICBjaGFuZ2VIZWFkZXJDb2xvci5tYWtlTGlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfQotC10LrRg9GJ0LjQuSDRgdC70LDQudC0INGC0ZHQvNC90YvQuScpO1xuICAgICAgICAgICAgY2hhbmdlSGVhZGVyQ29sb3IubWFrZURhcmsoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggY3VycmVudFNsaWRlTnVtYmVyID09PSAxIHx8IGN1cnJlbnRTbGlkZU51bWJlciA9PT0gMCkge1xuICAgICAgICAgICAgJCgnI2ZpcnN0QmFja2dyb3VuZCcpLmNzcyhcIm9wYWNpdHlcIiwgJzEnKTtcbiAgICAgICAgICAgICQoJyNsYXN0QmFja2dyb3VuZCcpLmNzcyhcIm9wYWNpdHlcIiwgJzAnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJyNmaXJzdEJhY2tncm91bmQnKS5jc3MoXCJvcGFjaXR5XCIsICcwJyk7XG4gICAgICAgICAgICAkKCcjbGFzdEJhY2tncm91bmQnKS5jc3MoXCJvcGFjaXR5XCIsICcxJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hhbmdlY29sb3JoZWFkZXIoKTtcbn0pOyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJwYWdlc1wiOntcblx0XHRcdFwiaW50cm9cIjp7XG5cdFx0XHRcdFwiYmxvY2sxXCI6XCLQk9Cy0LjQsNC90YHQutC40Lkg0LrQvtGB0LzQuNGH0LXRgdC60LjQuSDRhtC10L3RgtGAXCIsXG5cdFx0XHRcdFwiYmxvY2syXCI6XCLQmtC+0YHQvdC40YLQtdGB0Ywg0Y3QutGA0LDQvdCwXCIsXG5cdFx0XHR9LFxuXHRcdFx0XCJwYWdlMlwiOntcblx0XHRcdFx0XCJibG9jazFcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrMlwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2szXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazRcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s2XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazdcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrOFwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s5XCI6XCJzb21lIHRleHRcIixcblx0XHRcdH0sXG5cdFx0XHRcInBhZ2UzXCI6e1xuXHRcdFx0XHRcImJsb2NrMVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2syXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazNcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNFwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s1XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazZcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrN1wiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s4XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazlcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0fSxcblx0XHRcdFwicG9wdXAxXCI6e1xuXHRcdFx0XHRcImJsb2NrMVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2syXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazNcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNFwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s1XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazZcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrN1wiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s4XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazlcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJzaWRlYmFyc1wiOntcblx0XHRcdFwic2lkZWJhcjFcIjp7XG5cdFx0XHRcdFwiYmxvY2sxXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazJcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrM1wiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s0XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazVcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNlwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s3XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazhcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrOVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHR9LFxuXHRcdFx0XCJzaWRlYmFyMlwiOntcblx0XHRcdFx0XCJibG9jazFcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrMlwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2szXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazRcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s2XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazdcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrOFwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s5XCI6XCJzb21lIHRleHRcIixcblx0XHRcdH1cblx0XHR9LFxuXHRcdFwicG9wdXBzXCI6e1xuXHRcdFx0XCJwb3B1cDFcIjp7XG5cdFx0XHRcdFwiYmxvY2sxXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazJcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrM1wiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s0XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazVcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNlwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s3XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazhcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrOVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHR9LFxuXHRcdFx0XCJwb3B1cDJcIjp7XG5cdFx0XHRcdFwiYmxvY2sxXCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazJcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrM1wiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s0XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazVcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrNlwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHRcdFwiYmxvY2s3XCI6XCJzb21lIHRleHRcIixcblx0XHRcdFx0XCJibG9jazhcIjpcInNvbWUgdGV4dFwiLFxuXHRcdFx0XHRcImJsb2NrOVwiOlwic29tZSB0ZXh0XCIsXG5cdFx0XHR9XG5cdFx0fSxcbn0iXX0=
