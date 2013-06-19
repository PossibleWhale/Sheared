/*
 * Crafting booth
 */

"use strict";

import ui.View;
import ui.ImageView;
import ui.TextView;

import src.constants as constants;

var colors = constants.colors;

exports = Class(ui.ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/16x9/craftstand-dev.png",
            autosize: true
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        this.on('craft:start', function () {
            console.log('start crafting');
            // TODO - something may go here someday
        });

        // create color buttons
        var colorButtons = [];
        for (var i = 0; i < craftScreenRegions.colors.length; i++) {
            var region = craftScreenRegions.colors[i];

            var opts = {
                superview: this,
                clip: true
            };
            merge(opts, region);
            opts.x = opts.x * BIZARRE_SCALE_RATIO;
            opts.y = opts.y * BIZARRE_SCALE_RATIO;
            opts.height = opts.height * BIZARRE_SCALE_RATIO;
            opts.width = opts.width * BIZARRE_SCALE_RATIO;
            var btn = new ui.TextView(opts);

            btn.on('InputSelect', function () {
                console.log(this.getOpts().c.label + ' clicked');
            });

            colorButtons.push(btn);
        }

    };
});


var BIZARRE_SCALE_RATIO = 0.375;

var craftScreenRegions = {
colors: [
    {c: constants.COLOR_WHITE, y:142, x:50, width:58, height:58},
    {c: constants.COLOR_GREEN, y:228, x:50, width:58, height:58},
    {c: constants.COLOR_RED, y:316, x:50, width:58, height:58},
    {c: constants.COLOR_BLUE, y:403, x:50, width:58, height:58},
    {c: constants.COLOR_YELLOW, y:490, x:50, width:58, height:58},
    {c: constants.COLOR_BLACK, y:577, x:50, width:58, height:58}
    ],
requirements: [
    {y:114, x:210, width:58, height:60},
    {y:114, x:337, width:58, height:60},
    {y:114, x:406, width:58, height:60},
    {y:114, x:495, width:58, height:60},
    {y:114, x:566, width:58, height:60},
    {y:114, x:655, width:58, height:60},
    {y:114, x:723, width:58, height:60},
    {y:114, x:817, width:58, height:60},
    {y:114, x:887, width:58, height:60},
    {y:114, x:976, width:58, height:60},
    {y:114, x:1047, width:58, height:60}
    ],
garments: [
    {y:139, x:1153, width:95, height:90},
    {y:255, x:1161, width:74, height:90},
    {y:358, x:1164, width:68, height:90},
    {y:466, x:1173, width:53, height:90},
    {y:571, x:1156, width:88, height:90}
    ],
chalkboards: [
    {y:504, x:182, width:108, height:67},
    {y:504, x:346, width:108, height:67},
    {y:504, x:507, width:108, height:67},
    {y:504, x:665, width:108, height:67},
    {y:504, x:826, width:108, height:67},
    {y:504, x:985, width:108, height:67}
    ],
buttons: [
    {y:597, x:191, width:40, height:40},
    {y:597, x:249, width:40, height:40},
    {y:597, x:351, width:40, height:40},
    {y:597, x:410, width:40, height:40},
    {y:597, x:509, width:40, height:40},
    {y:597, x:571, width:40, height:40},
    {y:597, x:671, width:40, height:40},
    {y:597, x:730, width:40, height:40},
    {y:597, x:831, width:40, height:40},
    {y:597, x:889, width:40, height:40},
    {y:597, x:991, width:40, height:40},
    {y:597, x:1050, width:40, height:40}
    ]
}
