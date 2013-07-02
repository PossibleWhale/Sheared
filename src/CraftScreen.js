/*
 * Crafting booth
 */

import ui.View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.constants as c;
import src.Button as Button;
import src.Inventory as Inventory;
import src.util as util;
import src.Craft as Craft;


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        this.background = new Image({url: "resources/images/craft.png"});
        this.buttons = {};

        opts = merge(opts, {
            autosize: true,
            image: this.background
        });

        supr(this, 'init', [opts]);

        this.selectedGarment = c.GARMENT_HAT;
        this.selectedColor = c.COLOR_WHITE;
        this.playerInventory = null;
        this.sessionInventory = null;

        var craftScreen = this;

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

        this.defaultButtonFactory = bind(this, function (region) {
            var commonOpts, opts, btn;
            commonOpts = {clip: true, superview: this};
            opts = merge(merge({}, commonOpts), region);
            btn = new Button(opts);
            return btn;
        });

        // color buttons
        this.colorFactory = bind(this, function (region) {
            var btn = this.defaultButtonFactory(region);
            btn.on('InputSelect', function () {
                this.getSuperview().setColor(this.getOpts().item);
            });
            return btn;
        });

        // garment buttons
        this.garmentFactory = bind(this, function (region) {
            var btn = this.defaultButtonFactory(region);
            btn.on('InputSelect', function () {
                this.getSuperview().setGarment(this.getOpts().item);
            });
            return btn;
        });

        // buy garment
        this.craftBuyFactory = bind(this, function (region, i) {
            var me = this, btn;
            btn = this.defaultButtonFactory(region);
            btn.getOpts().contrastIndex = i;

            btn.imageLayer = new ImageView({
                superview: btn,
                width: btn.style.width,
                height: btn.style.height
            });

            me = this;
            btn.on('InputSelect', (function (_btn) {
                return function () {
                    me.buyCraft(_btn);
                };
            })(btn));
            return btn;
        });

        /*
         * reset crafting state
         */
        this.startCrafting = bind(this, function() {

// if (!GC.app.woolhack) {
// GC.app.woolhack = true;
// GC.app.player.inventory.wool.add({color: 'white', count: 100});
// GC.app.player.inventory.wool.add({color: 'red', count: 100});
// GC.app.player.inventory.wool.add({color: 'yellow', count: 100});
// GC.app.player.inventory.wool.add({color: 'blue', count: 100});
// GC.app.player.inventory.wool.add({color: 'black', count: 100});
// }
            this.playerInventory = GC.app.player.inventory;

            this.sessionInventory = this.playerInventory.copy();

            var si = this.sessionInventory, btn, color, count, i;

            for (i = 0; i < this.buttons.colorCount.length; i++) {
                btn = this.buttons.colorCount[i];
                color = btn.getOpts().item;
                count = si.wool.get(color.label).count;
                btn.setText(count);
            }
            this.setGarment(c.GARMENT_HAT);
            this.setColor(c.COLOR_WHITE);

            si.on('inventory:woolUpdate', bind(this, function (clabel, item) {
                i = c.colors.length;
                while (i--) {
                    btn = this.buttons.colorCount[i];
                    if (btn.getOpts().item.label === item.color) {
                        btn.setText(item.count);
                        break;
                    }
                }
            }));

        });


        this.updateCraftBuyButtons = bind(this, function () {
            var i, res, contrast, garment, main, costs, si, cbbtn;
            garment = this.selectedGarment, main = this.selectedColor;
            si = this.sessionInventory;

            i = colorPairings[main.label].length;
            while (i--) {
                cbbtn = this.buttons.craftBuy[i];
                contrast = colorPairings[main.label][i];

                costs = new Craft(garment, main, contrast).cost();
                res = 'resources/images/' + garment.label + '-' + main.label + '-' + contrast.label + '.png';
                if (costs[0].amount > si.wool.get(main.label).count || costs[1].amount > si.wool.get(contrast.label).count) {
                    cbbtn.updateOpts({opacity: 0.3});
                } else {
                    cbbtn.updateOpts({opacity: 1.0});
                }

                cbbtn.imageLayer.setImage(new Image({url: res}));
            }
        });

        this.updateGarmentPattern = bind(this, function () {
            this.garmentPattern.imageLayer.setImage('resources/images/craft-patterns-' + this.selectedColor.label + '.png');
        });

        /*
         * reset the UI to the view corresponding to the current state
         */
        var _cleanUI = bind(this, function() {
            this.updateCraftBuyButtons();
            this.updateGarmentPattern();
        });

        // clear out the ui image and replace it when color changes
        this.changeColor = bind(this, function () {
            _cleanUI();
        });

        // clear out the ui image and replace it when garment changes
        this.changeGarment = bind(this, function () {
            _cleanUI();
        });

        // user tries to buy a craft by clicking on a craft button
        this.buyCraft = bind(this, function (btn) {
            var main = this.selectedColor, 
                garment = this.selectedGarment, 
                contrast, craft, costs,
                si = this.sessionInventory;
            contrast = colorPairings[main.label][btn.getOpts().contrastIndex];
            craft = new Craft(garment, main, contrast);
            costs = craft.cost();

            if (si.wool.get(main.label).count >= costs[0].amount &&
                si.wool.get(contrast.label).count >= costs[1].amount) {

                si.addCraft(craft);
                si.addWool(main, -1 * costs[0].amount);
                si.addWool(contrast, -1 * costs[1].amount);

            }
            _cleanUI();
        });

        this.on('craft:start', this.startCrafting);

        var gp = this.garmentPattern = this.defaultButtonFactory(craftScreenRegions.garmentPattern);
        gp.imageLayer = new ImageView({width: gp.style.width, height: gp.style.height, superview: gp});

        // load up alllll dem buttons
        var kinds = ["colorCount", "color", "garment", "cost", "craftCount",
            "craftBuy", "chalkboard", "refund"];
        for (kk = 0; kk < kinds.length; kk++) {
            var k = kinds[kk], factory, regions, j, region, btn;

            regions = craftScreenRegions[k];
            factory = bind(this, this[regions.factory] || this.defaultButtonFactory);
            this.buttons[k] = [];
            for (j = 0; j < regions.length; j++) {
                this.buttons[k].push(factory(regions[j], j));
            }
        }

        this.finishButton = this.defaultButtonFactory(craftScreenRegions.finish);
        this.finishButton.setText("Finish");
        this.finishButton.on('InputSelect', bind(this, function () {
            GC.app.player.inventory = this.sessionInventory.copy();
            // TODO - localStorage
            GC.app.rootView.popAll();
        }));

        this.totalButton = this.defaultButtonFactory(craftScreenRegions.total);
        this.totalButton.setText("Total: ");

        this.shopNameButton = this.defaultButtonFactory(craftScreenRegions.shopName);
        this.shopNameButton.setText(util.choice(c.SHOP_NAMES));

        this.on('craftScreen:changeColor', this.changeColor);
        this.on('craftScreen:changeGarment', this.changeGarment);
    };
});


