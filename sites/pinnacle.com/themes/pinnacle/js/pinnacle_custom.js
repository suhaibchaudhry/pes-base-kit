/******************************
*     Author: Asad Hasan      *
*******************************/

(function ($) {
  // Handle user toolbar when user is admin and have admin toolbar enabled.
  Drupal.behaviors.pinnacle_parallax = {
  	attach: function(context, settings) {
		this.max_image_position = 350;
		this.max_image_pos = [];

		if(this.firstLoad) {
			this.$window = $(window);
			this.$document = $(document);
			this.$zoneWrap = $('#zone-postscript-wrapper', context);
			this.$wraps = [];
			var callback = this.contextualize(this.scrollHandler, this);
			var dcallback = this.contextualize(this.triggerDimensions, this);
			var that = this;
			this.$zoneWrap.each(function(i, e) {
				that.$wraps.push($(e));
				that.max_image_pos.push(that.max_image_position)
			});

			that.$window.bind("scroll", callback);
			that.$window.bind('load resize', dcallback);
 
			//Disable transitions on mac since scrolling is smooth already.
			if( $.browser.mac  ) {
                                this.$zoneWrap.removeClass('nativeBgTransition');
                        } else {
                                this.$zoneWrap.addClass('nativeBgTransition');
                        }

			//Turn on cover background sizing for webkit browsers because ratio calculation with cover does not work in gecko and trident.
			if( $.browser.webkit ) {
				this.$zoneWrap.css({backgroundSize: 'cover'});
			}

			//If all images have a dimension in their tag then we don't have to wait for the load event. But since the logo image doesn't we do.
			this.$window.bind('responsivelayout', function(e, d) {
				if(d.to == 'mobile') { //|| d.to == 'normal') {
					that.$window.unbind("scroll", callback);
					that.$window.unbind('load resize', dcallback);
					that.$zoneWrap.css({backgroundPosition: 'center top'});
				} else {
					that.$window.bind("scroll", callback);
					that.$window.bind('load resize', dcallback);
					that.getBgDimensions(that.$zoneWrap);
				}
			});

			this.firstLoad = false;
		}
	},
	triggerScrollEvent: function() {	
		this.$window.trigger("scroll");
	},
	triggerDimensions: function(e) {
		this.getBgDimensions(this.$zoneWrap);
	},
	firstLoad: true,
	scrollHandler: function(e) {
		var that = this;
		var scrollTop = this.$window.scrollTop();
		var windowHeight = this.$window.outerHeight();
		var documentHeight = this.$document.outerHeight();

		this.$zoneWrap.each(function(i, e) {
			//console.log(i+": ");
			//console.log(e);
			var zoneWrap = that.$wraps[i];
			if(scrollTop+windowHeight >= zoneWrap.offset().top) {
				var factor = Math.round(that.max_image_pos[i]-(((documentHeight-scrollTop-windowHeight)/(documentHeight-windowHeight))*that.max_image_pos[i]));
				if(factor > 0) {
					zoneWrap.css({backgroundPosition: 'center -'+factor+'px'});
				}
			}
		});
	},
	contextualize: function(method, context) {
		return function() {			
			method.apply(context, arguments);
		}
	},
	//Source: http://jsfiddle.net/TLQrL/2/
	//Stackoverflow: Question: http://stackoverflow.com/questions/23518501/retrieve-the-size-of-a-background-image-set-to-cover
  	getBgDimensions: function(zone) {
  		var that = this;
		var div = [];
		var style = [];
		var bg = [];
		var background = [];
		zone.each(function(i, e) {
			div[i] = zone.get(i);
			style[i] = div[i].currentStyle || window.getComputedStyle(div[i], false);
			bg[i] = style[i].backgroundImage.slice(4, -1);

			background[i] = new Image();
			background[i].src = bg[i];
			background[i].dataset.index = i;
			background[i].onload = function() {
			    var i = parseInt(this.dataset.index);

			    //console.log('W: '+background[i].width+' H: '+background[i].height);
			    //console.log('OW: '+div[i].offsetWidth+' OH: '+div[i].offsetHeight);
			    if (background[i].width > background[i].height) {
				var ratio = background[i].height / background[i].width;
				if (div[i].offsetWidth > div[i].offsetHeight) {
				    var bgW = div[i].offsetWidth;
				    var bgH = Math.round(div[i].offsetWidth * ratio);
				    if (bgH < div[i].offsetHeight) {
					bgH = div[i].offsetHeight;
					bgW = Math.round(bgH / ratio);
				    }
				} else {
				    var bgW = Math.round(div[i].offsetHeight / ratio);
				    var bgH = div[i].offsetHeight;
				}
			    } else {
				var ratio = background[i].width / background[i].height;
				if (div[i].offsetHeight > div[i].offsetWidth) {
				    var bgH = div[i].offsetHeight;
				    var bgW = Math.round(div[i].offsetHeight * ratio);
				    if (bgW > div[i].offsetWidth) {
					bgW = div[i].offsetWidth;
					bgH = Math.round(bgW / ratio);
				    }
				} else {
				    var bgW = Math.round(div[i].offsetWidth / ratio);
				    var bgH = div[i].offsetWidth;
				}
			    }
			    //console.log(bgW + ", " + bgH);
			    that.max_image_pos[i] = bgH-that.$wraps[i].outerHeight();
			    //console.log(i+": ");
			    //console.log(this);
			    //console.log('Loading : '+i+' : Height: '+that.max_image_pos[i]);
			    that.triggerScrollEvent();
			}
		});
  	}
 }
})(jQuery);
