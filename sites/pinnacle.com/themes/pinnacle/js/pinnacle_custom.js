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
			this.$zoneWrap = $('#zone-postscript-wrapper, #zone-preface-wrapper', context);
			var callback = this.contextualize(this.scrollHandler, this);
			var dcallback = this.contextualize(this.triggerDimensions, this);
			var that = this;
			this.$zoneWrap.each(function() {that.max_image_pos.push(that.max_image_position)});

			that.$window.bind("scroll", callback);
			that.$window.bind('load resize', dcallback);

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
			var zoneWrap = $(e);
			if(scrollTop+windowHeight > zoneWrap.offset().top) {
				var factor = that.max_image_pos[i]-(((documentHeight-scrollTop-windowHeight)/(documentHeight-windowHeight))*that.max_image_pos[i]);
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
		zone.each(function(i, e) {
 		var div = zone.get(i);
		var style = div.currentStyle || window.getComputedStyle(div, false);
		var bg = style.backgroundImage.slice(4, -1);

		var background = new Image();
		background.src = bg;

		background.onload = function() {
		    if (background.width > background.height) {
		        var ratio = background.height / background.width;
		        if (div.offsetWidth > div.offsetHeight) {
		            var bgW = div.offsetWidth;
		            var bgH = Math.round(div.offsetWidth * ratio);
		            if (bgH < div.offsetHeight) {
		                bgH = div.offsetHeight;
		                bgW = Math.round(bgH / ratio);
		            }
		        } else {
		            var bgW = Math.round(div.offsetHeight / ratio);
		            var bgH = div.offsetHeight;
		        }
		    } else {
		        var ratio = background.width / background.height;
		        if (div.offsetHeight > div.offsetWidth) {
		            var bgH = div.offsetHeight;
		            var bgW = Math.round(div.offsetHeight * ratio);
		            if (bgW > div.offsetWidth) {
		                bgW = div.offsetWidth;
		                bgH = Math.round(bgW / ratio);
		            }
		        } else {
		            var bgW = Math.round(div.offsetWidth / ratio);
		            var bgH = div.offsetWidth;
		        }
		    }
		    //console.log(bgW + ", " + bgH);
		    that.max_image_pos[i] = bgH-zone.outerHeight();
		    that.triggerScrollEvent();
		}
		});
  	},
 }
})(jQuery);
