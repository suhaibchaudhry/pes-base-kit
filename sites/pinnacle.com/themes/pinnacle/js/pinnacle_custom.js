(function ($) {
  // Handle user toolbar when user is admin and have admin toolbar enabled.
  Drupal.behaviors.pinnacle_parallax = {
  	attach: function(context, settings) {
		this.max_image_position = 350;
		if(this.firstLoad) {
			this.$window = $(window);
			this.$document = $(document);
			this.$zoneWrap = $('#zone-postscript-wrapper', context);
			var callback = this.contextualize(this.scrollHandler, this);
			var that = this;

			that.$window.bind("load resize scroll", callback);

			//If all images have a dimension in their tag then we don't have to wait for the load event. But since the logo image doesn't we do.
			this.$document.bind('responsivelayout', function(e, d) {
				/*if(d.to == 'wide') { //|| d.to == 'normal') {
					that.$window.bind("load resize scroll", callback);
				} else {
					that.$window.unbind("load resize scroll", callback);
					that.$zoneWrap.css({backgroundPosition: 'center top'});	
				}*/
				that.$zoneWrap.css({backgroundPosition: 'center top'});
				that.getBgDimensions(that.$zoneWrap);
			});

			this.firstLoad = false;
		}
	},
	firstLoad: true,
	scrollHandler: function(e) {
		if(this.$window.scrollTop()+this.$window.height() > this.$zoneWrap.offset().top) {
			var factor = this.max_image_position-(((this.$document.height()-this.$window.scrollTop()-this.$window.height())/(this.$document.height()-this.$window.height()))*this.max_image_position);
			if(factor > 0) {
				this.$zoneWrap.css({backgroundPosition: 'center -'+factor+'px'});
			}
		}
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
 		var div = zone.get(0);
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
		    console.log(bgW + ", " + bgH);
		    that.max_image_position = bgH-zone.height();
		}
  	}
  }
})(jQuery);