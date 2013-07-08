/*
 * A common button
 */

"use strict";

import ui.TextView;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.constants as constants;
import src.debughack as dh;

var colors = constants.colors;

// this is based on TextView because our buttons will be overlaid on an image
// background, anyway
exports = Class(ui.TextView, function (supr) {
    this.init = function (opts) {
        var defaults = {
                size: 128,
                strokeWidth: 4,
                strokeColor: '#000000',
                color: '#ffffff'
        };
        merge(defaults, opts); /* merge opts over defaults so the passed-in
                                * opts take precedence
                                */
        opts = defaults;
        supr(this, 'init', [opts]);

        dh.post_initButton(this, opts);

        this.on('InputSelect', function () {
            if (this.getOpts().click) {
                GC.app.audio.playButton();
            }
        });

        this.imageLayer = new ImageView({
            superview: this,
            width: this.style.width,
            height: this.style.height
        });

    };

    this.setImage = function (image) {
        var img;
        if (typeof url === 'string') {
            img = new Image({url: image});
        } else {
            img = image;
        }
        return this.imageLayer.setImage(img);
    };
});
