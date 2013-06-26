/*
 * Crafting booth
 */

"use strict";

import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

import src.constants as c;
import src.Button as Button;


exports = Class(ui.ImageView, function (supr) {
    this.init = function (opts) {
// GC.debug = true;
        this.background = new Image({url: "resources/images/craft-dev.png"});

        opts = merge(opts, {
            autosize: true,
            image: this.background
        });

        supr(this, 'init', [opts]);

        this.selectedGarment = c.GARMENT_HAT;
        this.selectedColor = c.COLOR_WHITE;

        // user selected a new color
        this.setColor = bind(this, function(color) {
            this.selectedColor = color;
            this.emit('craftScreen:changeColor');
        });

        // user selected a new garment
        this.setGarment = bind(this, function(garment) {
            this.selectedGarment = garment;
            this.emit('craftScreen:changeGarment');
        });

        /*
         * reset crafting state
         */
        this.startCrafting = bind(this, function() {
            for (var i = 0; i < this.colorCountButtons.length; i++) {
                var btn = this.colorCountButtons[i];
                var color = btn.getOpts().item;

// if (GC.debug) {
//     GC.app.player.inventory.wool[color.label] = 100;
// }
                btn.setText(GC.app.player.inventory.wool[color.label]);
            }
            this.setGarment(c.GARMENT_HAT);
            this.setColor(c.COLOR_WHITE);
        });

        /*
         * Retrieve the resource filename corresponding to the current
         * craftstand state
         */
        var _lookupUIResource = bind(this, function () {
            var garment = this.selectedGarment, color = this.selectedColor;
            return 'resources/images/craft-' + garment.label + '-' + color.label + '.png';
        });

        var uiImageOpts = bind(this, function () {
            return {superview: this.uiLayer, width: 1024, height: 576, canHandleEvents: false};
        });

        /*
         * reset the UI to the view corresponding to the current state
         */
        var _cleanUI = bind(this, function() {
            var res = _lookupUIResource();
            this.uiLayer.removeAllSubviews();
            new ui.ImageView(merge({image: res}, uiImageOpts()));
        });

        // clear out the ui image and replace it when color changes
        this.changeColor = bind(this, function () {
            _cleanUI();
        });

        // clear out the ui image and replace it when garment changes
        this.changeGarment = bind(this, function () {
            _cleanUI();
        });

        this.build();
    };

    this.build = function() {
        this.on('craft:start', this.startCrafting);

        this.uiLayer = new ui.View({superview: this, canHandleEvents: false});

        /*
         * convenience for doing this complicated merge
         */
        var _buttonFromRegion = bind(this, function (region) {
            var commonOpts = {clip: true, superview: this};
            var opts = merge(merge({}, commonOpts), region);
            return new Button(opts);
        });

        // color buttons
        this.colorButtons = [];
        this.colorCountButtons = [];
        for (var i = 0; i < craftScreenRegions.colors.length; i++) {
            var region = craftScreenRegions.colors[i];
            var btn = _buttonFromRegion(region);
            btn.on('InputSelect', function () {
                this.getSuperview().setColor(this.getOpts().item);
            });
            this.colorButtons.push(btn);

            var region2 = craftScreenRegions.colorCounts[i];
            var btn2 = _buttonFromRegion(region2);
            this.colorCountButtons.push(btn2);
        }

        // garment buttons
        var garmentButtons = [];
        for (var i = 0; i < craftScreenRegions.garments.length; i++) {
            var btn = _buttonFromRegion(craftScreenRegions.garments[i]);
            btn.on('InputSelect', function () {
                this.getSuperview().setGarment(this.getOpts().item);
            });

            garmentButtons.push(btn);
        }

        // cost buttons
        var costButtons = [];
        for (var i = 0; i < craftScreenRegions.costs.length; i++) {
            var btn = _buttonFromRegion(craftScreenRegions.costs[i]);
            costButtons.push(btn);
        }
        this.on('craftScreen:changeColor', this.changeColor);
        this.on('craftScreen:changeGarment', this.changeGarment);
    };
});


var craftScreenRegions = {
colors: [
    {item: c.COLOR_WHITE, y:148, x:40, width:48, height:60},
    {item: c.COLOR_RED, y:230, x:40, width:48, height:60},
    {item: c.COLOR_BLUE, y:312, x:40, width:48, height:60},
    {item: c.COLOR_YELLOW, y:394, x:40, width:48, height:60},
    {item: c.COLOR_BLACK, y:476, x:40, width:48, height:60}
    ],
colorCounts: [
    {item: c.COLOR_WHITE, y:208, x:40, width:48, height:22},
    {item: c.COLOR_RED, y:290, x:40, width:48, height:22},
    {item: c.COLOR_BLUE, y:372, x:40, width:48, height:22},
    {item: c.COLOR_YELLOW, y:454, x:40, width:48, height:22},
    {item: c.COLOR_BLACK, y:536, x:40, width:48, height:22}
    ],
garments: [
    {item: c.GARMENT_HAT, y:148, x:930, width:58, height:60},
    {item: c.GARMENT_MITTEN, y:230, x:930, width:58, height:60},
    {item: c.GARMENT_SOCK, y:312, x:930, width:58, height:60},
    {item: c.GARMENT_SCARF, y:394, x:930, width:58, height:60},
    {item: c.GARMENT_SWEATER, y:476, x:930, width:58, height:60}
    ],
costs: [
    {item: {_1: null}, y:152, x:168, width:48, height:50},

    {item: {_1: null}, y:152, x:300, width:48, height:50},
    {item: {_2: null}, y:152, x:356, width:48, height:50},

    {item: {_1: null}, y:152, x:460, width:48, height:50},
    {item: {_2: null}, y:152, x:516, width:48, height:50},

    {item: {_1: null}, y:152, x:620, width:48, height:50},
    {item: {_2: null}, y:152, x:674, width:48, height:50},

    {item: {_1: null}, y:152, x:780, width:48, height:50},
    {item: {_2: null}, y:152, x:836, width:48, height:50}
    ],
chalkboards: [ // FIXME
    {y:504, x:182, width:108, height:67},
    {y:504, x:346, width:108, height:67},
    {y:504, x:507, width:108, height:67},
    {y:504, x:826, width:108, height:67},
    {y:504, x:985, width:108, height:67}
    ],
refunds: [ // FIXME
    {y:597, x:191, width:40, height:40},
    {y:597, x:351, width:40, height:40},
    {y:597, x:410, width:40, height:40},
    {y:597, x:509, width:40, height:40},
    {y:597, x:571, width:40, height:40},
    ]
}
