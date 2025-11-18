(function($) {
    "use strict";

    const mobileBreakpoint = 1024;

    document.addEventListener('click', function(e) {
        const target = e.target
        const lastFancybox = [...document.querySelectorAll('.fancybox-container:not(.fancybox-gallery)')].pop();
        if (lastFancybox) {
            if (lastFancybox.querySelector('.fancybox-slide--current')?.contains(target) && !lastFancybox.querySelector('.fancybox-slide--current .fancybox-content')?.contains(target)) jq(target).closest('.fancybox-container')?.data('FancyBox').close()
        }
    })

    const isMobileDevice = () => {
        const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
    }

    const filterToggleCollection = () => {
        if(isMobileDevice()){
            $('body').on('click', '.filter-toggle', function(){
                $('#filterColumn').toggleClass('active');
                return false;
            });
        }
    }

    function smoothScrollTo(to, duration) {
        const el = document.scrollingElement || document.documentElement,
            start = el.scrollTop,
            change = to - start,
            startTs = performance.now(),
            easeInOutQuad = function(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            animateScroll = function(ts) {
                let currentTime = ts - startTs;
                el.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
                if (currentTime < duration) {
                    requestAnimationFrame(animateScroll);
                }
                else {
                    el.scrollTop = to;
                }
            };
        if (document.body.classList.contains('has-hdr_sticky') && customElements.get('header-sticky')) document.body.querySelector('header-sticky')?.destroySticky();
        document.body.classList.add('blockSticky');
        setTimeout(() => {document.body.classList.remove('blockSticky')}, duration*1.5);
        requestAnimationFrame(animateScroll);
    }

    function getCoords(el) {
        const box = el.getBoundingClientRect(),
            body = document.body,
            docEl = document.documentElement,
            scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop,
            scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft,
            clientTop = docEl.clientTop || body.clientTop || 0,
            clientLeft = docEl.clientLeft || body.clientLeft || 0;
        return { top: Math.round(box.top +  scrollTop - clientTop), left: Math.round(box.left + scrollLeft - clientLeft) };
    }

    function fetchConfig(type = 'json') {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
        };
    }

    function wrapHTML(el, wrapper) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    function addResponsive(el = document) {
        el.querySelectorAll('table').forEach(el => {
            if (!el.closest('.table-responsive')) {
                el.classList.add('table');
                let wrap = document.createElement('div');
                wrap.classList.add('table-responsive');
                wrapHTML(el, wrap)
            }
        })

        el.querySelectorAll('iframe').forEach(el => {
            if (!el.closest('.bnslider') && !el.closest('embed-responsive') && (el.src.indexOf('youtube') != -1 || el.src.indexOf('vimeo') != -1)) {
                let wrap = document.createElement('div');
                wrap.classList.add('embed-responsive','embed-responsive-16by9');
                wrapHTML(el, wrap)
            }
        })
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    function removeClassByPrefix(node, className) {
        [...node.classList].forEach(v => {
            if (v.startsWith(className)) {
                node.classList.remove(v)
            }
        })
    }

    function removeClassBySuffix(node, className) {
        [...node.classList].forEach(v => {
            if (v.endsWith(className)) {
                node.classList.remove(v)
            }
        })
    }

    function setStyle(node, propertyObject) {
        if (!node) return false;
        for (let property in propertyObject) node.style[property] = propertyObject[property]
    }

    function backgroundImage() {
        var databackground = $('[data-background]:not(".background-added")');
        databackground.each(function() {
            if ($(this).attr('data-background')) {
                var image_path = $(this).attr('data-background');
                $(this).css({
                    'background': 'url(' + image_path + ')'
                }).addClass("background-added");
            }
        });
    }

    function siteToggleAction() {
        var siteOverlay = $('body').find('.ps-site-overlay');
        $('body').on('click', '.menu-toggle-open', function(e) {
            e.preventDefault();
            $(this).toggleClass('active')
            siteOverlay.toggleClass('active');
        });

        $('body').on('click', '.ps-toggle--sidebar', function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            $(this).toggleClass('active');
            $(this).siblings('a').removeClass('active');
            $(url).toggleClass('active');
            $(url).siblings('.ps-panel--sidebar').removeClass('active');
            siteOverlay.toggleClass('active');
        });

        $('body').on('click', '.ps-panel--sidebar .ps-panel__close', function(e) {
            e.preventDefault();
            $(this).closest('.ps-panel--sidebar').removeClass('active');
            siteOverlay.removeClass('active');
        });

        $('body').on("click", function(e) {
            if ($(e.target).siblings(".ps-panel--sidebar").hasClass('active')) {
                $('.ps-panel--sidebar').removeClass('active');
                siteOverlay.removeClass('active');
            }
        });
    }

    function subMenuToggle() {
        $('body').on('click', '.menu--mobile .menu-item-has-children > .sub-toggle', function(e) {
            e.preventDefault();
            var current = $(this).parent('.menu-item-has-children')
            $(this).toggleClass('active');
            current.siblings().find('.sub-toggle').removeClass('active');
            current.children('.sub-menu').slideToggle(350);
            current.siblings().find('.sub-menu').slideUp(350);
            if (current.hasClass('has-mega-menu')) {
                current.children('.mega-menu').slideToggle(350);
                current.siblings('.has-mega-menu').find('.mega-menu').slideUp(350);
            }
        });

        $('body').on('click', '.menu--mobile .has-mega-menu .mega-menu__column .sub-toggle', function(e) {
            e.preventDefault();
            var current = $(this).closest('.mega-menu__column');
            $(this).toggleClass('active');
            current.siblings().find('.sub-toggle').removeClass('active');
            current.children('.mega-menu__list').slideToggle();
            current.siblings().find('.mega-menu__list').slideUp();
        });
    }

    function stickyHeader() {
        var header = $('body').find('.header'),
            checkpoint = 50;
        if (header.data('sticky') === true) {
            $(window).scroll(function() {
                var currentPosition = $(this).scrollTop();
                if (currentPosition > checkpoint) {
                    header.addClass('header--sticky');
                } else {
                    header.removeClass('header--sticky');
                }
            });
        } else {
            return false;
        }
    }

    function setAnimation(_elem, _InOut) {
        var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        _elem.each(function() {
            var $elem = $(this);
            var $animationType = 'animated ' + $elem.data('animation-' + _InOut);

            $elem.addClass($animationType).one(animationEndEvent, function() {
                $elem.removeClass($animationType);
            });
        });
    }

    function owlCarouselConfig() {
        var target = $('.owl-slider:not(.owl-carousel-loaded)');
        const rtl = $('html').attr('dir') === 'rtl' ? true : false;
        if (target.length > 0) {
            target.each(function() {
                var el = $(this),
                    dataAuto = el.data('owl-auto'),
                    dataLoop = el.data('owl-loop'),
                    dataSpeed = el.data('owl-speed'),
                    dataGap = el.data('owl-gap'),
                    dataNav = el.data('owl-nav'),
                    dataDots = el.data('owl-dots'),
                    dataAnimateIn = el.data('owl-animate-in')
                        ? el.data('owl-animate-in')
                        : '',
                    dataAnimateOut = el.data('owl-animate-out')
                        ? el.data('owl-animate-out')
                        : '',
                    dataDefaultItem = el.data('owl-item'),
                    dataItemXS = el.data('owl-item-xs'),
                    dataItemSM = el.data('owl-item-sm'),
                    dataItemMD = el.data('owl-item-md'),
                    dataItemLG = el.data('owl-item-lg'),
                    dataItemXL = el.data('owl-item-xl'),
                    dataNavLeft = el.data('owl-nav-left')
                        ? el.data('owl-nav-left')
                        : "<i class='icon-chevron-left'></i>",
                    dataNavRight = el.data('owl-nav-right')
                        ? el.data('owl-nav-right')
                        : "<i class='icon-chevron-right'></i>",
                    duration = el.data('owl-duration'),
                    datamouseDrag =
                        el.data('owl-mousedrag') == 'on' ? true : false;
                if (target.children('div, span, a, img, h1, h2, h3, h4, h5, h5').length >= 2) {
                    if(isMobileDevice()){
                        if(!$(this).hasClass('desktop-slider')){
                            el.addClass('owl-carousel owl-carousel-loaded').owlCarousel({
                                animateIn: dataAnimateIn,
                                animateOut: dataAnimateOut,
                                margin: dataGap,
                                autoplay: dataAuto,
                                autoplayTimeout: dataSpeed,
                                autoplayHoverPause: true,
                                loop: dataLoop,
                                nav: dataNav,
                                mouseDrag: datamouseDrag,
                                touchDrag: true,
                                autoplaySpeed: duration,
                                navSpeed: duration,
                                dotsSpeed: duration,
                                dragEndSpeed: duration,
                                navText: [dataNavLeft, dataNavRight],
                                dots: dataDots,
                                items: dataDefaultItem,
                                rtl: rtl,
                                responsive: {
                                    0: {
                                        items: dataItemXS,
                                    },
                                    480: {
                                        items: dataItemSM,
                                    },
                                    768: {
                                        items: dataItemMD,
                                    },
                                    992: {
                                        items: dataItemLG,
                                    },
                                    1200: {
                                        items: dataItemLG,
                                        margin: 16,
                                    },
                                    1440: {
                                        items: dataItemLG,
                                        margin: 16,
                                    },
                                    1600: {
                                        items: dataItemXL,
                                    },
                                },
                            });
                            carouselNavigation();
                        }
                    }else{
                        el.addClass('owl-carousel owl-carousel-loaded').owlCarousel({
                            animateIn: dataAnimateIn,
                            animateOut: dataAnimateOut,
                            margin: dataGap,
                            autoplay: dataAuto,
                            autoplayTimeout: dataSpeed,
                            autoplayHoverPause: true,
                            loop: dataLoop,
                            nav: dataNav,
                            mouseDrag: datamouseDrag,
                            touchDrag: true,
                            autoplaySpeed: duration,
                            navSpeed: duration,
                            dotsSpeed: duration,
                            dragEndSpeed: duration,
                            navText: [dataNavLeft, dataNavRight],
                            dots: dataDots,
                            items: dataDefaultItem,
                            rtl: rtl,
                            responsive: {
                                0: {
                                    items: dataItemXS,
                                },
                                480: {
                                    items: dataItemSM,
                                },
                                768: {
                                    items: dataItemMD,
                                },
                                992: {
                                    items: dataItemLG,
                                },
                                1200: {
                                    items: dataItemLG,
                                    margin: 16,
                                },
                                1440: {
                                    items: dataItemLG,
                                    margin: 16,
                                },
                                1600: {
                                    items: dataItemXL,
                                },
                            },
                        });
                        carouselNavigation();
                    }
                }
            });
        }
    }

    function owlCarouselProduct() {
        var target = $('.product-slider:not(.owl-loaded)');
        const rtl = $('html').attr('dir') === 'rtl' ? true : false;
        if (target.length > 0) {
            target.each(function() {
                var el = $(this),
                    dataAuto = el.data('owl-auto'),
                    dataLoop = el.data('owl-loop'),
                    dataSpeed = el.data('owl-speed'),
                    dataGap = el.data('owl-gap'),
                    dataNav = el.data('owl-nav'),
                    dataDots = el.data('owl-dots'),
                    dataAnimateIn = el.data('owl-animate-in')
                        ? el.data('owl-animate-in')
                        : '',
                    dataAnimateOut = el.data('owl-animate-out')
                        ? el.data('owl-animate-out')
                        : '',
                    dataDefaultItem = el.data('owl-item'),
                    dataItemXS = el.data('owl-item-xs'),
                    dataItemSM = el.data('owl-item-sm'),
                    dataItemMD = el.data('owl-item-md'),
                    dataItemLG = el.data('owl-item-lg'),
                    dataItemXL = el.data('owl-item-xl'),
                    dataNavLeft = el.data('owl-nav-left')
                        ? el.data('owl-nav-left')
                        : "<i class='icon-chevron-left'></i>",
                    dataNavRight = el.data('owl-nav-right')
                        ? el.data('owl-nav-right')
                        : "<i class='icon-chevron-right'></i>",
                    duration = el.data('owl-duration'),
                    datamouseDrag =
                        el.data('owl-mousedrag') == 'on' ? true : false;
                if (target.children('div, span, a, img, h1, h2, h3, h4, h5, h5').length >= 2) {
                    el.addClass('owl-carousel').owlCarousel({
                        animateIn: dataAnimateIn,
                        animateOut: dataAnimateOut,
                        margin: dataGap,
                        autoplay: dataAuto,
                        autoplayTimeout: dataSpeed,
                        autoplayHoverPause: true,
                        loop: dataLoop,
                        nav: dataNav,
                        mouseDrag: datamouseDrag,
                        touchDrag: true,
                        autoplaySpeed: duration,
                        navSpeed: duration,
                        dotsSpeed: duration,
                        dragEndSpeed: duration,
                        navText: [dataNavLeft, dataNavRight],
                        dots: dataDots,
                        items: dataDefaultItem,
                        rtl: rtl,
                        responsive: {
                            0: {
                                items: dataItemXS,
                            },
                            480: {
                                items: dataItemSM,
                            },
                            768: {
                                items: dataItemMD,
                            },
                            992: {
                                items: dataItemLG,
                            },
                            1200: {
                                items: dataItemLG,
                                margin: 16,
                            },
                            1440: {
                                items: dataItemLG,
                                margin: 16,
                            },
                            1600: {
                                items: dataItemXL,
                            },
                        },
                    });
                    el.find('a').removeClass('hidden');
                }
            });
        }
    }

    function tabs() {
        $('body').on('click', '.ps-tab-list  li > a ', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(this).closest('li').siblings('li').removeClass('active');
            $(this).closest('li').addClass('active');
            $(target).addClass('active');
            $(target).siblings('.ps-tab').removeClass('active');
        });

        $('body').on('click', '.ps-tab-list.owl-slider .owl-item a', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(this).closest('.owl-item').siblings('.owl-item').removeClass('active');
            $(this).closest('.owl-item').addClass('active');
            $(target).addClass('active');
            $(target).siblings('.ps-tab').removeClass('active');
        });
    }

    function carouselNavigation() {
        var prevBtn = $('body').find('.ps-btn--carouse-arrow.prev'),
            nextBtn = $('body').find('.ps-btn--carouse-arrow.next');
        prevBtn.on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(target).trigger('prev.owl.carousel', [1000]);
        });
        nextBtn.on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $(target).trigger('next.owl.carousel', [1000]);
        });
    }

    function accordion() {
        var accordion = $('body').find('.ps-accordion');
        accordion.find('.ps-accordion__content').hide();
        $('.ps-accordion.active')
            .find('.ps-accordion__content')
            .show();
        accordion.find('.ps-accordion__header').on('click', function(e) {
            e.preventDefault();
            if (
                $(this)
                    .closest('.ps-accordion')
                    .hasClass('active')
            ) {
                $(this)
                    .closest('.ps-accordion')
                    .removeClass('active');
                $(this)
                    .closest('.ps-accordion')
                    .find('.ps-accordion__content')
                    .slideUp(250);
            } else {
                $(this)
                    .closest('.ps-accordion')
                    .addClass('active');
                $(this)
                    .closest('.ps-accordion')
                    .find('.ps-accordion__content')
                    .slideDown(250);
                $(this)
                    .closest('.ps-accordion')
                    .siblings('.ps-accordion')
                    .find('.ps-accordion__content')
                    .slideUp();
            }
            $(this)
                .closest('.ps-accordion')
                .siblings('.ps-accordion')
                .removeClass('active');
            $(this)
                .closest('.ps-accordion')
                .siblings('.ps-accordion')
                .find('.ps-accordion__content')
                .slideUp();
        });
    }

    function createNoUiSlider(selectorID) {
        var selector = document.getElementById(selectorID);
        if (selector) {
            const selectorDOM = $('#' + selectorID);
            noUiSlider.create(selector, {
                connect: true,
                behaviour: 'tap',
                start: [0, 1000],
                range: {
                    min: 0,
                    '10%': 100,
                    '20%': 200,
                    '30%': 300,
                    '40%': 400,
                    '50%': 500,
                    '60%': 600,
                    '70%': 700,
                    '80%': 800,
                    '90%': 900,
                    max: 1000,
                },
            });

            const minLabel = selectorDOM.closest('.ps-form--slider').find('.ps-form__min > .value')
            const maxLabel = selectorDOM.closest('.ps-form--slider').find('.ps-form__max > .value')
            selector.noUiSlider.on('update', function(values) {
                minLabel.html(Math.round(values[0]))
                maxLabel.html(Math.round(values[1]))
            });
        }
    }

    function initNoUiSlider() {
        const selectors = [
            'price_range',
            'land_area_range',
            'dialog_price_range',
            'dialog_land_area_range',
        ]
        selectors.forEach(function(item) {
            createNoUiSlider(item);
        })
    }

    function handleToggleSearchType() {
        const selector = $('body').find('.ps-form--projects-search');
        selector.find('.ps-form__toggle-btn').on('click', function(e) {
            e.preventDefault();
            if (selector.hasClass('active')) {
                selector.find('.ps-form__bottom').slideUp(250);
                selector.removeClass('active');
            } else {
                selector.find('.ps-form__bottom').slideDown(250);
                selector.addClass('active');
            }
        })
    }

    function handleSelectPropertyType() {
        const selector = $('body').find('.ps-form__type-toggle');
        selector.on('click', function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).siblings('.ps-btn').addClass('active');
                $(this).removeClass('active')
            } else {
                $(this).addClass('active')
                $(this).siblings('.ps-btn').removeClass('active');
            }
        })
    }

    function handleToggleSearchExtra() {
        $('body').on('click', '.ps-search-open', function(e) {
            e.preventDefault();
            $('body').find('#search-extra-dialog').addClass('active');
        })
        $('body').on('click', '#close-search-extra', function(e) {
            e.preventDefault();
            $('body').find('#search-extra-dialog').removeClass('active');
        })
    }

    function handleBackToTop() {
        var scrollPos = 0, element = $('body').find('#back2top');
        $(window).scroll(function() {
            var scrollCur = $(window).scrollTop();
            if (scrollCur > scrollPos) {
                // scroll down
                if (scrollCur > 500) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            } else {
                // scroll up
                element.removeClass('active');
            }

            scrollPos = scrollCur;
        });

        element.on('click', function() {
            $('html, body').animate(
                {
                    scrollTop: '0px',
                },
                800
            );
        });
    }

    function handleToggleDrawer() {
        var siteOverlay = $('body').find('.ps-site-overlay');
        $('body').on('click', '.ps-toggle-drawer', function(e) {
            e.preventDefault();
            const target = $(this).data('target');
            $("#" + target).addClass('active');
            siteOverlay.addClass('active');

        });

        $('body').on('click', '.ps-drawer__close', function(e) {
            e.preventDefault();
            $(this).closest('.ps-drawer').removeClass('active');
            siteOverlay.removeClass('active');
        })

        $('body').on("click", function(e) {
            if ($(e.target).siblings(".ps-drawer").hasClass('active')) {
                $('.ps-drawer').removeClass('active');
                siteOverlay.removeClass('active');
            }
        });
    }

    function addToWishlist(){
        let key = "finderlandWishList";
        let defaultWishlist = [];
        if (localStorage.getItem(key) !== null) {
            defaultWishlist = JSON.parse(localStorage.getItem(key));
        } else {
            localStorage.setItem(key, JSON.stringify([]));
        }

        $('body').on("click", '.ps-project__actions .whishlist', function(e) {
            defaultWishlist = JSON.parse(localStorage.getItem(key));
            let id = $(this).data('id');
            if(!defaultWishlist.includes(id)){
                defaultWishlist.push(id);
                $(this).addClass('active');
                localStorage.setItem(key, JSON.stringify(defaultWishlist));
            }
        });
    }

    function scrollBar(){
        Scrollbar.initAll();
    }

    function moveQuantityNode(ctx) {
        const mobileContainer = ctx.querySelector('[data-node-mobile]');
        const desktopContainer = ctx.querySelector('[data-node-desktop]');
        if (window.matchMedia('(max-width:767px)').matches) {
            if (mobileContainer && !mobileContainer.innerHTML.trim().length) {
                mobileContainer.insertAdjacentHTML('afterbegin', desktopContainer.innerHTML);
                desktopContainer.innerHTML = ''
            }
        } else {
            if (desktopContainer && !desktopContainer.innerHTML.trim().length) {
                desktopContainer.insertAdjacentHTML('afterbegin', mobileContainer.innerHTML);
                mobileContainer.innerHTML = ''
            }
        }
    }

    $(function() {
        owlCarouselConfig();
        owlCarouselProduct();
        setTimeout(() => {
            backgroundImage();
        }, 300);
        siteToggleAction();
        subMenuToggle();
        tabs();
        stickyHeader();
        carouselNavigation();
        accordion();
        handleToggleSearchType();
        // handleSelectPropertyType();
        handleToggleSearchExtra();
        handleBackToTop();
        handleToggleDrawer();
        // addToWishlist();
        scrollBar();

        setInterval(() => {
            owlCarouselConfig();
            owlCarouselProduct();
        }, 5000);

        document.querySelectorAll('.minicart-prd').forEach(item=>{
            moveQuantityNode(item)
        });
        filterToggleCollection();

        if(isMobileDevice()){
            $('body').find('.owl-slider.desktop-slider').addClass('is-desktop-slider');
        }
    });

    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

    class LoadingBar extends HTMLElement {
        constructor() {
            super();
            this.style.setProperty('--load-time', this.dataset.time);
        }

        start() {
            this.classList.remove('hidden');
            void this.offsetWidth;
            this.style.width = '100%';
            this.classList.add('lb--animated');
            this.addEventListener('transitionend', () => {
                this.hide()
            }, false)
        }

        hide() {
            this.classList.add('hidden');
            this.classList.remove('lb--animated');
            this.style.width = '0'
        }
    }
    customElements.define('loading-bar', LoadingBar);

    class Popup extends HTMLElement {
        constructor() {
            super();
            this.popupSelector = this.dataset.selector;
            this.cloneSelector = document.querySelector(this.dataset.clone);
            this.popupElement = document.querySelector(this.popupSelector);
            this.popupLinks = this.querySelector('a') ? this.querySelectorAll('a') : this.querySelectorAll('span');
            this.cachedResults = [];
            this.buttonTemplate = '<button type="button" data-fancybox-close="" class="fancybox-button fancybox-close-small" title="Close"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg></button>'
            this.loaderTemplate = '<div data-load="loading"></div>';
            if ('constructorExtend' in this) {
                this.constructorExtend()
            }
            this.popupLinks.forEach(
                (button) => button.addEventListener('click', this.open.bind(this))
            )
            window.addEventListener('resize', debounce(() => {
                this.isOpened() && this.isScroll()
            }, 500))
        }
        open(e) {
            if (this.closeClick) return false;
            e && e.preventDefault();
            const animationEffect = this.dataset.animationEffect ? this.dataset.animationEffect : 'fade',
                baseClass = (this.tagName == 'FILTER-POPUP') ? 'fancybox-container--filter' : '',
                hideScrollbar = (this.tagName == 'FILTER-POPUP' && window.matchMedia('(min-width:1025px)').matches) ? false : true;
            if (!this.isOpened()) {
                const main = () => {
                    this.fancybox = $.fancybox.open({
                        type: 'inline',
                        src: this.popupSelector,
                        animationEffect: animationEffect,
                        animationDuration: 200,
                        touch: false,
                        //hideScrollbar: hideScrollbar,
                        baseClass: baseClass,
                        beforeLoad: () => {
                            if ('popupBeforeLoadExtend' in this) this.popupBeforeLoadExtend()
                        },
                        afterLoad: () => {
                            new Promise(resolve => {
                                if (this.tagName != 'FILTER-POPUP' || window.matchMedia(`(max-width:${mobileBreakpoint}px)`).matches)  {
                                    bodyScrollLock.disableBodyScroll(this.popupElement, {
                                        allowTouchMove: el => {
                                            while (el && el !== document.body) {
                                                if (el.getAttribute('body-scroll-lock-ignore') !== null) return true;
                                                el = el.parentElement
                                            }
                                        }
                                    })
                                }
                                this.popupAfterLoad();
                                if ('popupAfterLoadExtend' in this)  this.popupAfterLoadExtend();
                                if (this.hasAttribute('data-fullheight')) this.popupElement?.classList.add('fc--fullheight');
                                resolve()
                            }).then(() => {this.popupElement?.classList.add('is-opened')})
                        },
                        beforeShow: () => {
                            if ('popupBeforeShowExtend' in this) this.popupBeforeShowExtend();
                            if (!document.body.classList.contains('has-sticky')) document.body.classList.add('blockSticky');
                            document.querySelectorAll('main-slider').forEach(slider => slider.stopAutoplay())
                        },
                        afterShow: () => {
                            if (this.tagName !== 'FILTER-POPUP') this.popupAfterShow();
                            if ('popupAfterShowExtend' in this) this.popupAfterShowExtend();
                            setTimeout(() => {
                                if (this.popupElement && this.popupElement.classList.contains('fancybox-effect-slide-out')) this.popupElement.classList.add('is-animate')
                            }, 200)
                        },
                        beforeClose: () => {
                            this.popupBeforeClose();
                            if ('popupBeforeCloseExtend' in this) this.popupBeforeCloseExtend();
                            if (this.popupElement && this.popupElement.classList.contains('fancybox-effect-slide-out')) this.popupElement.classList.remove('is-animate')
                        },
                        afterClose: () => {
                            if ('popupAfterCloseExtend' in this) this.popupAfterCloseExtend();
                            if (this.cloneSelector) this.destroyScroll();
                            document.querySelectorAll('main-slider').forEach(slider => slider.startAutoplay());
                            document.body.classList.remove('blockSticky');
                            document.body.style.overflowY = ''
                        }
                    })
                    if (this.dataset.ajax) {
                        const ajaxContainerElement = this.popupElement.querySelector('[data-ajax-container]'),
                            container = ajaxContainerElement || this.popupElement,
                            urlAjax = this.dataset.ajax,
                            filterCacheUrl = (el) => el.url === urlAjax;
                        if (!this.popupElement.querySelector('[data-load]')) container.innerHTML = this.loaderTemplate;
                        if (!this.cachedResults.some(filterCacheUrl)) {
                            fetch(urlAjax).then((response) => response.text())
                                .then((data) => {
                                    this.popupElement.querySelector('[data-load]')?.remove();
                                    const shopifySection = new DOMParser().parseFromString(data, 'text/html').querySelector('.shopify-section'),
                                        closeButtonData = new DOMParser().parseFromString(data, 'text/html').querySelector('.fancybox-close-small'),
                                        closeButton = closeButtonData ? '' : this.buttonTemplate;
                                    let innerData = shopifySection ? shopifySection.innerHTML : data;
                                    if (this.dataset.subtitle) {
                                        const subtitle = new DOMParser().parseFromString(data, 'text/html').querySelector('.h-sub');
                                        if (subtitle) {
                                            const subtitleContainer = subtitle.outerHTML;
                                            innerData = innerData.replace(subtitleContainer,subtitleContainer.replace('><', `>${this.dataset.subtitle}<`));
                                        }
                                    }
                                    container.innerHTML = innerData + closeButton;
                                    container.classList.add('modal-ajax-loaded');
                                    this.updateScroll();
                                    addResponsive(this.popupElement);
                                    if ('popupAjaxExtend' in this) {
                                        this.popupAjaxExtend()
                                    }
                                    this.cachedResults.push({'url': urlAjax, 'html': innerData + closeButton});
                                })
                                .catch((error) => {
                                    console.error('error', error);
                                    setTimeout(() => {
                                        this.fancybox.close()
                                    }, 2000)
                                })
                        } else {
                            container.innerHTML = this.cachedResults.find(filterCacheUrl).html;
                            if ('popupAfterCachLoad' in this) this.popupAfterCachLoad();
                            this.updateScroll();
                        }
                    } else if (this.dataset.clone && 'cloneNode' in this) {
                        if (!this.cloneSelector) {
                            this.classList.add('ajax-awaiting');
                            document.querySelector('filter-toggle')?.click()
                        } else this.cloneNode()
                    }
                    if ('clickEventExtend' in this) {
                        this.clickEventExtend()
                    }
                }
                if ('beforeFancybox' in this) {
                    new Promise(resolve => {
                        this.beforeFancybox(resolve);
                    }).then(() => main())
                } else main()
            }
        }
        close() {
            this.fancybox ? this.fancybox.close() : this.popupElement.closest('.fancybox-container')?.querySelector('[data-fancybox-close]').click()
        }
        destroyScroll() {
            this.popupElement?.querySelectorAll('.js-dropdn-content-scroll').forEach(scroll => {
                if (Scrollbar.get(scroll) && scroll.dataset.scrollbar) {
                    Scrollbar.get(scroll).destroy()
                }
            })
        }
        updateScroll() {
            this.popupElement?.querySelectorAll('.js-dropdn-content-scroll').forEach(scroll => {
                if (Scrollbar.get(scroll) && scroll.dataset.scrollbar) {
                    Scrollbar.get(scroll).update();
                    this.popupElement.classList.remove('hide-scroll');
                    this.hideTooltip(scroll);
                } else {
                    if (scroll.classList.contains('prd-block-info-scroll') && window.matchMedia('(max-width:991px)').matches) return;
                    new Promise(resolve => {
                        Scrollbar.init(scroll, {
                            alwaysShowTracks: true,
                            damping: document.body.dataset.damping
                        })
                        this.hideTooltip(scroll);
                        this.popupElement.classList.remove('hide-scroll')
                        resolve()
                    }).then(() => {
                        setTimeout(() => {this.isScroll()}, 500)
                    })
                }
            })
        }
        hideTooltip(scroll) {}
        isScroll() {
            this.popupElement.querySelectorAll('.js-dropdn-content-scroll').forEach(scroll => {
                scroll.dataset.scrollbar && scroll.querySelector('.scrollbar-track-y').style.display == 'block' ? scroll.classList.add('has-scroll') : scroll.classList.remove('has-scroll')
            })
        }
        isOpened() {
            return Boolean(this.popupElement !== null && this.popupElement.closest('.fancybox-is-open'))
        }
        popupAfterLoad() {
            this.popupElement.classList.add('hide-scroll')
        }
        popupAfterShow() {
            this.updateScroll()
        }
        popupBeforeClose() {
            this.popupElement.classList.remove('is-opened');
            bodyScrollLock.enableBodyScroll(this.popupElement);
            setTimeout(() => {
                this.popupElement.querySelectorAll('.js-dropdn-content-scroll').forEach(scroll => {
                    if (Scrollbar.get(scroll) && scroll.dataset.scrollbar) {
                        Scrollbar.get(scroll).scrollTo(0,0,0)
                    }
                })
            }, 500);
        }
        closeOtherPopup() {
            document.querySelectorAll('.fancybox-container').forEach(popup => {
                if (popup != this.popupElement.closest('.fancybox-container')) {
                    jq(popup).data('FancyBox').close()
                }
            })
        }
        hideScroll() {
            this.popupElement.querySelectorAll('.scrollbar-track').forEach(scroll => {scroll.style.opacity = 0})
        }
        showScroll() {
            this.popupElement.querySelectorAll('.scrollbar-track').forEach(scroll => {scroll.style.opacity = 1})
        }
        reInit() {
            this.cloneSelector = document.querySelector(this.dataset.clone);
            this.popupElement = document.querySelector(this.popupSelector)
        }
        static hideAllTooltip() {
        }
        static clearQuickViewCache() {
            document.querySelectorAll('quickview-popup').forEach(el => {el.cachedResults = []});
        }
        static closeAllPopups(exept) {
            document.querySelectorAll('.fancybox-container').forEach(popup => {
                if (exept) {
                    if (!popup.querySelector(exept)) jq(popup).data('FancyBox').close()
                } else jq(popup).data('FancyBox').close()
            })
        }
        static closePopupExeptCart() {
            document.querySelectorAll('.fancybox-container').forEach(popup => {
                if (!popup.querySelector('.dropdn-modal-minicart')) {
                    jq(popup).data('FancyBox').close()
                }
            })
        }
        static closeWishlistAndCart() {
            document.querySelectorAll('.fancybox-container').forEach(popup => {
                if (popup.querySelector('.minicart-drop')) {
                    jq(popup).data('FancyBox').close()
                }
            })
        }
    }

    class QuickViewPopup extends Popup {
        constructorExtend() {
            this.icon = this.querySelector('svg');
            window.addEventListener('resize', debounce(() => {
                this.updateScroll();
                this.setModalHeight()
            }, 500))
        }
        clickEventExtend() {
            if (this.closest('lookbook-prd')) {
                this.querySelector('a').classList.add('active')
            } else if (this.icon) {
                this.icon.classList.add('like-animation-focus')
            }
            this.dataset.gallery == 'off' ? this.popupElement.classList.add('off-gallery') : this.popupElement.classList.remove('off-gallery');
        }
        popupBeforeShowExtend() {
            const popup = this.closest('.fancybox-container');
            if (this.getAttribute('data-slot') == 'pickup-availability-drawer' && popup) jq(popup).data('FancyBox').close();
            this.showCarousel();
            this.setModalHeight();
        }
        popupAfterShowExtend() {
            QuickViewPopup.popupAfterShowExtendPublic(this.popupElement)
        }
        static popupAfterShowExtendPublic(ctx) {
            ctx.querySelectorAll('.js-set-height').forEach(el => {
                el.style.setProperty('--tab-height', el.scrollHeight + 'px')
            })
        }
        popupAjaxExtend() {
            this.showCarousel();
            this.setModalHeight();
            this.popupAfterShowExtend()
        }
        popupAfterCloseExtend() {
            if (this.icon) this.icon.classList.remove('like-animation-focus');
            if (this.dataset.ajax) this.popupElement.innerHTML = '<div data-load="loading"></div>';
            if (this.popupElement) {
                this.popupElement.style.minHeight = ''
            }
        }
        popupAfterLoadExtend() {
            document.querySelector('[data-handler="recentlyViewed"]')?.dispatchEvent(new CustomEvent('quick-view-popup-after-load-extend', {bubbles: false, detail: {handle: this.dataset.handle}}))
        }
        showCarousel() {
            setTimeout(() => {
                const gallery = this.popupElement.querySelector('.ps-project__gallery-quickview');
                if (gallery) {
                    owlCarouselConfig();
                }
            }, 100)
        }
        setModalHeight() {
            if (!this.popupElement) return;
            const gallery = this.popupElement.querySelector('.ps-project__gallery-quickview');
            if (gallery && this.dataset.gallery !== 'off') {
                const productBlockHeight = gallery.closest('.prd-block').scrollHeight,
                    fancyboxContainer = gallery.closest('.fancybox-container'),
                    modal = gallery.closest('.fancybox-content'),
                    modalHeight = modal.scrollHeight,
                    galleryHeight = gallery.scrollHeight;
                modal.style.minHeight = window.matchMedia('(max-width:1024px)').matches ? productBlockHeight + 'px' : galleryHeight + (modalHeight - productBlockHeight) + 'px'
                fancyboxContainer.classList.add('fancybox--scroll')
            }
        }
        clearAllCache() {
            document.querySelectorAll('quickview-popup').forEach(el => {el.cachedResults = []});
        }
    }

    customElements.define('quickview-popup', QuickViewPopup);

    class ButtonAnimated extends HTMLElement {
        constructor() {
            super();
            this.btn = this.children[0];
            this.pauseAnimate = parseInt(this.dataset.pause);
            if (this.dataset.onesAnimate == undefined) {
                this.start(parseInt(this.dataset.delayStart));
                if (!this.btn.classList.contains('disabled')) {
                    this.btn.addEventListener('mouseenter', () => {
                        this.stop()
                    });
                    this.btn.addEventListener('mouseleave', () => {
                        this.start(parseInt(this.dataset.delayAfterStop))
                    })
                }
            }
        }
        onesAnimate() {
            let btn = this.btn,
                styleClass = 'btn--animated-'+this.dataset.style;
            this.btn.classList.add(styleClass);
            setTimeout(() => {btn.classList.remove(styleClass)}, 1500);
        }
        start(delay) {
            let btn = this.btn,
                styleClass = 'btn--animated-'+this.dataset.style,
                that = this;
            that.animatedButton = setTimeout(function toggleClass() {
                btn.classList.add(styleClass);
                setTimeout(() => {btn.classList.remove(styleClass)}, 1500);
                that.animatedButton = setTimeout(toggleClass, that.pauseAnimate)
            }, delay);
        }
        stop() {
            if (this.animatedButton) {
                clearTimeout(this.animatedButton);
                this.animatedButton = 0;
            }
        }
    }
    customElements.define('button-animated', ButtonAnimated);

    class ToggleMinicartActions extends HTMLElement {
        constructor() {
        super();
            this.addEventListener('click', this.onButtonClick.bind(this));
        }
        onButtonClick(event) {
            event.preventDefault();
        
            document.querySelectorAll('.minicart-drop-content .minicart-prd').forEach(item => {
                if (this.closest('.minicart-prd') !== item.closest('.minicart-prd')) {
                item.classList.remove('is-opened');
                }
            });
            this.closest('.minicart-prd').classList.toggle('is-opened');
        }
    }
    customElements.define('toggle-minicart-actions', ToggleMinicartActions);

    class QuantityInput extends HTMLElement {
        constructor() {
            super();
            this.input = this.querySelector('input');
            this.changeEvent = new Event('change', { bubbles: true })
            this.querySelectorAll('button').forEach(
                button => button.addEventListener('click', this.onButtonClick.bind(this))
            );
            this.input.addEventListener('paste', (e) => {
                e.preventDefault()
            });
            this.min = this.input.getAttribute('min');
            this.max = this.input.getAttribute('max');
            this.status = this.querySelector('.quantity-status');
            if (this.max) {
                this.updateStatus(this.input.value);
                this.input.addEventListener('keyup', () => {
                    this.updateStatus(this.input.value)
                });
                setTimeout(() => {
                    this.status?.classList.add('has-animation')
                }, 500);
            }
        }
        onButtonClick(event) {
            event.preventDefault();
            if (event.target.classList.contains('disabled')) return false;
            const previousValue = this.input.value;
            event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
            if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
            if (this.max) this.updateStatus(this.input.value);
        }
        updateStatus(val){
            const value = parseFloat(val),
                persent = value * 100 / this.max,
                statusClass = persent < 50 ? 'qs--start' : persent < 100 ? 'qs--middle' : 'qs--full';
            if (this.status) {
                removeClassByPrefix(this.status,'qs--', '');
                this.status.classList.add(statusClass)
            };
            this.style.setProperty('--qty-status-persent', persent + '%');
            if (this.min > value) {
                this.input.value = this.min;
                this.status?.classList.add('qs--full')
            } else if (this.max <= value) {
                this.input.value = this.max;
                this.querySelector('.prd-quantity-up').classList.add('disabled')
            } else {
                this.querySelector('.prd-quantity-up').classList.remove('disabled')
            }
        }
    }
    customElements.define('quantity-input', QuantityInput);

    class CartClearButton extends HTMLElement {
        constructor() {
        super();
        this.addEventListener('click', (event) => {
            event.preventDefault();
            this.querySelector('.loading-overlay').classList.remove('hidden');
            this.closest('cart-items').clearCart();
        });
        }
    }
    
    customElements.define('cart-clear-button', CartClearButton);

    class CartItems extends HTMLElement {
        constructor() {
          super();
          /*this.cartJs = this.getInitCartJs();*/
          this.cartClearButton = this.querySelector('cart-clear-button');
          this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');
          this.currentLineCount = Array.from(this.querySelectorAll('[name="updates[]"]')).length;
          this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
            .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
          this.onCartPage = this.id === 'main-cart-items';
      
          this.scrollElement = this.querySelector('.cart-form-element .js-dropdn-content-scroll');
      
      
          this.debouncedOnChange = debounce((event) => {
            this.onChange(event);
          }, 300);
      
          this.addEventListener('change', this.debouncedOnChange.bind(this));
          
          if (!(this.id === 'header-cart' && this.dataset.onCartPage === 'true')) {
            window.addEventListener('storage', this.onStorageChange(this));
          }
        }
      
        onStorageChange(event) {
            if(event.key === 'cartJs') {
                const parsedState = JSON.parse(localStorage.getItem('parsedState'));
                const section = this.dataset.id;
                const renderContentsOnStorageChange = (parsedState) => {
                    this.renderContents(parsedState);
                    this.toggleEmptyClass(parsedState);
                };
        
                let sectionsToRender = this.getSectionsToRender().filter(item => Boolean(document.querySelector('#'+item.id))).filter((item, index, self) => self.findIndex((s) => item.id === s.id) === index && item.id !== 'main-cart-items' && item.id !== 'cart-live-region-text').map(item => item.section).slice(0,5);
                if (this.onCartPage) {
                    sectionsToRender = [...sectionsToRender, section];
                }
                
                fetch(`${this.onCartPage ? window.routes.cart_url : window.shopUrl}?sections=${sectionsToRender.join(',')}`).then(response => response.json()).then(response => {
                    parsedState.sections = response;
                    renderContentsOnStorageChange(parsedState);
                }).catch(e => console.error(e));
            }
        }
      
        renderContentsAndDependencies(response, line) {
            
            localStorage.setItem('parsedState', JSON.stringify(response));

            this.renderContents(response);
            this.toggleEmptyClass(response);
            
            this.setCartJs();
        
            const productForm = document.querySelector('product-form');
            if (productForm) productForm.handleErrorMessage();
        
            document.querySelector('#drawer-cart').querySelectorAll('[data-scrollbar]').forEach(scroll => {
                Scrollbar.init(scroll)
            });
        }
      
        setCartJs() {
          fetch(window.Shopify.routes.root + `cart.js`)
            .then((response) => response.json())
            .then((response) => {
                try {
                    let cartCount = $('body').find('.minicart-qty');
                    cartCount.text(response.item_count);
                } catch(e){}
                localStorage.setItem('cartJs', JSON.stringify(response));
                this.cartJs = response;
            }).catch((e) => {
            console.error(e);
          });
        };
      
        getInitCartJs() {
          this.cartJs = this.cartJs || JSON.parse(this.querySelector('[type="application/json"]').textContent);
          return this.cartJs;
        }
      
        onChange(event) {
          if (event.target.name !== 'updates[]') return;
          this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
        }
      
        setStatus(status = 'new', id = null, size = 1, cartToggle = true) {
          let element, elements;
          if (status === 'new') {
            elements = document.querySelector('cart-items').querySelectorAll('.cart-item__success');
            element = elements[0];
            elements && elements.forEach((item, i) => {
              if (i < size) {
                const successTextElement = item.querySelector('.cart-item__success-text');
                if (successTextElement) {
                  successTextElement.innerHTML = window.cartStrings.successfully_added;
                  item.classList.remove('hidden');
                }
              }
            });
          } else if (status === 'edit') {
            element = document.querySelector('cart-items').querySelector('.cart-item__success');
            if (element) {
              const successTextElement = element.querySelector('.cart-item__success-text');
              if (successTextElement) {
                successTextElement.innerHTML = window.cartStrings.successfully_line_item_updated;
                element.classList.remove('hidden');
              }
            }
          } else {
            element = document.getElementById(`Variant-item-success-${id}`);
            if(element) {
              element.querySelector('.cart-item__success-text')
                .innerHTML = window.cartStrings.successfully_updated;
              element.classList.remove('hidden');
            }
          }
          cartToggle && this.cartToggle();
      
          document.querySelector('shipping-calculator')?.close(true);
      
          if(element) {
            new Promise(resolve => {
              setTimeout(() => {
                Scrollbar.get(document.querySelector('#drawer-cart').querySelector('.js-dropdn-content-scroll'))?.scrollTo(0, element.closest('.minicart-prd').offsetTop, 600);
                resolve(true);
              }, 600)
            }).then(response => {
              setTimeout(() => {
                element && element.querySelector('button-animated')?.onesAnimate();
                elements && elements.forEach(item => item.querySelector('button-animated')?.onesAnimate());
              }, 600);
            })
          }
        }
      
        cartToggle() {
          document.querySelector('mini-cart-popup')?.open();
        }
      
        renderContents(parsedState) {
            if (!parsedState.sections) location.reload(true);
      
            let destination;

            try {
                let cartCount = $('body').find('.minicart-qty');
                cartCount.text(parsedState.item_count);
            } catch(e){}
      
            this.getSectionsToRender().forEach((section => {
                if (!(section.render_on_cart_page_only && !this.onCartPage) || section.not_render_on_cart_page_only && !this.onCartPage) {
                    if (section.bubble) {
                        document.querySelectorAll(section.selector)?.forEach(destination => {
                            destination.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
                        });
                    } else {
                        destination = document.getElementById(section.id);
                        if (destination !== null) {
                            if(section.selector) {
                                if (destination.querySelector(section.selector) !== null) {
                                destination = destination.querySelector(section.selector);
                                }
                            } else {
                                section.selector = '#' + section.id;
                            }
                            if (this.isSectionInnerHTML(parsedState.sections[section.section], section.selector)) {
                                destination.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
                                if (section.show_hidden && destination.querySelector('.hidden[data-render-only]')) {
                                destination.querySelector('.hidden[data-render-only]').classList.toggle('hidden');
                                }
                                const elementWithShowOnScroll = destination.querySelector('.show-on-scroll');
                                elementWithShowOnScroll && elementWithShowOnScroll.classList.toggle('is-visible');
                            }
                        }
                    }
                }
            }));
            this.currentLineCount = document.querySelector('cart-items').querySelectorAll('[name="updates[]"]').length;
            document.querySelector('cart-items').classList.toggle('is-empty', this.currentLineCount === 0);
        
            document.querySelectorAll('.cart-table-prd').forEach(item=>{
                moveQuantityNode(item)
            });
        
            setTimeout(() => {
                this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]')).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
                if (this.currentItemCount === 0) {
                    this.createDrawerCarousel()
                }
            });
        }
      
        getSectionsToRender() {
          return [
            {
              id: 'header-cart',
              section: 'header-cart',
              selector: '.js-contents-subtotal',
            },
            {
              id: 'header-cart',
              section: 'header-cart',
              selector: '.js-contents-cart-items'
            },
            {
              id: 'header-cart',
              section: 'header-cart',
              selector: '.js-contents-buttons'
            },
            {
              id: 'cart-live-region-text',
              section: 'cart-live-region-text',
              selector: '.shopify-section',
            },
            {
              id: 'drawer-cart',
              section: 'header-minicart-sticky',
              selector: '#header-cart'
            }
          ];
        }
      
        clearCart(line, quantity, name) {
            const body = JSON.stringify({
                sections: Array.from(new Set(this.getSectionsToRender().filter(item => Boolean(document.querySelector('#'+item.id))).map((section) => section.section))).filter(element => element !== undefined).slice(0,5),
                sections_url: window.location.pathname
            });
          
            fetch(`${window.Shopify.routes.root}cart/clear.js`, {...fetchConfig(), ...{ body }})
                .then((response) => response.json())
                .then((response) => {
                    let cartCount = $('body').find('.minicart-qty');
                    cartCount.text(response.item_count);
                    let destination = document.getElementById('drawer-cart');
                    let bottom = destination.querySelector('.ps-drawer__bottom');
                    bottom.innerHTML = this.getSectionInnerHTML(response.sections['header-minicart-sticky'], '#header-cart');
                    this.cartClearButton.querySelector('.loading-overlay').classList.add('hidden');
                }).catch((e) => {
                    console.error(e);
                    document.getElementById('cart-errors').textContent = window.cartStrings.error;
            });
        }
      
        createDrawerCarousel() {
            setTimeout(() => {
                document.querySelectorAll('mini-cart-popup').forEach(el => el.createCarousel());
            }, 0);
        }
      
        toggleEmptyClass(response) {
            document.querySelectorAll('cart-items').forEach(item => item.classList.toggle('is-empty', response.item_count === 0));
            response.item_count === 0 && document.querySelector('mini-cart-popup')?.closeChild();
        }
      
      
        updateQuantity(line, quantity, name) {
            quantity && this.enableLoading(line);
        
            const body = JSON.stringify({
                line,
                quantity,
                sections: Array.from(new Set(this.getSectionsToRender().filter(item => Boolean(document.querySelector('#'+item.id))).map((section) => section.section))).filter(element => element !== undefined).slice(0,5),
                sections_url: window.location.pathname
            });
        
            fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
                .then((response) => response.json())
                .then((response) => {
                if (response.errors) {
                    const elementSuccess = document.getElementById(`Variant-item-success-${line}`);
        
                    if (elementSuccess) {
                        elementSuccess.classList.toggle('hidden', true);
                    }
        
                    document.querySelectorAll('.cart-item__error').forEach(el => el.classList.toggle('hidden', true));
        
                    const element = document.getElementById(`Line-item-error-${line}`);
        
                    if (element !== null) {
                        element.classList.toggle('hidden', false);
                        element.querySelector('.cart-item__error-text').innerHTML = response.errors;
                    }
                } else {
                    let cartCount = $('body').find('.minicart-qty');
                    cartCount.text(response.item_count);
                    this.renderContentsAndDependencies(response, line);
                }
        
                const lineItem =  document.getElementById(`CartItem-${line}`);
        
                if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
        
                    this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
                    this.disableLoading();
                })
                .catch((e) => {
                    console.error(e);
                    this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
            
                    const cartErrorElement = document.getElementById('cart-errors');
                    cartErrorElement && (cartErrorElement.textContent = window.cartStrings.error);
                    this.disableLoading();
                });
        }
      
        updateLiveRegions(line, itemCount) {
            if (this.currentItemCount === itemCount) {
                const element = document.getElementById(`Line-item-error-${line}`);
                if (element !== null) {
                    element.classList.toggle('hidden', false);
                    element.querySelector('.cart-item__error-text')
                        .innerHTML = window.cartStrings.quantityError.replace(
                        '[quantity]',
                        document.getElementById(`Quantity-${line}`).value
                        );
                }
            }
        
            this.currentItemCount = itemCount;
            this.lineItemStatusElement.setAttribute('aria-hidden', true);
        
            const cartStatus = document.getElementById('cart-live-region-text');
            cartStatus.setAttribute('aria-hidden', false);
        
            setTimeout(() => {
                cartStatus.setAttribute('aria-hidden', true);
            }, 1000);
        }
      
        isSectionInnerHTML(html, selector) {
          return new DOMParser().parseFromString(html, 'text/html').querySelector(selector) ?? false;
        }
      
        getSectionInnerHTML(html, selector) {
          return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
        }
      
        enableLoading(line) {
            document.getElementById('main-cart-items')?.classList.add('cart__items--disabled');
            document.getElementById('header-cart')?.classList.add('cart__items--disabled');
            this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
            document.activeElement.blur();
            this.lineItemStatusElement.setAttribute('aria-hidden', false);
        }
      
        disableLoading() {
            document.getElementById('main-cart-items')?.classList.remove('cart__items--disabled');
            document.getElementById('header-cart')?.classList.remove('cart__items--disabled');
        }
    }
      
    customElements.define('cart-items', CartItems);

    customElements.define('product-form', class ProductForm extends HTMLElement {
        constructor() {
          super();
    
          this.productCard = this.closest('product-card');
          this.cartItems = document.querySelector('cart-items');
          this.form = this.querySelector('form') || this.querySelector('[data-form]') || this;
          this.multiple = 'multiple' in this.dataset;
          this.multipleForms = 'multipleForms' in this.dataset;
          this.edit = 'edit' in this.dataset;
          this.scrollElement = this.form?.closest('.js-dropdn-content-scroll');
    
          if (this.multipleForms) {
            this.querySelector('[data-submit-multiple-forms]').addEventListener('click', this.onSubmitHandler.bind(this))
          } else {
            this.form?.addEventListener('submit', this.onSubmitHandler.bind(this));
          }
    
          this.querySelector('[data-errorclose]')?.addEventListener('click', this.onClosePopupError.bind(this));
    
          this.setCheckboxEvents();
    
          if (this.edit) {
            this.form.addEventListener('change', this.onFormChangeHandler.bind(this));
            this.form.addEventListener('input', this.onFormChangeHandler.bind(this));
          }
    
          !this.multipleForms && (this.backupFormData = new FormData(this.form));
    
          if (this.closest('cart-form-element') || this.closest('wishlist-items') && this.closest('.minicart-prd')) {
            moveQuantityNode(this);
    
            window.addEventListener('resize', debounce(() => {
              moveQuantityNode(this)
            }, 300))
          }
        }
    
        setCheckboxEvents() {
          if (this.multiple) {
            this.querySelectorAll('[type=checkbox]').forEach(item => item.addEventListener('change', this.onCheckboxCheck.bind(this)));
          }
        }
    
        afterRenderEvents(e) {
          this.setCheckboxEvents();
          this.onCheckboxCheck(e);
        }
    
        onFormChangeHandler() {
          this.querySelector('minicart-line-item[data-has-edit-action]').onFormChangeHandler();
        }
    
        onCheckboxCheck(e) {
          const toggleName = 'toggle_select';
          const toggleSelector = `[name=${toggleName}]`;
          const toggleElement = this.querySelector(toggleSelector);
          const checkboxElements = this.querySelectorAll('[type=checkbox]');
          const updateButton = () => {
            const checkedSize = Array.from(checkboxElements).filter(item => item.name !== toggleName && item.checked).length;
            const checkboxesSize = Array.from(checkboxElements).filter(item => item.name !== toggleName).length;
            const buttonElement = this.querySelector('[type=submit]');
            const buttonTextElement = buttonElement.querySelector('span');
            buttonTextElement.innerHTML = checkedSize ? `${window.variantStrings.addSelectedToCart}`.replace('[count]', String(checkedSize)).replace('[products]', checkedSize === 1 ? window.themeStrings.productCountOne : window.themeStrings.productCountOther) : checkboxesSize === 1 ? window.variantStrings.addToCart : window.variantStrings.addSelectAll;
            buttonElement.dataset.selectAll = String(!checkedSize);
          };
          const toggleCheck = () => {
            if (e && e.target.name === toggleName) {
              checkboxElements.forEach(item => item.checked = e.target.checked);
            } else {
              if (e && e.target.checked === false) {
                toggleElement.checked = false
              } else {
                if (Array.from(checkboxElements).every(item => {
                  if (item.name !== toggleName) {
                    return item.checked === true
                  }
                  return true
                })) {
                  toggleElement.checked = true;
                }
              }
            }
          };
          const toggleSelectAllElement = () => {
            toggleElement.labels.forEach(item => item.textContent = item.dataset.textWhenChecked);
          };
    
          toggleCheck();
          updateButton();
        }
    
        selectAll() {
          const checkboxElements = this.querySelectorAll('[type=checkbox]');
          checkboxElements.forEach(item => item.checked = true);
        }
    
        onClosePopupError() {
          this.querySelector('.product-form__error-message-wrapper').hidden = true;
        }
    
        onSubmitHandler(evt) {
          evt && evt.preventDefault();
          let submitButton;
    
          if (this.multipleForms) {
            submitButton = this.querySelector('[data-submit-multiple-forms]');
          } else {
            submitButton = this.querySelector('[type="submit"]') || this.querySelector('[data-action="add"]');
          }
          if (submitButton.classList.contains('loading-process')) return;
    
          if (this.multiple && 'selectAll' in submitButton.dataset && submitButton.dataset.selectAll === 'true') {
            this.selectAll();
          }
    
          this.productCard?.disableHover();
    
          this.handleErrorMessage();
    
          submitButton.setAttribute('aria-disabled', true);
          submitButton.classList.add('loading-process');
          this.form.classList.add('loading-process');
          submitButton.querySelector('.loading-overlay__spinner').classList.remove('hidden');
    
          let config = fetchConfig('javascript');
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          delete config.headers['Content-Type'];
          let formData;
    
          if (!this.multipleForms) {
            formData = new FormData(this.form);
          }
    
    
    
          const sections = Array.from(new Set(this.cartItems.getSectionsToRender().filter(item => Boolean(document.querySelector('#' + item.id))).map(section => section.section))).filter(element => element !== undefined).slice(0, 5);
          const sections_url = window.location.pathname;
    
          let cartItemsCountOld = document.querySelector('cart-items').querySelectorAll('.minicart-prd').length;
    
          const getConnected = async () => {
            if (this.edit) {
              let actions = {
                add: {
                  url: routes.cart_add_url,
                  config: function () {
                    formData.append('sections', sections);
                    formData.append('sections_url', sections_url);
                    config.body = formData;
                    return config;
                  }
                },
                remove: {
                  url: routes.cart_change_url,
                  config:
                    function () {
                      const formDataRemove = new FormData(this.form);
                      let configRemove = Object.assign({}, config);
                      configRemove.body = formDataRemove;
                      configRemove.body.delete('selling_plan', this.dataset.line);
                      configRemove.body.delete('id', this.dataset.line);
                      configRemove.body.append('line', this.dataset.line);
                      configRemove.body.set('quantity', "0");
                      return configRemove;
                    }
                }
              };
    
              return fetch(actions.remove.url, (actions.remove.config.bind(this))())
                .then(response => response.json())
                .then(response => {
                  if (response.status) {
                    return;
                  }
                  return fetch(actions.add.url, (actions.add.config.bind(this))())
                    .then(response => response.json())
                })
            } else {
              if (this.multiple) {
                let body = JSON.stringify({ 'items': getItemsFromFormData(), ...{ sections }, ...{ sections_url } });
                config = { ...fetchConfig('javascript'), ...{ body } };
    
              } else if (this.multipleForms) {
                let items = [], item, formData;
    
                this.querySelectorAll('form[data-available="true"]').forEach(item => {
                  formData = new FormData(item);
                  item = { id: formData.get('id'), quantity: formData.get('quantity') };
                  formData.get('selling_plan') && (item.selling_plan = formData.get('selling_plan'));
                  items.push(item)
                });
    
                let body = JSON.stringify({ items, ...{ sections }, ...{ sections_url } });
                config = { ...fetchConfig('javascript'), ...{ body } };
    
              } else {
                formData.append('sections', sections);
                formData.append('sections_url', sections_url);
                config.body = formData;
              }
              const response = await fetch(routes.cart_add_url, config);
              return await response.json();
            }
          };
    
          getConnected()
            .then((response) => {
                if (response.status) {
                    this.handleErrorMessage(response.description);
                    if (this.edit) {
                        this.backupFormData.append('sections', sections);
                        this.backupFormData.append('sections_url', sections_url);
                        config.body = this.backupFormData;
                        fetch(routes.cart_add_url, config);
                    }
                    return;
                }
                
                this.cartItems.renderContents(response);
                this.cartItems.toggleEmptyClass(response);
        
                this.setParsedState(response);
                this.cartItems.setCartJs();

                document.querySelector('#drawer-cart').querySelectorAll('[data-scrollbar]').forEach(scroll => {
                    Scrollbar.init(scroll)
                });

                // Open mini cart
                $('#drawer-cart').addClass('active');
                $('body').find('.ps-site-overlay').addClass('active');

    
            }).catch((e) => {
              console.error(e);
            })
            .finally(() => {
              submitButton.classList.remove('loading-process');
              this.form.classList.remove('loading-process');
              submitButton.removeAttribute('aria-disabled');
              submitButton.querySelector('.loading-overlay__spinner').classList.add('hidden');
            });
    
          function isCartOpened() {
            return document.querySelector('.ps-drawer-cart').classList.contains('is-opened');
          }
    
          function statusDrawer(response, edit = false) {
            let cartItemsCountNew = document.querySelector('cart-items').querySelectorAll('.minicart-prd').length;
            if (edit) {
              this.cartItems.setStatus('edit', null, 1, !isCartOpened());
            } else {
              if ((cartItemsCountNew > cartItemsCountOld)) {
                const args = response.items ? ['new', null, response.items.length, !isCartOpened()] : '';
                this.cartItems.setStatus(...args);
              } else {
                const variant = response;
                fetch(window.Shopify.routes.root + `cart.js`)
                  .then((response) => response.json())
                  .then((response) => {
                    if (response.items) {
                      let cartLine;
                      function checkPlans(variant, item) {
                        if ('selling_plan_allocation' in variant && 'selling_plan_allocation' in item) {
                          return Object.entries(variant.selling_plan_allocation).toString() === Object.entries(item.selling_plan_allocation).toString();
                        } else if (!('selling_plan_allocation' in variant || 'selling_plan_allocation' in item)) {
                          return true
                        }
                        return false;
                      }
    
                      cartLine = response.items.findIndex(item => {
                        return item.id === variant.variant_id &&
                          Object.entries(variant.properties).toString() === Object.entries(item.properties).toString() &&
                          checkPlans(variant, item)
                      }
                      );
                      this.cartItems.setStatus('updated', cartLine);
                    }
                  }).catch((e) => {
                    console.error(e);
                  });
              }
            }
            return true;
          }
    
          function getItemsFromFormData() {
            const formDataArray = Array.from(formData);
            let items = [];
            let i = 1;
            for (let pair of formData.entries()) {
              pair[0] === 'id' && formDataArray.some(item => item[0] === pair[1]) && (
                formDataArray[i][0] === 'selling_plan' && items.push({
                  "id": parseInt(pair[1]),
                  "selling_plan": parseInt(formDataArray[i][1]),
                  "quantity": parseInt(formDataArray[i + 1][1])
                }) || items.push({
                  "id": parseInt(pair[1]),
                  "quantity": parseInt(formDataArray[i][1])
                })
              );
              i++;
            }
            return items;
          }
        }
    
        setParsedState(response) {
          localStorage.setItem('parsedState', JSON.stringify(response));
        }
    
        handleErrorMessage(errorMessage = false) {
          try {
            if (this.multipleForms) {
              this.errorMessageWrapper = this.querySelector('[data-product-form-error-message-wrapper]');
            } else {
              this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper') || this.closest('[data-section-render]').querySelector('.product-form__error-message-wrapper');
            }
            this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
            this.multipleForms && this.querySelectorAll('.product-form__error-message-wrapper').forEach(item => item.toggleAttribute('hidden', true));
            this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
            if (errorMessage) {
              if (this.productCard) {
                new Promise(resolve => {
                  if (!this.productCard.matches(':hover')) {
                    this.productCard.onProductHover();
                  }
                  resolve();
                }).then(() => {
                  this.errorMessage.textContent = errorMessage;
                  this.productCard.enableHover();
                })
              } else {
                this.errorMessage.textContent = errorMessage;
              }
            }
          } catch (error) {
            console.log("product-form handleErrorMessage", error);
          }
        }
    });


    class MinicartLineItem extends HTMLElement {
        constructor() {
            super();
        
            this.querySelectorAll('[data-action]').forEach((item) => {
                item.addEventListener('click', this.onActionCLick.bind(this))
            });
        
            this.elementAdd = this.querySelector('[data-action="add"]');
            this.elementForm = this.closest('product-form');
            this.scrollElement = this.elementForm.closest('.js-dropdn-content-scroll');
        }
    
        onActionCLick(e) {
            this.target = e.currentTarget;
            const {action} = this.target.dataset;
        
            this[action](this.target);
        
            if (action !== 'add') {
                e.preventDefault();
            }
        }
    
        close(hard = false) {
            this.toggleCurrentForm('edit', hard);
            this.querySelector('[data-action="remove"]')?.classList.remove('hidden');
            this.querySelector('[data-action="edit"]')?.classList.remove('hidden');
            !this.elementAdd?.classList.contains('hidden') && this.elementAdd?.classList.add('hidden','temporary-hidden');
        
            this.elementForm.querySelector('[data-line-item-preview]')?.classList.remove('hidden');
            this.elementForm.querySelector('[data-line-item-preview-edit]')?.classList.add('hidden');
        
            const isMobile = window.matchMedia('(max-width:991px)').matches;
        
            if (isMobile) {
                this.elementForm.querySelectorAll('.minicart-prd-info-bottom').forEach(item => item.classList.remove('hidden'));
            }
        
            Scrollbar.init(this.scrollElement);
            this.closeAllWishlistForms();
        }
    
        edit() {
            this.closeOthers();
            this.closeAllWishlistForms();
            this.hideStatus();
            this.toggleCurrentForm('close');
            this.querySelector('[data-action="remove"]')?.classList.add('hidden');
            this.elementAdd.classList.toggle('hidden', !(this.elementAdd.classList.contains('temporary-hidden') && this.elementAdd.classList.contains('hidden')));
        
            this.elementForm.querySelector('[data-line-item-preview]')?.classList.add('hidden');
            this.elementForm.querySelector('[data-line-item-preview-edit]')?.classList.remove('hidden');
        
            Scrollbar.init(this.scrollElement).scrollIntoView(this.elementForm.closest('.minicart-prd'), {alignToTop: true, offsetTop: 15});
        }
    
        add() {
        
        }
    
        remove() {
            this.closeOthers({minicartLineItem: false});
        
            if (document.querySelector('body').classList.contains('wishlist-on') && 'removeInterrupt' in this.target.dataset && typeof wishlist !== 'undefined' && !(wishlist.has(null, this.target) > -1)) {
                this.closeAllWishlistForms();
                this.querySelector('[data-action="close"]')?.classList.remove('hidden');
                this.querySelector('[data-action="edit"]')?.classList.add('hidden');
                this.querySelector('[data-action="remove"]')?.classList.add('hidden');
                this.elementForm.querySelector('[data-remove-interrupt="form"]').classList.remove('hidden');
                this.elementForm.querySelector('[data-remove-interrupt="form-closure"]').classList.add('hidden');
                this.hideStatus();
        
                const isMobile = window.matchMedia('(max-width:991px)').matches;
        
                if (isMobile) {
                this.elementForm.querySelectorAll('.minicart-prd-info-bottom').forEach(item => item.classList.add('hidden'));
                }
        
            } else this.removeProcess();
        }
    
        closeAllWishlistForms() {
            const wrapper = this.closest('cart-items');
        
            wrapper.querySelectorAll('[data-remove-interrupt="form"]').forEach(item => item.classList.add('hidden'));
            wrapper.querySelectorAll('[data-remove-interrupt="form-closure"]').forEach(item => item.classList.remove('hidden'));
        
            wrapper.querySelectorAll('minicart-line-item').forEach(item => {
                item.querySelector('[data-action="close"]')?.classList.add('hidden');
                item.querySelector('[data-action="edit"]')?.classList.remove('hidden');
                item.querySelector('[data-action="remove"]')?.classList.remove('hidden');
                !item.elementAdd?.classList.contains('hidden') && item.elementAdd?.classList.add('hidden','temporary-hidden');
            });
        }
    
        removeProcess() {
            this.target.querySelector('.loading-overlay__spinner').classList.remove('hidden');
            this.target.classList.remove('btn--animated-shakeY');
            this.closest('cart-items').updateQuantity(this.target.dataset.index, 0);
        }
    
        addToWishlistAndRemove() {
            wishlist.add(null, this.target);
            wishlist.renderComponents();
            this.removeProcess()
        }
    
        hideStatus() {
            this.elementForm.querySelector('.cart-item__success').classList.add('hidden');
            this.elementForm.querySelector('.cart-item__error').classList.add('hidden');
        }
    
        toggleCurrentForm(action, hard = false) {
            if (hard) {
                this.querySelector('[data-action="close"]')?.classList.add('hidden');
                this.querySelector('[data-action="edit"]')?.classList.remove('hidden');
                this.elementForm.querySelector('form').classList.add('hidden');
                this.elementForm.querySelector('.header-cart-line-item-body').classList.remove('hidden');
                return;
            }
        
            this.target.classList.toggle('hidden');
            this.querySelector('[data-action="'+action+'"]').classList.toggle('hidden');
            this.elementForm.querySelector('form').classList.toggle('hidden');
            this.elementForm.querySelector('.header-cart-line-item-body').classList.toggle('hidden');
        }
    
        onFormChangeHandler() {
            this.querySelector('[data-action="add"]').classList.remove('hidden');
        }
    
        closeOthers(dismiss = null) {
            const wrapperElement = this.elementForm.closest('.js-contents-cart-items');
        
            wrapperElement.querySelectorAll('form').forEach(item => {
                item.classList.add('hidden');
            });
        
            wrapperElement.querySelectorAll('.header-cart-line-item-body').forEach(item => {
                item.classList.remove('hidden');
            });
        
            wrapperElement.querySelectorAll('minicart-line-item').forEach(item => {
                if (dismiss && dismiss.minicartLineItem === false) return;
                item.querySelector('[data-action="close"]')?.classList.add('hidden');
                item.querySelector('[data-action="edit"]')?.classList.remove('hidden');
                item.querySelector('[data-action="remove"]')?.classList.remove('hidden');
                !item.elementAdd?.classList.contains('hidden') && item.elementAdd?.classList.add('hidden','temporary-hidden');
            });
        }
    }
    
    customElements.define('minicart-line-item', MinicartLineItem);  


    class VariantSelects extends HTMLElement {
        constructor() {
            super();
            this.cachedResults = {};
            this.catalogMode = this.dataset.catalogMode;
            this.groupTag = 'select';
            this.groupOptionTag = 'option';
            this.sectionLayout = this.dataset.sectionLayout;
            this.sectionId = this.dataset.sectionId;
            this.section = this.closest('[data-section-render]');
            this.requestPageType = this.dataset.requestPageType;
            this.addEventListener('change', this.onVariantChange);
            this.initVariant = this.getVariantData().find(variant => variant.id === parseInt(this.dataset.initVariant));
            this.currentVariant = this.getVariantData().find(variant => variant.id === parseInt(this.dataset.initVariant));
            if (this.tagName !== 'VARIANT-SELECT') this.disableUnavailable();
        }
    
        onVariantChange() {
            this.renderSection();
            this.syncOptions();
        }
    
        renderSection() {
            this.updateOptions();
            this.updateMasterId();
            this.disableUnavailable();
            this.toggleAddButton(true, '', false);
            // this.updatePickupAvailability();
            this.removeErrorMessage();
            if (!this.currentVariant) {
                this.toggleAddButton(true, '', true);
            } else {
                // this.updateMedia();
                this.updateURL();
                this.updateVariantInput();
                this.updateOptionTitles();
                this.renderProductInfo();
                this.updateShareUrl();
            }
        }
    
        disableUnavailable() {
            let groupTag = this.groupTag;
            let groupOptionTag = this.groupOptionTag;
            let groupsSelector = `${groupTag}:not(.option-first)`;
            let groups = Array.from(this.querySelectorAll(groupsSelector));
            let optionsAll = this.querySelectorAll(`${groupsSelector} ${groupOptionTag}`);
            if (groups.length) {
                if (groupOptionTag === 'input') optionsAll.forEach(el => el.parentElement.classList.add('disabled')); else optionsAll.forEach(el => el.disabled = true);
                if (!this.currentVariant) {
                    let groupLast = groups[groups.length - 1];
                    if (!this.currentVariant) {
                        const optionChecked = groupLast.querySelector(groupOptionTag + ':checked');
                        if (groupOptionTag === 'input') optionChecked.checked = false; else optionChecked.selected = false;
                    }
                    groupLast.querySelectorAll(groupOptionTag).forEach(input => {
                        if (!this.currentVariant) {
                            if (groupOptionTag === 'input') {
                                input.checked = true;
                                this.setGroupSwatchActive(input);
                            } else {
                                input.selected = true;
                            }
                            this.updateOptions();
                            this.updateMasterId();
                        }
                    });
                    if (!this.currentVariant) {
                        let option1 = this.querySelector(`${groupTag} ${groupOptionTag}:checked`).value;
                        this.currentVariant = this.getVariantData().find(variant => variant.option1 === option1);
                        groups.forEach((group, key) => {
                            let value = this.currentVariant.options[key + 1];
                            const optionChecked = group.querySelector(groupOptionTag + ':checked');
                            const optionToCheck = group.querySelector(`[value="${value}"]`);
                            if (groupOptionTag === 'input') {
                                optionChecked.checked = false;
                                optionToCheck.checked = true;
                            } else {
                                optionChecked.selected = false;
                                optionToCheck.selected = true;
                            }
                        });
                        this.updateOptions();
                    }
                }
                for (let i = 0; i < (groups.length); i++) {
                    let variants = this.getVariantData().filter(variant => {
                        if (i === 0) return variant.options[i] === this.currentVariant.options[i];
                        if (i === 1) return variant.options[i - 1] === this.currentVariant.options[i - 1] && variant.options[i] === this.currentVariant.options[i];
                    });
                    variants.forEach(variant => {
                        let item = Array.from(optionsAll).find(option => {
                        return option.value === variant.options[i + 1]
                        });
                        if (groupOptionTag === 'input') item.parentElement.classList.remove('disabled'); else item.disabled = false;
                    })
                }
            }
        }
    
        onVariantMouseenter(el) {
            if (this.currentVariant.options.length > 2) return;
        
            let groupTag = this.groupTag;
            let groupOptionTag = this.groupOptionTag;
            let lvls = this.dataset.lvls;
            let lvl = parseInt(el.closest(groupTag).dataset.lvl);
            if (lvl < (lvls - 1)) {
                let optionHover = el.querySelector('input').value;
                const option1 = this.querySelectorAll(groupTag)[0].querySelector(groupOptionTag + ':checked')?.value;
                let groupToRender = Array.from(this.querySelectorAll(groupTag))[lvl + 1];
                let optionsToRender = groupToRender.querySelectorAll(`${groupOptionTag}`);
                optionsToRender.forEach(el => el.parentElement.classList.add('disabled'));
                let variants = this.getVariantData().filter(variant => {
                    if (lvl === 0) return variant.options[0] === optionHover;
                    if (lvl === 1) return variant.options[0] === option1 && variant.options[1] === optionHover;
                });
                variants.forEach(variant => {
                    let item = Array.from(optionsToRender).find(input => input.value === variant.options[lvl + 1]);
                    item.parentElement.classList.remove('disabled');
                })
            }
        }
    
        onVariantMouseout() {
            this.disableUnavailable();
        }
    
        updateOptionTitles() {
            this.querySelectorAll('[data-option-value]').forEach((el, key) => {
                el.textContent = this.currentVariant.options[key]
            })
        }
    
        syncOptions() {
            const sectionsToSync = ['product-sticky', 'product'];
            if (sectionsToSync.includes(this.sectionLayout)) {
                const destination = this.sectionLayout === sectionsToSync[0] ? sectionsToSync[1] : sectionsToSync[0];
                const variantRadios = document.querySelector('variant-radios[data-section-layout="' + destination + '"]');
                const variantSelects = document.querySelector('variant-selects[data-section-layout="' + destination + '"]');
                if (variantRadios || variantSelects) {
                    const variantPicker = variantRadios ? variantRadios : variantSelects;
                    const fieldsets = variantPicker.querySelectorAll(variantRadios ? 'fieldset' : 'select');
                    if (fieldsets) {
                        fieldsets.forEach((group, index) => {
                            group.querySelectorAll(variantRadios ? 'input' : 'option').forEach(el => {
                                if (variantRadios) el.checked = false; else el.selected = false;
                            });
                            group.querySelectorAll(variantRadios ? 'input' : 'option').forEach((el, index2) => {
                                if (el.value === this.options[index]) {
                                    if (variantRadios) {
                                        this.setGroupSwatchActive(el);
                                        el.checked = true
                                    } else {
                                        el.selected = true
                                    }
                
                                }
                            });
                            group.value = this.options[index];
                        })
                        variantPicker.renderSection();
                    }
                }
            }
        }
    
        setGroupSwatchActive(el) {
            const group = el.closest(this.groupTag) ?? el.closest("fieldset");
        
            group.querySelectorAll('label').forEach(el => {
                el.classList.remove('swatch-active');
            });
        
            el.parentElement.classList.add('swatch-active');
        }
    
        updateOptions() {
            this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
        }
    
        updateMasterId() {
            this.currentVariant = this.getVariantData().find((variant) => {
                return !variant.options.map((option, index) => {
                    return this.options[index] === option;
                }).includes(false);
            });
        }
    
        updateURL() {
            if (this.sectionLayout === 'product') {
                if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
                window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
            } else {
                this.section.querySelectorAll(`[data-url]`).forEach(el => {
                el.setAttribute('href', `${this.dataset.url}?variant=${this.currentVariant.id}`);
                });
            }
        }
    
        updateShareUrl() {
            if (this.sectionLayout !== 'product') return;
            const shareButton = document.getElementById(`Share-${this.dataset.section}`);
            if (!shareButton || !shareButton.updateUrl) return;
                shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
        }
        
        updateVariantInput() {
            let formElement = this.section.querySelectorAll(`form`);
            formElement = formElement.length ? formElement : this.section.querySelectorAll(`[data-form]`);
            formElement.forEach((productForm) => {
                const input = productForm.querySelector('input[name="id"]');
                if (input) {
                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }
    
        updatePickupAvailability() {
            if (this.sectionLayout !== 'product') return;
        
            const pickUpAvailability = document.querySelector('pickup-availability');
            if (!pickUpAvailability) return;
        
            if (this.currentVariant && this.currentVariant.available) {
                pickUpAvailability.fetchAvailability(this.currentVariant.id);
            } else {
                pickUpAvailability.removeAttribute('available');
                pickUpAvailability.innerHTML = '';
            }
        }
    
        removeErrorMessage() {
            if (!this.section) return;
            const productForm = this.section.querySelector('[data-form]') || this.closest('product-form');
            if (productForm && productForm.getAttribute('id') !== 'product-form-installment') productForm.handleErrorMessage();
        }
    
        renderProductInfo() {
            let section = this.sectionId;
            if (this.sectionLayout === 'product') {
                section = this.dataset.sectionId
            }
            /* const url = this.requestPageType === 'search' ? this.dataset.url + '&amp;' : this.dataset.url+'?'; */
            const url = this.dataset.url;
            const queryKey = section + '-' + this.sectionLayout + '-' + this.currentVariant.id;
            
            if (this.cachedResults[queryKey]) {
                this.productRenderElements(this.cachedResults[queryKey], section);
                return;
            }
            fetch(`${url}?variant=${this.currentVariant.id}&section_id=${section}`)
                .then((response) => response.text())
                .then((responseText) => {
                    const html = new DOMParser().parseFromString(responseText, 'text/html');
                    this.cachedResults[queryKey] = html;
                    this.productRenderElements(html, section);
                });
        }
    
        productRenderElements(html) {
            this.section.querySelectorAll('[data-render]').forEach(destination => {
                if (this.closest('products-card-compact') || !destination.closest('products-card-compact')) { //disabling fbt rendering
                    const source = html.querySelector(`[data-render=${destination.dataset.render}]`);
                    if (source) destination.innerHTML = source.innerHTML;
                }
            });
            const price = this.section.querySelector(`[data-render=price]`);
            if (price) price.classList.remove('hidden');
        
            this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
            this.closest('product-form') && 'afterRenderEvents' in this.closest('product-form').dataset && this.closest('product-form')?.afterRenderEvents();
        }
    
        toggleAddButton(disable = true, text, modifyClass = true) {
            const productForm = this.section.querySelector('[data-form]');

            if (!productForm) return;

            let addButton = productForm.querySelector('[name="add"]');
            let addButtonText = addButton?.querySelector('span');
            let preOrder = productForm.querySelector('[data-form-preorder]');
            if (!addButton) return;
        
            if (disable) {
                addButton.setAttribute('disabled', 'disabled');
                if (text) addButtonText.textContent = text;
            } else {
                addButton.removeAttribute('disabled');
                const preOrderCondition = this.currentVariant.inventory_management && this.currentVariant.inventory_quantity < 1;
                preOrder.disabled = !preOrderCondition;
                if (this.currentVariant.requires_selling_plan) {
                    addButtonText.textContent = window.variantStrings.addSubscriptionToCart;
                } else {
                    addButtonText.textContent = preOrderCondition ? window.variantStrings.preOrder : window.variantStrings.addToCart;
                }
            }
        
            this.setUnavailable(addButtonText);
        
            if (!modifyClass) return;
        }
    
        setUnavailable(addButtonText) {
            if (!this.currentVariant) {
                addButtonText.textContent = window.variantStrings.unavailable;
            }
        }
    
        getVariantData() {
            this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
            return this.variantData;
        }
    
    }
    
    customElements.define('variant-selects', VariantSelects);

    class FacetFiltersForm extends HTMLElement {
        constructor() {
          super();
      
          this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
          }, 500);
      
          this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
          // this.querySelectorAll('form input[type="number"]').forEach(el => el.addEventListener('focusout', this.debouncedOnSubmit.bind(this)));
          // this.querySelectorAll('form input[type="number"]').forEach(el => el.addEventListener('keypress', this.debouncedOnSubmit.bind(this)));
          document.querySelector('[name=sort_by]')?.addEventListener('change', this.onSubmitHandler);
      
          const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
      
          if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
        }
      
        static getLoader() {
          return document.querySelector("loading-bar");
        }
      
        static disableSidebar() {
          document.querySelector('.facets-container').classList.add('disable-filters')
        }
      
        static enableSidebar() {
          document.querySelectorAll('.facets-container').forEach(item => item.classList.remove('disable-filters'));
        }
      
        static facetsLoaded() {
          return document.querySelector('#filterColumn .filter-col-content')
        }
      
        static async asyncLoadSidebar(url, callback) {
          fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
              const html = new DOMParser().parseFromString(responseText, 'text/html');
              document.querySelector('#filterColumn').innerHTML = html.querySelector('.shopify-section').innerHTML
              FacetFiltersForm.renderElements(html, false);
              callback && callback();
            });
        }
      
        static setListeners() {
          const onHistoryChange = (event) => {
            const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
            if (searchParams === FacetFiltersForm.searchParamsPrev) return;
            FacetFiltersForm.renderPage(searchParams, null, false);
          };
          window.addEventListener('popstate', onHistoryChange);
        }
      
        static toggleActiveFacets(disable = true) {
          document.querySelectorAll('.js-facet-remove').forEach((element) => {
            element.classList.toggle('disabled', disable);
          });
        }
      
        static disableAllFacets() {
          document.querySelectorAll('facet-filters-form .input-wrap').forEach((element) => {
            element.classList.add('is-disable');
            element.querySelectorAll('[data-facet-count]').forEach(item => item.textContent = '(0)');
          });
        }
      
        static enableLoading() {
          document.getElementById('ProductGridContainer').classList.add('loading');
        }
      
        static enableLoading() {
          document.getElementById('ProductGridContainer').classList.remove('loading');
        }
      
        static renderPage(searchParams, event, updateURLHash = true, postAjaxCallback) {
            FacetFiltersForm.searchParamsPrev = searchParams;
            const sections = FacetFiltersForm.getSections();
            
            const countContainerDesktop = document.querySelector('.ProductCountDesktop');
            
            document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
            document.querySelector('[data-facets-sorting]').classList.add('loading');
            
            if (countContainerDesktop){
                countContainerDesktop.classList.add('loading');
                FacetFiltersForm.getLoader().start()
            }
        
            sections.forEach((section) => {
                    const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
                    const filterDataUrl = element => element.url === url;
        
                    FacetFiltersForm.filterData.some(filterDataUrl) ?
                    FacetFiltersForm.renderSectionFromCache(filterDataUrl, event, postAjaxCallback) :
                    FacetFiltersForm.renderSectionFromFetch(url, event, postAjaxCallback);
            });
        
            if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
        }
      
        static renderSectionFromFetch(url, event, postAjaxCallback) {
          fetch(url)
            .then(response => response.text())
            .then((responseText) => {
              if (responseText) {
                const html = responseText;
                FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
                FacetFiltersForm.renderFilters(html, event);
                FacetFiltersForm.renderProductGridContainer(html);
                FacetFiltersForm.renderVendorsFilterOnSearchPage(html);
                FacetFiltersForm.renderElements(html);
                FacetFiltersForm.renderProductCount(html);
                FacetFiltersForm.enableSidebar();
                FacetFiltersForm.getLoader().hide();
                postAjaxCallback && postAjaxCallback();
              } else {
                document.querySelectorAll('.loading-overlay').forEach(item => item.classList.add('hidden'));
                document.querySelectorAll('.loading').forEach(item => item.classList.remove('loading'));
                document.querySelector('.facets-container').classList.remove('disable-filters')
                FacetFiltersForm.getLoader().hide();
              }
            });
        }
      
        static renderSectionFromCache(filterDataUrl, event, postAjaxCallback) {
          const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
          FacetFiltersForm.renderFilters(html, event);
          FacetFiltersForm.renderProductGridContainer(html);
          FacetFiltersForm.renderVendorsFilterOnSearchPage(html);
          FacetFiltersForm.renderElements(html);
          FacetFiltersForm.renderProductCount(html);
          FacetFiltersForm.getLoader().hide();
          postAjaxCallback && postAjaxCallback();
        }
      
        static renderVendorsFilterOnSearchPage(html) {
          const renderedDocument = new DOMParser().parseFromString(html, 'text/html');
          const vendorsFilter = document.querySelector('body.template-search .category-page-description');
      
          if (vendorsFilter) {
            const source = renderedDocument.querySelector('.category-page-description');
      
            source && (vendorsFilter.innerHTML = source.innerHTML);
          }
        }
      
        static renderElements(html, parse = true) {
          let renderedDocument = new DOMParser().parseFromString(html, 'text/html');
      
          if (!parse) {
            renderedDocument = html
          }
          document.querySelectorAll('[data-render-facets]').forEach(destination => {
            const source = renderedDocument.querySelector(`[data-render-facets=${destination.dataset.renderFacets}]`);
            if (source) destination.innerHTML = source.innerHTML;
          });
      
          FacetFiltersForm.enableSidebar();
        }
      
        static renderProductGridContainer(html) {
          const renderedDocument = new DOMParser().parseFromString(html, 'text/html');
      
          document.getElementById('ProductGridContainer').innerHTML = renderedDocument.getElementById('ProductGridContainer').innerHTML;
          const filterToggleEl = document.querySelector('save-attr[data-filter-toggle]');
          const filterToggleElOld = renderedDocument.querySelector('save-attr[data-filter-toggle]');
      
          filterToggleEl && filterToggleEl.parentNode.replaceChild(filterToggleElOld, filterToggleEl);
      
          document.querySelector('[name=sort_by]')?.addEventListener('change', function(event){
            event.preventDefault();
              const formData = new FormData(event.target.form ? event.target.form : event.target.closest('form'));
              const searchParams = new URLSearchParams(formData).toString();
              FacetFiltersForm.disableSidebar();
              FacetFiltersForm.renderPage(searchParams, event);
              event.stopImmediatePropagation();
          });
        }
      
        static renderProductCount(html) {
          let countElement = new DOMParser().parseFromString(html, 'text/html').querySelector('.ProductCountDesktop');
          const fasetsSorting = document.querySelector('[data-facets-sorting]');
          if (countElement) {
            const count = countElement.innerHTML;
            const countText = countElement.innerText;
            const containerDesktop = document.querySelectorAll('.ProductCountDesktop');
            if (containerDesktop) {
              containerDesktop.forEach((value, key)=>{
                value.innerHTML = count;
                value.classList.remove('loading');
              })
            }
            const regExpMatchArrayElement = countText.match(/\d+/) && countText.match(/\d+/)[0];
            if (isNaN(parseInt(regExpMatchArrayElement)) || !parseInt(regExpMatchArrayElement)) {
              fasetsSorting.classList.add('hidden');
            } else {
              fasetsSorting.classList.remove('hidden');
            }
          } else {
            fasetsSorting.classList.add('hidden');
          }
        }
      
        static renderFilters(html, event) {
          const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
          const facetDetailsElements = parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter');
          const matchesIndex = (element) => {
            const jsFilter = event ? event.target.closest('.js-filter') : undefined;
            return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
          };
          
          const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);
      
          FacetFiltersForm.renderActiveFacets(parsedHTML);
          FacetFiltersForm.renderAdditionalElements(parsedHTML);
          if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
      
          if (parsedHTML.querySelector('.category-empty')) {
            FacetFiltersForm.disableAllFacets()
          }
      
          const filterPopupElement = document.querySelector('filter-popup');
          filterPopupElement && filterPopupElement.render();
      
          document.querySelector('.active-facets-desktop')?.dispatchEvent(new Event('filter:updated'));
        }
      
        static renderActiveFacets(html) {
          const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];
      
          activeFacetElementSelectors.forEach((selector) => {
            const activeFacetsElement = html.querySelector(selector);
            if (!activeFacetsElement) return;
            /*document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;*/
            document.querySelectorAll(selector).forEach(item => item.innerHTML = activeFacetsElement.innerHTML);
          });
      
          FacetFiltersForm.toggleActiveFacets(false);
        }
      
        static renderAdditionalElements(html) {
          const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];
      
          mobileElementSelectors.forEach((selector) => {
            if (!html.querySelector(selector)) return;
            document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
          });
      
          let isMobile = window.matchMedia('(max-width:991px)').matches;
      
          if (!isMobile) {
            let scrollOffset;
            const scrollCollectionElement = document.querySelector('#ProductGridContainer');
            const delta = document.querySelector('body').classList.contains('template-search') ? 70 : 50;
      
            const vendorsFilter = document.querySelector('body.template-search .category-page-description');
      
            if (vendorsFilter) {
              scrollOffset = getCoords(vendorsFilter);
            } else {
              scrollOffset = getCoords(scrollCollectionElement);
            }
      
            scrollCollectionElement && smoothScrollTo(scrollOffset.top-20, 700);
          }
        }
      
        static renderCounts(source, target) {
          const targetElement = target.querySelector('.facets__selected');
          const sourceElement = source.querySelector('.facets__selected');
      
          if (sourceElement && targetElement) {
            target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
          }
        }
      
        static updateURLHash(searchParams) {
          history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
        }
      
        static getSections() {
          return [
            {
              section: document.getElementById('product-grid').dataset.id,
            }
          ]
        }
      
      
        onSubmitHandler(event) {
          if (event.target.classList.contains('search')) return;
          let value = parseInt(event.target.dataset.value);
          if (event.target.type === 'number' && event.type === 'keypress' && event.key === 'Enter') {
            event.target.addEventListener('focusout', function(event) {
              event.stopPropagation()
            }, true);
          }
      
          if (event.target.type === 'number' && event.type === 'focusout'
            || event.target.type !== 'number' && (event.type === 'input' || event.type === 'change')
            || event.target.type === 'number' && event.type === 'keypress' && event.key === 'Enter') {
      
            event.preventDefault();
            if(value !== parseInt(event.target.value)) {
              const formData = new FormData(event.target.form ? event.target.form : event.target.closest('form'));
              const searchParams = new URLSearchParams(formData).toString();
              FacetFiltersForm.disableSidebar();
              FacetFiltersForm.renderPage(searchParams, event);
              event.stopImmediatePropagation();
            }
          }
        }
      
    }
      
    FacetFiltersForm.filterData = [];
    FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
    FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
    customElements.define('facet-filters-form', FacetFiltersForm);
    FacetFiltersForm.setListeners();

    class FacetSortBy extends HTMLElement {
        constructor() {
            super();
    
            this.querySelector('select').addEventListener('change', this.onChange.bind(this));
        }
    
        onChange(e) {
            const ajax = this.dataset.ajax;
            const currentTarget = e.currentTarget
        
            if (!FacetFiltersForm.facetsLoaded()) {
                FacetFiltersForm.asyncLoadSidebar(ajax, () => {
                    currentTarget && currentTarget.dispatchEvent(new Event('change', { 'bubbles': false }));
                });
            }
        }
    }
    
    customElements.define('facet-sort-by', FacetSortBy);

    saveAttrListener(document);
  
    customElements.define('save-attr', class SaveAttr extends HTMLElement {
        constructor() {
            super();
            saveAttrListener(this);
        }
    });


    class AsyncReload extends HTMLElement {
        constructor() {
            super();
            // AsyncReload.cachedResults = [];
            this.urlUpdate = 'urlUpdate' in this.dataset ? true : false
            this.reloadMode = 'reload' in this.dataset ? this.dataset.reload : 'fullpage'
            this.pageSelector = '#pageContent';
            this.loader = document.querySelector("loading-bar");
            this.addEventListener('click', this.onClickHandler.bind(this));
            }
        
            onClickHandler(e) {
            const target = e.target.tagName === 'A' ? e.target : e.target.closest('a')
        
            if (target) {
                const url = target.href;
        
                if ((url.indexOf("#") === -1)) {
                e.preventDefault();
                target.closest('.swiper-wrapper')?.childNodes.forEach(item => item.querySelector('a').classList.remove('active'));
                target.closest('a').classList.add('active');
                this.loader.start();
                this.getPageHtml(url);
                }
            }
        }
    
        getPageHtml(url) {
            const filterDataUrl = element => element.url === url;
        
            if (AsyncReload.cachedResults.some(filterDataUrl)) {
                const html = AsyncReload.cachedResults.find(filterDataUrl).html;
        
                this.renderCurrentPage(html, url);
        
                if (this.reloadMode !== 'css') return;
            }
        
            fetch(url)
                .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.text();
                })
                .then(html => {
                if (AsyncReload.cachedResults.some(filterDataUrl) && this.reloadMode === 'css') return;
        
                this.renderCurrentPage(html, url);
        
                AsyncReload.cachedResults = [...AsyncReload.cachedResults, { html, url }];
                })
                .catch((error) => {
                console.error(error)
                });
        }
    
        renderElements(html) {
            document.querySelectorAll('[data-async-reload]').forEach(destination => {
                const source = html.querySelector(`[data-async-reload=${destination.dataset.asyncReload}]`);
                if (source) destination.innerHTML = source.innerHTML;
            });
            }
        
            renderCss(html) {
            document.querySelectorAll('[data-async-reload-css]').forEach(destination => {
                const source = html.querySelector(`[data-async-reload-css=${destination.dataset.asyncReloadCss}]`);
                if (source) destination.innerHTML = source.innerHTML;
            });
            }
        
            renderRequiredElements(html) {
            document.querySelectorAll('[data-async-reload-required]').forEach(destination => {
                const source = html.querySelector(`[data-async-reload-required=${destination.dataset.asyncReloadRequired}]`);
                if (source) destination.innerHTML = source.innerHTML;
            });
        
            document.querySelector('demo-panel')?.init()
        }
    
        renderCurrentPage(html, url) {
            let renderedDocument = new DOMParser().parseFromString(html, 'text/html');
        
            if (this.reloadMode === 'fullpage') {
                document.querySelector(this.pageSelector).innerHTML = renderedDocument.querySelector(this.pageSelector).innerHTML;
            } else if (this.reloadMode === 'css') {
                this.renderCss(renderedDocument);
            } else {
                this.renderElements(renderedDocument);
            }
        
            this.renderRequiredElements(renderedDocument);
        
            document.querySelectorAll('filter-popup[data-outer]').forEach(item => item.hasOwnProperty('render') && item.render())
        
            setTimeout(() => {
                document.querySelector(this.pageSelector).querySelector('.show-on-scroll')?.classList.toggle('is-visible');
            }, 0);
    
            const documentTitle = renderedDocument.querySelector('title')?.innerHTML;
            this.updateURLHash(url, documentTitle);
            this.renderOtherSection(url);
            this.loader.hide();
        }
    
        renderOtherSection(url) {
            const querySign = url.includes('?') ? '&' : '?';
            const sectionsFiltered = this.getSectionsToRender().filter(item => document.querySelector('body').classList.contains(`template-${item.template}`));
        
            if (sectionsFiltered) {
                const sectionsFetches = sectionsFiltered.map(item => fetch(`${url}${querySign}section_id=${item.section}`));
        
                sectionsFetches && Promise.all(sectionsFetches)
                .then(responses => Promise.all(responses.map(response => response.text())))
                .then(responses => {
                    this.renderOtherSectionsResults(sectionsFiltered, responses);
                })
            }
        }
    
        renderOtherSectionsResults(sectionsFiltered, responses) {
            sectionsFiltered.forEach((section, index) => {
                document.querySelectorAll(section.selector).forEach(destination => {
                if (this.isSectionInnerHTML(responses[index], section.selector)) {
                    destination.innerHTML = this.getSectionInnerHTML(responses[index], section.selector);
                }
                })
            });
        }
    
        isSectionInnerHTML(html, selector) {
            return new DOMParser().parseFromString(html, 'text/html').querySelector(selector) ?? false;
        }
    
        getSectionInnerHTML(html, selector) {
            return new DOMParser()
                .parseFromString(html, 'text/html')
                .querySelector(selector).innerHTML;
        }
    
        getSectionsToRender() {
            return [
                {
                template: 'collection',
                section: 'header-navigation-mobile-bottom',
                selector: '.hdr-mobile-bottom',
                }
            ];
        }
    
        updateURLHash(url, documentTitle) {
            if (this.urlUpdate) {
                history.pushState({ url }, '', `${url}`);
                if (documentTitle) document.title = documentTitle;
            }
        }
    }
    
    AsyncReload.cachedResults = [];
    
    
    customElements.define('async-reload', AsyncReload);

    function onSaveAttrListener(e) {
        const target = e.currentTarget;
        if (target.dataset.handler) {
            window[target.dataset.handler].call(target);
        }
    
        const { saveAttr } = target.dataset;
    
        if (saveAttr) {
            const body = JSON.stringify({ attributes: JSON.parse(saveAttr) });
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
                .catch(e => console.error(e))
                .finally(() => {
                if ('toggle' in target.dataset) {
                    target.dataset.saveAttr = `{ "${target.dataset.toggle}": ${!JSON.parse(saveAttr)[target.dataset.toggle]} }`
                }
                    FacetFiltersForm.filterData = [];
                    // document.querySelectorAll('async-reload')?.forEach(item => item.cachedResults = []);
                    AsyncReload.cachedResults = [];
                })
        }
    }
    
    function saveAttrListener(context) {
        context.querySelectorAll('[data-save-attr]').forEach((item) => {
            item.addEventListener('click', onSaveAttrListener)
        });
    }

    class ViewMode extends HTMLElement {
        constructor() {
            super();
            this.grid = document.querySelector('[data-product-grid]');
            this.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', this.onButtonClick.bind(this)))
        }
        onButtonClick(e){
            e.preventDefault();
            let target = e.currentTarget;
            if (!target.classList.contains('active')) {
                this.setPerRow(target)
            }
        }
        setSizes(){
            const sizes = [
                0,
                0,
                '(min-width: 1400px) 559px, (min-width: 1200px) 540px, (min-width: 992px) 450px, calc((100vw - 30px - 20px) / 2)',
                '(min-width: 1400px) 362px, (min-width: 1200px) 350px, (min-width: 992px) 289px, (min-width: 768px) 210px, calc((100vw - 30px - 20px) / 2)',
                '(min-width: 1400px) 264px, (min-width: 1200px) 255px, (min-width: 992px) 210px, (min-width: 768px) 150px, calc((100vw - 30px - 20px) / 2)',
                '(min-width: 1400px) 205px, (min-width: 1200px) 198px, (min-width: 992px) 162px, (min-width: 768px) 210px, calc((100vw - 30px - 20px) / 2)'
            ]
            const currentView = this.getCurrentBreakpointActive();
            document.querySelector('[data-product-grid]').querySelectorAll('product-card .prd-image img').forEach(item => item.sizes = sizes[parseInt(currentView.dataset.view.split('_')[currentView.dataset.view.split('_').length-1])]);
        }
        setPerRow(el){
            if (el.closest('.view-mode--xxl')) {
                this.querySelectorAll('.view-mode--xxl [data-view]').forEach(el => el.classList.remove('active'))
                removeClassBySuffix(this.grid,'_xxl')
            } else if (el.closest('.view-mode--xl')) {
                this.querySelectorAll('.view-mode--xl [data-view]').forEach(el => el.classList.remove('active'))

                if(el.dataset.view === 'list'){
                    this.grid.classList.remove('ps-grid');
                    this.grid.classList.add('ps-list');
                }else{
                    this.grid.classList.remove('ps-list');
                    this.grid.classList.add('ps-grid');
                }

                this.grid.querySelectorAll('.ps-project').forEach(element => {
                    if(el.dataset.view === 'list'){
                        removeClassBySuffix(element,'--grid');
                        element.classList.add('ps-project--list');
                    }else{
                        removeClassBySuffix(element,'--list');
                        element.classList.add('ps-project--grid');
                    }
                });
            } else if (el.closest('.view-mode--md')) {
                this.querySelectorAll('.view-mode--md [data-view]').forEach(el => el.classList.remove('active'))
                removeClassBySuffix(this.grid,'_md')
            } else {
                this.querySelectorAll('.view-mode--sm [data-view]').forEach(el => el.classList.remove('active'))
                removeClassBySuffix(this.grid,'_sm')
            }
            el.classList.add('active');
            this.grid.classList.add(el.dataset.view);
            this.grid.querySelectorAll('product-card').forEach(element => {
                element.productWidth();
                if (el.dataset.view.includes('list')) element.loadAjax()
            });
            this.setSizes();
        }
        setGridPerRow(count, mode){
            let activeClass = `grid_${count}_${mode}`,
                activeEl = this.querySelector(`[data-view="${activeClass}"]`);
            removeClassBySuffix(this.grid,`_${mode}`);
            this.grid.classList.add(activeClass);
            if (activeEl) {
                this.querySelectorAll(`.view-mode--${mode} [data-view]`).forEach(el => el.classList.remove('active'));
                activeEl.classList.add('active')
            }
            this.grid.querySelectorAll('product-card').forEach(element => {
                element.productWidth();
                if (count == 'list') element.loadAjax()
            });
            this.setSizes()
        }
        getCurrentBreakpoint(){
            let current;
            this.querySelectorAll('.view-mode').forEach(el => {
                let display = el.currentStyle ? el.currentStyle.display : getComputedStyle(el, null).display;
                (display == 'flex' || display == 'block') && el.querySelectorAll('.active').length > 0 && (current = el)
            })
            return current
        }
        getCurrentBreakpointActive(){
            return this.getCurrentBreakpoint() ? this.getCurrentBreakpoint().querySelector('.active') : false;
        }
        getCurrentBreakpointActiveCount(){
            return this.getCurrentBreakpointActive().dataset.view.split('_')[1]
        }
        getCurrentBreakpointMode(){
            let modeClass = this.getCurrentBreakpoint().classList,
                mode;
            for (let el of modeClass) {
                if(el.includes('view-mode--')) {
                    mode = el.split('--')[1]
                }
            }
            return mode;
        }
        setGridAligment(position){
            if(position == 'center'){
                this.grid.classList.add('justify-content-center')
            } else this.grid.classList.remove('justify-content-center')
        }
    }

    class FilterBlock extends HTMLElement {
        constructor() {
            super();
            this.querySelector('[data-sort]') && this.sortOptions();
            this.checkBoxes();
            this.categoriesMenu()
        }
        categoriesMenu() {
            const menu = this.querySelector('.categories-menu');
    
            if (menu) {
                menu.querySelectorAll('li ul').forEach(el => {
                    el.style.display = 'none'
                })
                //const titleHeight = menu.closest('filter-block').querySelector('.sidebar-block_title').offsetHeight;
                //menu.closest('.sidebar-block_content-scroll')?.style.setProperty('--max-height', window.innerHeight - getCoords(document.querySelector('.js-filter-desktop-wrap')).top - titleHeight - 40 + 'px');
                this.setLabelWidth(menu);
                menu.querySelectorAll('.icon-arrow-next').forEach(el => {
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        const parent =  el.closest('li'),
                              dropdown = parent.querySelector('ul');
                        if (parent) {
                            if (!parent.classList.contains('open')) {
                                parent.classList.add('open');
                                jq(dropdown).slideDown(200);
                            } else {
                                parent.classList.remove('open');
                                jq(dropdown).slideUp(200, () => {
                                    setTimeout(() => {
                                        parent.querySelectorAll('li.open ul').forEach(dropdown => dropdown.style.display = 'none');
                                        parent.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
                                    }, 300)
                                });
                            }
                        }
                        this.setLabelWidth(el.closest('li'));
                    })
                })
            }
        }
        setLabelWidth(el) {
            if (el) {
                el.querySelectorAll('.menu-label').forEach(label => label.closest('a')?.style.setProperty('--label-width', label.offsetWidth + 'px'));
            }
        }
        sortOptions() {
            const defaultSort = ["xs", "s", "m", "l", "xl", "36", "38", "40", "42"],
                sortData = this.querySelector('[data-sort]').getAttribute('data-sort') ? this.querySelector('[data-sort]').getAttribute('data-sort') : defaultSort,
                sortDataArray = sortData.split(','),
                unsortedArray = [];
            this.input = this.querySelectorAll('.input-wrap');
            this.list = this.querySelector('[data-sort]');
            function intersect(a, b) {
                let t = void 0;
                if (b.length > a.length) t = b, b = a, a = t;
                return a.filter(function (e) {
                    return b.indexOf(e) > -1;
                });
            }
            function sortList(fieldset){
                let new_fieldset  = fieldset.cloneNode(false),
                    list = [];
                for(let i = fieldset.childNodes.length; i--;){
                    if(fieldset.childNodes[i].nodeType == 1)
                        list.push(fieldset.childNodes[i]);
                }
                list.sort(function(a, b){
                    return b.getAttribute('data-position') < a.getAttribute('data-position') ? 1 : -1;
                });
                for(let i in list)
                    new_fieldset.appendChild(list[i]);
                fieldset.parentNode.replaceChild(new_fieldset, fieldset);
            }
            this.input.forEach((element) => {
                unsortedArray.push(element.querySelector('input').getAttribute('value'));
            });
            let sortedArray = intersect(sortDataArray, unsortedArray);
            this.input.forEach((element) => {
                element.setAttribute('data-position', sortedArray.indexOf(element.querySelector('input').getAttribute('value')));
            });
            sortList(this.list);
        }
        blockCollapse() {
            this.scroll = this.querySelector('.sidebar-block_content-scroll');
            this.content = this.querySelector('.sidebar-block_content');
            if (this.scroll) {
                if (this.closest('.fancybox-container')) {
                    this.querySelectorAll('.scrollbar-track').forEach(el => {
                        el.remove()
                    })
                    this.querySelectorAll('.scroll-content').forEach(el => {
                        let parent = el.parentNode;
                        while (el.firstChild) parent.insertBefore(el.firstChild, el);
                        parent.removeChild(el);
                        parent.removeAttribute('data-scrollbar');
                    })
                }
                setTimeout(() => {
                    if (!this.scroll.getAttribute('data-scrollbar')) {
                        Scrollbar.init(this.scroll, {
                            alwaysShowTracks: true,
                            damping: document.body.dataset.damping
                        })
                        Scrollbar.get(this.scroll).addListener(function () {
                            tippy && tippy.hideAll()
                        })
                    }
                }, 100)
            }
            let isMobile = window.matchMedia('(max-width:991px)').matches;
            let slidespeedOpen = isMobile ? 300 : 250,
                slidespeedClose = isMobile ? 200 : 150;
            if (!this.classList.contains('sidebar-block--static')) {
                if (this.classList.contains('open')) {
                    jq(this.content).slideDown(0);
                } else {
                    this.classList.remove('open');
                    this.content.style.display = 'none'
                }
            } else {
                if (this.classList.contains('open')) {
                    jq(this.content).slideDown(0)
                } else {
                    this.content.style.display = 'none'
                }
            }
            let updatePopupScroll = () => {
                const scrollbarElement = this.closest('[data-scrollbar]');
                if(scrollbarElement) Scrollbar.get(scrollbarElement).update();
            }
            let hideScroll = () => {
                this.querySelector('.scrollbar-track')?.style.setProperty('opacity', '0')
            }
            let showScroll = () => {
                if (!!this.querySelector('.scrollbar-track')) {
                    if (this.querySelector('.scrollbar-track-y').scrollHeight > 165) {
                        this.querySelector('.scrollbar-track').style.setProperty('opacity', '0');
                        this.querySelector('.scrollbar-track-y.show').style.display = ''
                    }
                }
            }
            let updateScroll = () => {
                if(this.scroll && this.scroll.dataset.scrollbar) Scrollbar.get(this.scroll).update();
                showScroll();
            }
            this.querySelector('.sidebar-block_title')?.addEventListener('click', (e) => {
                e.preventDefault();
                let target = e.target;
                let isMobile = window.matchMedia('(max-width:991px)').matches;
                if (target.classList.contains('filter-item')) return;
                hideScroll(this.content);
                if (this.classList.contains('open')) {
                    this.classList.remove('open');
                    this.querySelector('.scrollbar-track')?.classList.add('invisible');
                    jq(this.content).slideUp(slidespeedClose, () => {
                        if (!isMobile) {
                            setTimeout(() => {
                                updateScroll(this.content);
                                this.syncContent()
                            }, 100)
                        } else {
                            setTimeout(() => {
                                updatePopupScroll();
                                this.syncContent()
                            }, 200)
                        }
                    });
                } else {
                    this.classList.add('open');
                    this.querySelector('.scrollbar-track')?.classList.remove('invisible');
                    jq(this.content).slideDown(slidespeedOpen, () => {
                        if (!isMobile) {
                            setTimeout(() => {
                                updateScroll(this.content);
                                this.syncContent()
                            }, 100)
                        } else {
                            setTimeout(() => {
                                updatePopupScroll();
                                this.syncContent()
                            }, 200)
                        }
                    })
                }
            })
        }
        syncContent() {
            const mobileFilter = this.closest('.fancybox-container')?.querySelector('.js-filter-desktop-wrap'),
                desktopFilter = document.querySelector('[data-filter] .js-filter-desktop-wrap');
            if(mobileFilter && desktopFilter){
                desktopFilter.innerHTML = mobileFilter.innerHTML;
            }
        }
        checkBoxes() {
            this.querySelectorAll('.category-list .input-wrap:not(.is-disable), .category-list a:not(.is-disable), .color-list a:not(.is-disable), .color-list .input-wrap:not(.is-disable), .tags-list a:not(.is-disable), .tags-list .input-wrap:not(.is-disable)').forEach((element) => {
                element.addEventListener('click', function() {
                    let li = !!element.closest('li') ? element.closest('li') : element.closest('.input-wrap');
                    if (li.classList.contains('active')) {
                        li.classList.add('is-unclicked');
                        setTimeout(function () {
                            li.classList.remove('active');
                        }, 200);
                        setTimeout(function () {
                            li.classList.remove('is-unclicked');
                            li.blur();
                        }, 500)
                    } else {
                        li.classList.add('is-clicked');
                        setTimeout(function () {
                            li.classList.add('active');
                        }, 250);
                        setTimeout(function () {
                            li.classList.remove('is-clicked');
                        }, 500)
                    }
                })
            })
        }
    }
    
    class FilterToggle extends HTMLElement {
        constructor() {
            super();
            this.popupElement = document.querySelector(this.dataset.selector);
            this.loaderTemplate = '<div data-load="loading"></div>';
            this.categoryWrap = document.querySelector('.js-category-page-block');
            this.addEventListener('click', this.toggleClick.bind(this));
            this.statusText = this.querySelector('span');
            this.setStatus();
        }
        setStatus(){
            const text = this.querySelector('span');
            if (this.categoryWrap.classList.contains('has-filter-closed')) {
                text.innerHTML = this.dataset.open
            } else {
                text.innerHTML = this.dataset.close
            }
        }
        toggleClick() {
            if(!this.categoryWrap.classList.contains('has-filter-closed')) {
                this.close()
            } else this.open()
        }
        close() {
            this.statusText.innerHTML = this.dataset.open;
            this.classList.remove('is-opened');
            this.categoryWrap.classList.add('has-filter-closed');
            this.update()
        }
        open() {
            if (this.dataset.ajax && this.popupElement && (!this.popupElement.classList.contains('ajax-loaded') && !this.popupElement.classList.contains('ajax-loading') || this.getAttribute('data-filter-load-force') === 'true')) {
                const urlAjax = this.dataset.ajax,
                    mobileFilter = document.querySelector('filter-popup'),
                    mobileFilterAwaitStatus = mobileFilter && mobileFilter.classList.contains('ajax-awaiting');
                if (!this.popupElement.querySelector('[data-load]')) this.popupElement.innerHTML = this.loaderTemplate;
                if (mobileFilterAwaitStatus && !mobileFilter.cloneContent.querySelector('[data-load]')) mobileFilter.cloneContent.innerHTML = this.loaderTemplate;
                this.popupElement.classList.add('ajax-loading');
                this.openStatus();
                fetch(urlAjax).then((response) => response.text())
                    .then((data) => {
                        this.removeAttribute('data-filter-load-force');
                        this.popupElement.querySelector('[data-load]')?.remove();
                        this.popupElement.innerHTML = data;
                        this.popupElement.classList.remove('ajax-loading');
                        this.popupElement.classList.add('ajax-loaded');
                        if (mobileFilterAwaitStatus) {
                            mobileFilter.cloneContent.querySelector('[data-load]')?.remove();
                            mobileFilter.cloneNode();
                            mobileFilter.classList.remove('ajax-awaiting')
                        }
                    })
                    .catch((error) => {
                        console.error('error', error);
                        this.close();
                        this.popupElement.classList.remove('ajax-loading');
                        mobileFilter.classList.remove('ajax-awaiting')
                    })
            } else this.openStatus()
        }
        openStatus() {
            this.statusText.innerHTML = this.dataset.close;
            this.classList.add('is-opened');
            this.categoryWrap.classList.remove('has-filter-closed');
            this.update()
        }
        update() {
            document.querySelectorAll('.category-page-block swiper-carousel').forEach(carousel => {carousel.destroy(); carousel.init()})
            document.getElementById('product-grid')?.querySelectorAll('product-card').forEach(element => element.productWidth());
        }
        isFilterOpened(){
            return !this.categoryWrap.classList.contains('has-filter-closed')
        }
    }

    class PriceSlider extends HTMLElement {
        constructor() {
            super();
            [this.minInput,this.maxInput] = this.querySelectorAll('input[type="range"]');
            this.inverseLeft = this.querySelector('.inverse-left');
            this.inverseRight = this.querySelector('.inverse-right');
            this.priceRange = this.querySelector('.price-slider-range');
            [this.priceThumbMin,this.priceThumbMax] = this.querySelectorAll('.price-slider-thumb');
            this.tooltip = false;
            if (this.querySelectorAll('.price-slider-sign').length) {
                this.tooltip = true;
                [this.priceSignMin,this.priceSignMax] = this.querySelectorAll('.price-slider-sign');
            } else {
                [this.minInputCustom,this.maxInputCustom] = this.querySelectorAll('input[type="number"]');
                this.minInputCustom.addEventListener('input', () => {
                    if (this.minInputCustom.value !== '') {
                        this.minInputCustomEvent()
                    }
                });
                this.minInputCustom.addEventListener('change', () => {
                    this.minInputCustomEvent()
                });
                this.minInputCustom.addEventListener('keyup', ({key}) => {
                    this.minInputCustomEvent(key)
                });
                this.maxInputCustom.addEventListener('input', () => {
                    this.minInputCustomEvent()
                });
                this.maxInputCustom.addEventListener('focusout', () => {
                    if ((this.maxInputCustom.value - this.minInput.value) <= 0) {
                        this.maxInputCustom.value = this.maxInputCustom.max;
                        this.maxEvent(this.maxInputCustom.value)
                    }
                });
                this.maxInputCustom.addEventListener('change', () => {
                    this.maxInputCustomEvent()
                });
                this.maxInputCustom.addEventListener('keyup', ({key}) => {
                    this.maxInputCustomEvent(key)
                })
            }
            this.minInput.setAttribute('value',this.minInput.value);
            this.maxInput.setAttribute('value',this.maxInput.value);
            this.minEvent();
            this.maxEvent();
            this.minInput.addEventListener('input', () => {
                this.minEvent()
            });
            this.maxInput.addEventListener('input', () => {
                this.maxEvent()
            });
            this.hoverState();
        }
        hoverState() {
            this.minInput.addEventListener('mouseenter', () => {
                !this.closest('.disable-filters') && this.priceThumbMin.classList.add('hovered');
            });
            this.minInput.addEventListener('mouseleave', () => {
                this.priceThumbMin.classList.remove('hovered');
            });
            this.maxInput.addEventListener('mouseenter', () => {
                this.priceThumbMax.classList.add('hovered')
            });
            this.maxInput.addEventListener('mouseleave', () => {
                this.priceThumbMax.classList.remove('hovered')
            })
        }
        minInputCustomEvent(key) {
            if ( key !== "Backspace") {
                this.controlMinMax(this.minInputCustom)
                this.minEvent(this.minInputCustom.value)
            }
        }
        maxInputCustomEvent() {
            if ((this.maxInputCustom.value - this.minInputCustom.value) > 0) {
                this.controlMinMax(this.maxInputCustom)
                this.maxEvent(this.maxInputCustom.value)
            } else this.setError()
        }
        setError() {
            this.classList.add('price-slider--error');
        }
        removeError() {
            this.classList.remove('price-slider--error');
        }
        controlMinMax(input) {
            let val = input.value;
            if (val < input.min) {
                input.value = input.min;
            }
            if ((input.max - val) < 0) {
                input.value = input.max;
            }
        }
        minEvent(val) {
            if (val === undefined) {val = this.minInput.value}
            let minVal = Math.min(val,this.maxInput.getAttribute('value')-1);
            if (!this.tooltip) {this.minInputCustom.value = minVal}
            this.minInput.setAttribute('value',minVal);
            this.minInput.value = minVal;
            let value = (this.minInput.value/parseInt(this.minInput.max))*100;
            this.inverseLeft.style.width=value+'%';
            this.priceRange.style.left=value+'%';
            this.priceThumbMin.style.left=value+'%';
            this.priceThumbMin.style.zIndex=2;
            this.priceThumbMax.style.zIndex=1;
            if (this.tooltip) {
                this.priceSignMin.style.zIndex=2;
                this.priceSignMax.style.zIndex=1;
                this.priceSignMin.style.left = value + '%';
                this.priceSignMin.childNodes[1].innerHTML = this.minInput.value;
            }
        }
        maxEvent(val) {
            this.removeError();
            if (val === undefined) {val = this.maxInput.value}
            let maxVal = Math.max(val,this.minInput.getAttribute('value')-(-1));
            if (!this.tooltip) {this.maxInputCustom.value = maxVal}
            this.maxInput.setAttribute('value',maxVal);
            this.maxInput.value = maxVal;
            let value = (this.maxInput.value/parseInt(this.maxInput.max))*100;
            this.inverseLeft.style.width=(100-value)+'%';
            this.priceRange.style.right=(100-value)+'%';
            this.priceThumbMax.style.left=value+'%';
            this.priceThumbMax.style.zIndex=2;
            this.priceThumbMin.style.zIndex=1;
            if (this.tooltip) {
                this.priceSignMax.style.zIndex=2;
                this.priceSignMin.style.zIndex=1;
                this.priceSignMax.style.left = value + '%';
                this.priceSignMax.childNodes[1].innerHTML = this.maxInput.value;
            }
        }
    }
    customElements.define('price-slider', PriceSlider);


    class FacetRemove extends HTMLElement {
        constructor() {
            super();
        
            const ajax = this.dataset.ajax;
        
            this.querySelectorAll('a').forEach(item => {
                item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
        
                const currentTarget = event.currentTarget
        
                if (currentTarget) {
                    if (!FacetFiltersForm.facetsLoaded() || ('filterLoadForce' in this.dataset && this.dataset.filterLoadForce === 'true')) {
                    FacetFiltersForm.asyncLoadSidebar(ajax, () => {
                        this.onActiveFilterClick(e, currentTarget);
                    })
                    } else {
                    FacetFiltersForm.disableSidebar();
                    this.onActiveFilterClick(e, currentTarget);
                    }
                }
        
                })
            });
        }
    
        onActiveFilterClick(e, target) {
            e.preventDefault();
            FacetFiltersForm.toggleActiveFacets();
        
            if (target) {
                const url = target.href.indexOf('?') == -1 ? '' : target.href.slice(target.href.indexOf('?') + 1);
                FacetFiltersForm.renderPage(url);
            }
        }
    }
    customElements.define('facet-remove', FacetRemove);


    document.addEventListener('DOMContentLoaded', () => {
        customElements.define('filter-toggle', FilterToggle);
	    customElements.define('filter-block', FilterBlock);
        customElements.define('view-mode', ViewMode);
    })

    const pageNoteCheckbox = document.querySelector('.js-cart-page-note-checkbox');

    function replaceTitle(tab) {
        if (!tab) return;
        let wrap = tab.parentNode;
        if (!tab.checked) {
            let text = wrap.querySelector('textarea').value,
                limit = Math.round(tab.nextElementSibling.offsetWidth / 12),
                title = tab.nextElementSibling;
            if (typeof text !== 'undefined' && text != '') {
                text = text.trim();
                title.innerHTML = `<span class="cutted-default-text">${title.dataset.text}</span><span class="cutted-text">${text.slice(0, limit)}</span><span class="cutted-text-dots">${text.length > limit ? '...' : ''}</span><span></span>`
            } else {
                tab.nextElementSibling.innerHTML = title.dataset.text + '<span></span>'
            }
        }
    }
    function moveQtyNode() {
        document.querySelectorAll('.cart-table .cart-table-prd').forEach(el => {
            const mobileContainer = el.querySelector('[data-node-mobile]'),
                desktopContainer = el.querySelector('[data-node-desktop]');
            if (window.matchMedia('(max-width:575px)').matches) {
                if(mobileContainer && !mobileContainer.innerHTML.trim().length) {
                    mobileContainer.insertAdjacentHTML('afterbegin', desktopContainer.innerHTML);
                    desktopContainer.innerHTML = ''
                }
            } else {
                if(desktopContainer && !desktopContainer.innerHTML.trim().length){
                    desktopContainer.insertAdjacentHTML('afterbegin', mobileContainer.innerHTML);
                    mobileContainer.innerHTML = ''
                }
            }
        })
    }

    const getSiblings = function (e) {
        let siblings = [];
        if (!e.parentNode) {
            return siblings;
        }
        let sibling = e.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== e) {
                siblings.push(sibling);
            }
            sibling = sibling.nextSibling;
        }
        return siblings;
    };

    if(pageNoteCheckbox){
        document.querySelectorAll('[data-click="radio"] input[type="checkbox"]').forEach((el) => {
            el.addEventListener('change', function () {
                let siblings = getSiblings(this.closest('.tab-accordion-item'));
                siblings.map(el => el.querySelector('input[type="checkbox"]'));
                siblings.map(function (el) {
                    let tab = el.querySelector('input[type="checkbox"]');
                    tab.checked = false;
                    tab.classList.contains('js-cart-page-note-checkbox') ? replaceTitle(tab) : false
                })
            })
        })

        document.addEventListener('DOMContentLoaded', () => {
            if (pageNoteCheckbox) {
                replaceTitle(pageNoteCheckbox);
                pageNoteCheckbox.addEventListener('click', function () {replaceTitle(this)})
            }
            moveQtyNode()
        })

        window.addEventListener('resize', function(){
            if (pageNoteCheckbox) replaceTitle(document.querySelector('.js-cart-page-note-checkbox'));
            moveQtyNode()
        })
    }

    class TextareaAutosize extends HTMLElement {
        constructor() {
            super();
            this.input = this.querySelector('.form-control');
            this.input.setAttribute('rows', 1);
            this.resizeInput();
            this.input.addEventListener('input', () => {
                this.resizeInput()
            })
        }
        resizeInput() {
            this.input.style.height = 0;
            this.input.style.height = this.input.scrollHeight - 5.5 + 'px';
            if (this.getAttribute('data-maxheight')) {
                if (this.input.scrollHeight >= this.dataset.maxheight) {
                    this.input.style.overflow = 'auto'
                } else {
                    this.input.style.overflow = 'hidden'
                }
            }
            if (this.closest('.minicart-drop-fixed') && customElements.get('mini-cart-popup')) {
                document.querySelectorAll('mini-cart-popup').forEach(cart => {
                    cart.isOpened() && cart.bottomFixedSlide()
                })
            }
            const setHeight = this.closest('.js-set-height');
            if (setHeight && this.input.scrollHeight > 38.5) {
                setHeight.style.setProperty('--tab-height', parseInt(setHeight.dataset.tabh) + this.input.scrollHeight + 'px')
            }
        }
    }
    customElements.define('textarea-autosize', TextareaAutosize);


    class CartNote extends HTMLElement {
        constructor() {
        super();
        this.addEventListener('change', debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            Array.from(document.querySelectorAll(`[name=${event.target.name}]`)).filter(item => item != event.target).forEach(item => item.value = event.target.value);
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
        }, 300))
        }
    }
    customElements.define('cart-note', CartNote);

})(jQuery);

$.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
}