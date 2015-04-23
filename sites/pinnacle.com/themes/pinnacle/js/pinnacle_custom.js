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

			//If all images have a dimension in their tag then we don't have to wait for the load event. But since the logo image doesn't we do.
			this.$document.bind('responsivelayout', function(e, d) {
				if(d.to == 'wide'/* || d.to == 'normal'*/) {
					that.$window.bind("load resize scroll", callback);
				} else {
					that.$window.unbind("load resize scroll", callback);
					that.$zoneWrap.css({backgroundPosition: 'center top'});	
				}
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
	}
  }
})(jQuery);
