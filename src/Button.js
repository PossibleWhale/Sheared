/*
 * A common button
 */

"use strict";

import ui.TextView;
import src.constants as constants;

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
        if (GC.debug) {
            merge(opts, {
                backgroundColor: '#c6c',
                opacity: 0.4
            });
        }
        supr(this, 'init', [opts]);
    };
});
