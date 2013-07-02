/*
 * A common button
 */

"use strict";

import ui.TextView;
import src.constants as constants;
import src.debughack as dh;

var colors = constants.colors;

// this is based on TextView because our buttons will be overlaid on an image
// background, anyway
exports = Class(ui.TextView, function (supr) {
    this.init = function (opts) {
        dh.pre_initButton(opts);
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
    };
});
