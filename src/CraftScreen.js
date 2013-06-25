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
        this.background = new Image({url: "resources/images/craft-dev.png"});

        console.log(this.background.getImageData());

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
            for (var i = 0; i < this.colorButtons.length; i++) {
                var btn = this.colorButtons[i];
                var color = btn.getOpts().item;
                btn.setText(GC.app.inventory.wool[color.label]);
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

        // clear out the ui image and replace it when garment changes, and,
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
        for (var i = 0; i < craftScreenRegions.colors.length; i++) {
            var region = craftScreenRegions.colors[i];
            var btn = _buttonFromRegion(region);
            btn.on('InputSelect', function () {
                this.getSuperview().setColor(this.getOpts().item);
            });

            this.colorButtons.push(btn);
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
    {item: c.COLOR_WHITE, y:170, x:39, width:50, height:50},
    {item: c.COLOR_RED, y:234, x:39, width:50, height:50},
    {item: c.COLOR_BLUE, y:362, x:39, width:50, height:50},
    {item: c.COLOR_YELLOW, y:426, x:39, width:50, height:50},
    {item: c.COLOR_BLACK, y:490, x:39, width:50, height:50}
    ],
costs: [
    {item: {_1: c.GARMENT_HAT}, y:152, x:266, width:50, height:50},
    {item: {_2: c.GARMENT_HAT}, y:152, x:323, width:50, height:50},

    {item: {_1: c.GARMENT_MITTEN}, y:152, x:395, width:50, height:50},
    {item: {_2: c.GARMENT_MITTEN}, y:152, x:452, width:50, height:50},

    {item: {_1: c.GARMENT_SOCK}, y:152, x:522, width:50, height:50},
    {item: {_2: c.GARMENT_SOCK}, y:152, x:579, width:50, height:50},

    {item: {_1: c.GARMENT_SCARF}, y:152, x:651, width:50, height:50},
    {item: {_2: c.GARMENT_SCARF}, y:152, x:708, width:50, height:50},

    {item: {_1: c.GARMENT_SWEATER}, y:152, x:779, width:50, height:50},
    {item: {_2: c.GARMENT_SWEATER}, y:152, x:836, width:50, height:50}
    ],
garments: [
    {item: c.GARMENT_HAT, y:234, x:936, width:50, height:50},
    {item: c.GARMENT_MITTEN, y:298, x:936, width:50, height:50},
    {item: c.GARMENT_SOCK, y:362, x:936, width:50, height:50},
    {item: c.GARMENT_SCARF, y:426, x:936, width:50, height:50},
    {item: c.GARMENT_SWEATER, y:490, x:936, width:50, height:50}
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
