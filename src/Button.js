/*
 * A common button
 */

"use strict";

import ui.View;
import ui.ImageView;
import ui.TextView;
import src.constants as constants;

var colors = constants.colors;

// this is based on TextView because our buttons will be overlaid on an image
// background anyway
exports = Class(ui.TextView, function (supr) {
    this.init = function (opts) {
        if (GC.debug) {
            merge(opts, {
                backgroundColor: '#c6c',
                opacity: 0.7
            });
        }
        supr(this, 'init', [opts]);
    };
});
