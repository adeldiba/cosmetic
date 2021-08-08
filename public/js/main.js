
//Menu Navbar
$(document).ready(function () {
  $('.navbar-expand-lg .dmenu').hover(function () {
          $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
      }, function () {
          $(this).find('.sm-menu').first().stop(true, true).slideUp(105)
      });
});
$("[data-trigger]").on("click", function(){
  var trigger_id =  $(this).attr('data-trigger');
  $(trigger_id).toggleClass("show");
  $('body').toggleClass("offcanvas-active");
});
function toggle(){
  $('.ico01').click(function(){
      $('.wrapper').toggleClass('active');
  })
}

toggle();
// close button 
$(".btn-close").click(function(e){
  $(".navbar-collapse").removeClass("show");
  $("body").removeClass("offcanvas-active");
}); 
// Search Bar
$(document).on('click','.search',function(){
  $('.search-bar').addClass('search-bar-active')
});
$(document).on('click','.search-cancel',function(){
  $('.search-bar').removeClass('search-bar-active')
});
/// login-sign-up-form//////////////
$(document).on('click','.user,.already-account',function(){
  $('.form').addClass('login-active').removeClass('sign-up-active')
});
$(document).on('click','.sign-up-btn',function(){
  $('.form').addClass('sign-up-active').removeClass('login-active')
});
$(document).on('click','.form-cancel',function(){
  $('.form').removeClass('login-active').removeClass('sign-up-active')
});

/// Slider /////////////////////
$(document).ready(function(){
  $('#adaptive').lightSlider({
    adaptiveHeight: true,
    auto: true,
    item:1,
    speed: 700,
    pause: 5000,
    slideMargin:0,
    loop: true
  })
});
////////feature-category/////////
$(document).ready(function() {
  $('#autoWidth').lightSlider({
      autoWidth:true,
      loop:true,
      onSliderLoad: function() {
          $('#autoWidth').removeClass('cS-hidden');
      } 
  });  
});
// for-fix-menu-when-scroll//////////////////////
$(window).scroll(function(){
  if($(document).scrollTop() > 50){
    $('.navigation').addClass('fix-nav');
  }
  else{
    $('.navigation').removeClass('fix-nav');
  }
});
////for-responsive-menu ///////////////////
$(document).ready(function(){
  $('.toggle').click(function(){
    $('.toggle').toggleClass('active')
    $('.navigation').toggleClass('active')
  })
});
/// back-to-top///////////////////
$(document).ready(function(){
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('#back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});

!function ($) {
  "use strict"; // jshint ;_;
  /* MAGNIFY PUBLIC CLASS DEFINITION
   * =============================== */
  var Magnify = function (element, options) {
      this.init('magnify', element, options)
  }
  Magnify.prototype = {
      constructor: Magnify
      , init: function (type, element, options) {
          var event = 'mousemove'
              , eventOut = 'mouseleave';
          this.type = type
          this.$element = $(element)
          this.options = this.getOptions(options)
          this.nativeWidth = 0
          this.nativeHeight = 0
          this.$element.wrap('<div class="magnify" >');
          this.$element.parent('.magnify').append('<div class="magnify-large" >');
          this.$element.siblings(".magnify-large").css("background", "url('" + this.$element.attr("src") + "') no-repeat");
          this.$element.parent('.magnify').on(event + '.' + this.type, $.proxy(this.check, this));
          this.$element.parent('.magnify').on(eventOut + '.' + this.type, $.proxy(this.check, this));
      }
      , getOptions: function (options) {
          options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

          if (options.delay && typeof options.delay == 'number') {
              options.delay = {
                  show: options.delay
                  , hide: options.delay
              }
          }
          return options
      }
      , check: function (e) {
          var container = $(e.currentTarget);
          var self = container.children('img');
          var mag = container.children(".magnify-large");

          // Get the native dimensions of the image
          if (!this.nativeWidth && !this.nativeHeight) {
              var image = new Image();
              image.src = self.attr("src");

              this.nativeWidth = image.width;
              this.nativeHeight = image.height;

          } else {
              var magnifyOffset = container.offset();
              var mx = e.pageX - magnifyOffset.left;
              var my = e.pageY - magnifyOffset.top;

              if (mx < container.width() && my < container.height() && mx > 0 && my > 0) {
                  mag.fadeIn(100);
              } else {
                  mag.fadeOut(100);
              }

              if (mag.is(":visible")) {
                  var rx = Math.round(mx / container.width() * this.nativeWidth - mag.width() / 2) * -1;
                  var ry = Math.round(my / container.height() * this.nativeHeight - mag.height() / 2) * -1;
                  var bgp = rx + "px " + ry + "px";

                  var px = mx - mag.width() / 2;
                  var py = my - mag.height() / 2;

                  mag.css({ left: px, top: py, backgroundPosition: bgp });
              }
          }

      }
  }
  /* MAGNIFY PLUGIN DEFINITION
   * ========================= */
  $.fn.magnify = function (option) {
      return this.each(function () {
          var $this = $(this)
              , data = $this.data('magnify')
              , options = typeof option == 'object' && option
          if (!data) $this.data('tooltip', (data = new Magnify(this, options)))
          if (typeof option == 'string') data[option]()
      })
  }
  $.fn.magnify.Constructor = Magnify
  $.fn.magnify.defaults = {
      delay: 0
}
  /* MAGNIFY DATA-API
   * ================ */

  $(window).on('load', function () {
      $('[data-toggle="magnify"]').each(function () {
          var $mag = $(this);
          $mag.magnify()
      })
  })

}(window.jQuery);

// Nice Number
$(function(){
  $('input[type="number"]').niceNumber();
});
///form-login-register///////////////////
const inputs = document.querySelectorAll('.form__input');
function addfocus(){
  let parent = this.parentNode.parentNode
  parent.classList.add('focus')
}
//remove focus
function remfocus(){
  let parent = this.parentNode.parentNode
  if(this.value == ""){
    parent.classList.remove('focus')
  }
}
inputs.forEach(input=>{
  input.addEventListener('focus',addfocus)
  input.addEventListener('blur',remfocus)
})