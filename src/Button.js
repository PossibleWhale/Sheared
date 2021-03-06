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
                strokeWidth: 2,
                strokeColor: '#000000',
                color: '#ffffff',
                fontFamily: 'delius'
        };
        merge(opts, defaults); /* merge opts over defaults so the passed-in
                                * opts take precedence
                                */
        supr(this, 'init', [opts]);

        dh.post_initButton(this, opts);

        this.click = this.getOpts().click;
        this._addListener();

        this.imageLayer = new ImageView({
            superview: this,
            width: this.style.width,
            height: this.style.height
        });

        this.setImage = bind(this.imageLayer, this.imageLayer.setImage);

        if (opts.image) {
            this.setImage(opts.image);
        }

    };

    this._addListener = function () {
        this.on('InputSelect', function () {
            if (this.click) {
                GC.app.audio.playButton();
            }
        });
    };

    this.removeAllListeners = function () {
        supr(this, 'removeAllListeners');
        this._addListener();
    };
});
