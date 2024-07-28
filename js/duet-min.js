(function($) {
    'use strict';

    // Global variables
    var navTarget = $('body').attr('data-page-url');
    var docTitle = document.title;
    var History = window.History;

    // Function to handle page-specific functions
    function pageFunctions() {
        // Handle image loading for portfolio items
        $('.page__content').find('img:first').imagesLoaded(function() {
            $('.portfolio-wrap').imagesLoaded(function() {
                $('.portfolio-wrap').masonry({
                    itemSelector: '.portfolio-item',
                    transitionDuration: 0
                });
            });

            // Handle image loading for blog posts
            $('.blog-wrap').imagesLoaded(function() {
                $('.blog-wrap').masonry({
                    itemSelector: '.blog-post',
                    transitionDuration: 0
                });
            });

            // Remove loading class and menu open class from body
            $('body').removeClass('loading');
            $('body').removeClass('menu--open');
        });

        // Update active link states
        $('.active-link').removeClass('active-link');
        $('a[href="' + navTarget + '"]').addClass('active-link');

        // Destroy all existing waypoints
        Waypoint.destroyAll();

        // Handle gallery setup
        var galleryCount = 0;
        $('.gallery').each(function() {
            var $this = $(this);
            var thisId = 'gallery-' + ++galleryCount;
            $this.attr('id', thisId);
            var galleryCols = $this.attr('data-columns');
            $this.append('<div class="gallery__wrap"></div>');

            // Append images to gallery wrap
            $this.children('img').each(function() {
                $(this).appendTo('#' + thisId + ' .gallery__wrap');
            });

            // Wrap images with links for fluidbox
            $this.find('.gallery__wrap img').each(function() {
                var imageSrc = $(this).attr('src');
                $(this).wrapAll('<div class="gallery__item"><a href="' + imageSrc + '" class="gallery__item__link"></div></div>').appendTo();
            });

            // Initialize galleries based on the number of columns
            $this.imagesLoaded(function() {
                if (galleryCols === '1') {
                    // Single column gallery setup
                    $this.addClass('gallery--carousel');
                    $this.children('.gallery__wrap').addClass('owl-carousel');
                    $this.children('.gallery__wrap').owlCarousel({
                        items: 1,
                        loop: true,
                        mouseDrag: false,
                        touchDrag: true,
                        pullDrag: false,
                        dots: true,
                        autoplay: false,
                        autoplayTimeout: 6000,
                        autoHeight: true,
                        animateOut: 'fadeOut'
                    });

                    // Initialize waypoints for carousel interaction
                    new Waypoint({
                        element: document.getElementById(thisId),
                        handler: function(direction) {
                            if (direction === 'down') {
                                $this.children('.gallery__wrap').trigger('stop.owl.autoplay');
                            }
                            if (direction === 'up') {
                                $this.children('.gallery__wrap').trigger('play.owl.autoplay');
                            }
                        },
                        offset: '-100%'
                    });

                    new Waypoint({
                        element: document.getElementById(thisId),
                        handler: function(direction) {
                            if (direction === 'down') {
                                $this.children('.gallery__wrap').trigger('play.owl.autoplay');
                            }
                            if (direction === 'up') {
                                $this.children('.gallery__wrap').trigger('stop.owl.autoplay');
                            }
                        },
                        offset: '100%'
                    });
                } else {
                    // Multi-column gallery setup
                    $this.addClass('gallery--grid');
                    $this.children('.gallery__wrap').masonry({
                        itemSelector: '.gallery__item',
                        transitionDuration: 0
                    });
                    $this.find('.gallery__item__link').fluidbox({ loader: true });
                }
                $this.addClass('gallery--on');
            });
        });

        // Wrap standalone images with a div for styling
        $('.single p > img').each(function() {
            var thisP = $(this).parent('p');
            $(this).insertAfter(thisP);
            $(this).wrapAll('<div class="image-wrap"></div>');
            thisP.remove();
        });

        // Wrap iframes (videos) with a div for responsive aspect ratio
        // $('.single iframe').each(function() {
        //     if ($(this).attr('src').indexOf('youtube') >= 0 || $(this).attr('src').indexOf('vimeo') >= 0) {
        //         var width = $(this).attr('width');
        //         var height = $(this).attr('height');
        //         var ratio = (height / width) * 100;
        //         $(this).wrapAll('<div class="video-wrap"><div class="video" style="padding-bottom:' + ratio + '%;"></div></div>');
        //     }
        // });

        // Wrap tables with a div for responsive scrolling
        $('.single table').each(function() {
            $(this).wrapAll('<div class="table-wrap"></div>');
        });
    }

    // Bind to state change events for AJAX navigation
    History.Adapter.bind(window, 'statechange', function() {
        var state = History.getState();
        $('body').addClass('loading');
        $('.page-loader').load(state.hash + ' .page__content', function() {
            $('body, html').animate({ scrollTop: 0 }, 300);
            setTimeout(function() {
                $('.page .page__content').remove();
                $('.page-loader .page__content').appendTo('.page');
                $('body').attr('data-page-url', window.location.pathname);
                navTarget = $('body').attr('data-page-url');
                docTitle = $('.page__content').attr('data-page-title');
                document.title = docTitle;
                pageFunctions();
            }, 400);
        });
    });

    // Handle AJAX loading for links
    // if ($('body').hasClass('ajax-loading')) {
    //     $(document).on('click', 'a', function(event) {
    //         event.preventDefault();
    //         var thisTarget = $(this).attr('href');
    //         if ($(this).hasClass('js-no-ajax') || thisTarget.indexOf('#') >= 0 || thisTarget.indexOf('mailto:') >= 0 || thisTarget.indexOf('tel:') >= 0) {
    //             window.location = thisTarget;
    //         } else if ($(this).is('.gallery__item__link')) {
    //             // Handled by other JS
    //         } else if (thisTarget.indexOf('http') >= 0) {
    //             window.open(thisTarget, '_blank');
    //         } else {
    //             navTarget = thisTarget;
    //             History.pushState(null, docTitle, thisTarget);
    //         }
    //     });
    // }

    // Run page functions on load
    pageFunctions();

    // Menu toggle
    $(document).on('click', '.js-menu-toggle', function() {
        $('body').toggleClass('menu--open');
    });

    // Menu item click
    $(document).on('click', '.menu__list__item__link', function() {
        if ($('.menu').hasClass('menu--open')) {
            $('.menu').removeClass('menu--open');
        }
    });

    // Contact form submission
    $(document).on('submit', '#contact-form', function(event) {
        $('.contact-form__item--error').removeClass('contact-form__item--error');
        var emailField = $('.contact-form__input[name="email"]');
        var nameField = $('.contact-form__input[name="name"]');
        var messageField = $('.contact-form__textarea[name="message"]');
        var gotchaField = $('.contact-form__gotcha');
        if (emailField.val() === '') {
            emailField.closest('.contact-form__item').addClass('contact-form__item--error');
        }
        if (nameField.val() === '') {
            nameField.closest('.contact-form__item').addClass('contact-form__item--error');
        }
        if (messageField.val() === '') {
            messageField.closest('.contact-form__item').addClass('contact-form__item--error');
        }
        if (emailField.val() !== '' && nameField.val() !== '' && messageField.val() !== '' && gotchaField.val().length === 0) {
            // Form is valid, submit it
        } else {
            event.preventDefault();
        }
    });

})(jQuery);
