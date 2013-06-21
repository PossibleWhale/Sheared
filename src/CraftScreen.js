/*
 * Crafting booth
 */

"use strict";

import ui.View;
import ui.ImageView;
import ui.TextView;

import src.constants as constants;
import src.Button as Button;


exports = Class(ui.ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/craft-dev.png",
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

        var commonOpts = { superview: this, clip: true };

        function _buttonFromRegion(region) {
            var opts = merge(merge({}, commonOpts), region);
            return new Button(opts);
        }

        // color buttons
        var colorButtons = [];
        for (var i = 0; i < craftScreenRegions.colors.length; i++) {
            var btn = _buttonFromRegion(craftScreenRegions.colors[i]);
            btn.on('InputSelect', function () {
                console.log(this.getOpts().c.label + ' clicked');
            });

            colorButtons.push(btn);
        }

        // garment buttons
        var garmentButtons = [];
        for (var i = 0; i < craftScreenRegions.garments.length; i++) {
            var btn = _buttonFromRegion(craftScreenRegions.garments[i]);
            btn.on('InputSelect', function () {
                console.log(this.getOpts().g.label + ' clicked');
            });

            garmentButtons.push(btn);
        }

        // cost buttons
        var costButtons = [];
        for (var i = 0; i < craftScreenRegions.costs.length; i++) {
            var btn = _buttonFromRegion(craftScreenRegions.costs[i]);

            costButtons.push(btn);
        }
    };
});


var craftScreenRegions = {
colors: [
    {c: constants.COLOR_WHITE, y:170, x:39, width:50, height:50},
    {c: constants.COLOR_RED, y:234, x:39, width:50, height:50},
    {c: constants.COLOR_GREEN, y:298, x:39, width:50, height:50},
    {c: constants.COLOR_BLUE, y:362, x:39, width:50, height:50},
    {c: constants.COLOR_YELLOW, y:426, x:39, width:50, height:50},
    {c: constants.COLOR_BLACK, y:490, x:39, width:50, height:50}
    ],
costs: [
    {g: constants.TYPE_YARN, y:152, x:166, width:50, height:50},

    {g: constants.TYPE_CAP, y:152, x:266, width:50, height:50},
    {g: constants.TYPE_CAP, y:152, x:323, width:50, height:50},

    {g: constants.TYPE_MITTEN, y:152, x:395, width:50, height:50},
    {g: constants.TYPE_MITTEN, y:152, x:452, width:50, height:50},

    {g: constants.TYPE_SOCK, y:152, x:522, width:50, height:50},
    {g: constants.TYPE_SOCK, y:152, x:579, width:50, height:50},

    {g: constants.TYPE_SCARF, y:152, x:651, width:50, height:50},
    {g: constants.TYPE_SCARF, y:152, x:708, width:50, height:50},

    {g: constants.TYPE_SWEATER, y:152, x:779, width:50, height:50},
    {g: constants.TYPE_SWEATER, y:152, x:836, width:50, height:50}
    ],
garments: [
    {g: constants.TYPE_YARN, y:170, x:936, width:50, height:50},
    {g: constants.TYPE_CAP, y:234, x:936, width:50, height:50},
    {g: constants.TYPE_MITTEN, y:298, x:936, width:50, height:50},
    {g: constants.TYPE_SOCK, y:362, x:936, width:50, height:50},
    {g: constants.TYPE_SCARF, y:426, x:936, width:50, height:50},
    {g: constants.TYPE_SWEATER, y:490, x:936, width:50, height:50}
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