// this is how the buttons along the top of the craft screen are colored
// depending on the base color you selected
var colorPairings = {
    white: [c.COLOR_WHITE, c.COLOR_RED, c.COLOR_BLUE, c.COLOR_YELLOW, c.COLOR_BLACK],
    red: [c.COLOR_RED, c.COLOR_WHITE, c.COLOR_BLUE, c.COLOR_YELLOW, c.COLOR_BLACK],
    blue: [c.COLOR_BLUE, c.COLOR_WHITE, c.COLOR_RED, c.COLOR_YELLOW, c.COLOR_BLACK],
    yellow: [c.COLOR_YELLOW, c.COLOR_WHITE, c.COLOR_RED, c.COLOR_BLUE, c.COLOR_BLACK],
    black: [c.COLOR_BLACK, c.COLOR_WHITE, c.COLOR_RED, c.COLOR_BLUE, c.COLOR_YELLOW]
};

var craftScreenRegions = {
color: [
    {item: c.COLOR_WHITE, y:146, x:34, width:58, height:66},
    {item: c.COLOR_RED, y:228, x:34, width:58, height:66},
    {item: c.COLOR_BLUE, y:310, x:34, width:58, height:66},
    {item: c.COLOR_YELLOW, y:392, x:34, width:58, height:66},
    {item: c.COLOR_BLACK, y:474, x:34, width:58, height:66}
    ],
colorCount: [
    {item: c.COLOR_WHITE, y:192, x:34, width:58, height:20},
    {item: c.COLOR_RED, y:274, x:34, width:58, height:20},
    {item: c.COLOR_BLUE, y:356, x:34, width:58, height:20},
    {item: c.COLOR_YELLOW, y:438, x:34, width:58, height:20},
    {item: c.COLOR_BLACK, y:520, x:34, width:58, height:20}
    ],
garment: [
    {item: c.GARMENT_HAT, y:146, x:930, width:60, height:66},
    {item: c.GARMENT_MITTEN, y:228, x:930, width:60, height:66},
    {item: c.GARMENT_SOCK, y:310, x:930, width:60, height:66},
    {item: c.GARMENT_SCARF, y:392, x:930, width:60, height:66},
    {item: c.GARMENT_SWEATER, y:474, x:930, width:60, height:66}
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
    {item: {_1: null}, y:328, x:142, width:98, height:32},
    {item: {_1: null}, y:328, x:302, width:98, height:32},
    {item: {_1: null}, y:328, x:462, width:98, height:32},
    {item: {_1: null}, y:328, x:622, width:98, height:32},
    {item: {_1: null}, y:328, x:782, width:98, height:32}
    ],
craftBuy: [
    {item: {_1: null}, y:224, x:142, width:98, height:96},
    {item: {_1: null}, y:224, x:302, width:98, height:96},
    {item: {_1: null}, y:224, x:462, width:98, height:96},
    {item: {_1: null}, y:224, x:622, width:98, height:96},
    {item: {_1: null}, y:224, x:782, width:98, height:96}
    ],
chalkboard: [
    {y:376, x:148, width:88, height:54},
    {y:376, x:308, width:88, height:54},
    {y:376, x:468, width:88, height:54},
    {y:376, x:628, width:88, height:54},
    {y:376, x:788, width:88, height:54}
    ],
refund: [
    {y:442, x:144, width:96, height:44},
    {y:442, x:304, width:96, height:44},
    {y:442, x:464, width:96, height:44},
    {y:442, x:624, width:96, height:44},
    {y:442, x:784, width:96, height:44}
    ],
finish: {y:504, x:560, width:322, height:48},
total: {y:504, x:144, width:322, height:48},
shopName: {y:78, x:136, width:750, height:44},
garmentPattern: {x: 0, y: 0, width: 1024, height: 576}
}

craftScreenRegions.color.factory = 'colorFactory';
craftScreenRegions.garment.factory = 'garmentFactory';
craftScreenRegions.craftBuy.factory = 'craftBuyFactory';
