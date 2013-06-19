/*
 * Crafting booth
 */

import ui.View;
import ui.ImageView;

exports = Class(ui.ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: "resources/images/16x9/craftstand-dev.png"
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {
        console.log('build craftstand');
	};
});
