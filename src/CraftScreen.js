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
        this.background = new Image({url: "resources/images/craft.png"});
        this.buttons = {};

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
            for (var i = 0; i < this.buttons.colorCount.length; i++) {
                var btn = this.buttons.colorCount[i];
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

        // load up alllll dem buttons
        var kinds = ["color", "colorCount", "garment", "cost", "craftCount",
            "chalkboard", "refund"];
        for (var i = 0; i < kinds.length; i++) {
            var k = kinds[i];
            var regions = craftScreenRegions[k];
            this.buttons[k] = [];
            for (var j = 0; j < regions.length; j++) {
                var region = regions[j];
                var btn = _buttonFromRegion(region);
                this.buttons[k].push(btn);
            }
        }

        // color buttons
        for (var i = 0; i < this.buttons.color.length; i++) {
            var btn = this.buttons.color[i];
            btn.on('InputSelect', function () {
                this.getSuperview().setColor(this.getOpts().item);
            });
        }

        // garment buttons
        for (var i = 0; i < this.buttons.garment.length; i++) {
            var btn = this.buttons.garment[i];
            btn.on('InputSelect', function () {
                this.getSuperview().setGarment(this.getOpts().item);
            });
        }

        this.finishButton = _buttonFromRegion(craftScreenRegions.finish);
        this.finishButton.setText("Finish");
        this.finishButton.on('InputSelect', function () {
            GC.app.rootView.pop();
        });
        this.totalButton = _buttonFromRegion(craftScreenRegions.total);
        this.totalButton.setText("Total: $$$");
        this.shopNameButton = _buttonFromRegion(craftScreenRegions.shopName);
        this.shopNameButton.setText("$SHOP_NAME");

        this.on('craftScreen:changeColor', this.changeColor);
        this.on('craftScreen:changeGarment', this.changeGarment);
    };
});


var craftScreenRegions = {
color: [
    {item: c.COLOR_WHITE, y:148, x:40, width:48, height:60},
    {item: c.COLOR_RED, y:230, x:40, width:48, height:60},
    {item: c.COLOR_BLUE, y:312, x:40, width:48, height:60},
    {item: c.COLOR_YELLOW, y:394, x:40, width:48, height:60},
    {item: c.COLOR_BLACK, y:476, x:40, width:48, height:60}
    ],
colorCount: [
    {item: c.COLOR_WHITE, y:208, x:40, width:48, height:22},
    {item: c.COLOR_RED, y:290, x:40, width:48, height:22},
    {item: c.COLOR_BLUE, y:372, x:40, width:48, height:22},
    {item: c.COLOR_YELLOW, y:454, x:40, width:48, height:22},
    {item: c.COLOR_BLACK, y:536, x:40, width:48, height:22}
    ],
garment: [
    {item: c.GARMENT_HAT, y:148, x:930, width:58, height:60},
    {item: c.GARMENT_MITTEN, y:230, x:930, width:58, height:60},
    {item: c.GARMENT_SOCK, y:312, x:930, width:58, height:60},
    {item: c.GARMENT_SCARF, y:394, x:930, width:58, height:60},
    {item: c.GARMENT_SWEATER, y:476, x:930, width:58, height:60}
    ],
cost: [
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
craftCount: [
    {item: {_1: null}, y:330, x:144, width:96, height:32},

    {item: {_1: null}, y:330, x:304, width:96, height:32},

    {item: {_1: null}, y:330, x:464, width:96, height:32},

    {item: {_1: null}, y:330, x:624, width:96, height:32},

    {item: {_1: null}, y:330, x:784, width:96, height:32}
    ],
chalkboard: [
    {y:378, x:148, width:88, height:54},
    {y:378, x:308, width:88, height:54},
    {y:378, x:468, width:88, height:54},
    {y:378, x:628, width:88, height:54},
    {y:378, x:788, width:88, height:54}
    ],
refund: [
    {y:448, x:144, width:96, height:32},
    {y:448, x:304, width:96, height:32},
    {y:448, x:464, width:96, height:32},
    {y:448, x:624, width:96, height:32},
    {y:448, x:784, width:96, height:32}
    ],
finish: {y:504, x:560, width:322, height:48},
total: {y:504, x:144, width:322, height:48},
shopName: {y:78, x:136, width:750, height:44}
}
