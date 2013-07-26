/*
 * Crafting booth
 */

import animate;
import ui.View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.constants as c;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.WoolStorage as WoolStorage;
import src.CraftStorage as CraftStorage;
import src.util as util;
import src.Craft as Craft;
import src.debughack as dh;


exports = Class(ImageView, function (supr) {
    this.init = function _a_init(opts) {
        this.background = new Image({url: "resources/images/craft.png"});
        this.buttons = {};
        this.total = 0;

        opts = merge(opts, {
            autosize: true,
            image: this.background
        });

        supr(this, 'init', [opts]);

        this.selectedGarment = c.GARMENT_HAT;
        this.selectedColor = c.COLOR_WHITE;
        this.sessionWool = null;
        this.sessionCrafts = null;

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

        // creates a button on one of the regions defined at the bottom
        this.defaultButtonFactory = bind(this, function _a_defaultButtonFactory(region) {
            var commonOpts, opts, btn;
            commonOpts = {superview: this, click: false};
            opts = merge(merge({}, commonOpts), region);
            btn = new Button(opts);
            return btn;
        });

        // garment nav buttons
        this.garmentFactory = bind(this, function _a_garmentFactory(region) {
            var btn = this.defaultButtonFactory(region);
            btn.updateOpts({click: true});
            btn.on('InputSelect', function _a_onInputSelectGarment() {
                this.getSuperview().setGarment(this.getOpts().item);
            });
            return btn;
        });

        // buy garment buttons
        this.craftBuyFactory = bind(this, function _a_craftBuyFactory(region, i) {
            var me = this, btn;
            btn = this.defaultButtonFactory(region);
            btn.updateOpts({anchorX: btn.getOpts().width / 2,
                anchorY: 8,
                contrastIndex: i,
                click: false}); // these have their own noise

            btn.on('InputSelect', (function _a_onInputSelectCraftBuyClosure(_btn) {
                return function _a_onInputSelectCraftBuy() {
                    GC.app.audio.playBuyGarment();
                    me.buyCraft(_btn);
                };
            })(btn));

            this.animateCraft(btn);

            return btn;
        });

        // craftCount fields
        this.craftCountFactory = bind(this, function _a_craftCountFactory(region, i) {
            var screen = this, updateText, main, motif, contrast, btn;

            btn = this.defaultButtonFactory(region);
            btn.updateOpts({contrastIndex: i});

            return btn;
        });

        /*
         * reset crafting state
         */
        this.startCrafting = bind(this, function() {
            dh.pre_startCrafting();

            var btn, color, count, i, money;

            this.sessionWool = GC.app.player.wool.copy({persist: false});
            this.sessionCrafts = GC.app.player.crafts.copy({persist: false});

            // put counts in all the wool control buttons
            for (i = 0; i < this.buttons.colorCount.length; i++) {
                btn = this.buttons.colorCount[i];
                color = btn.getOpts().item;
                count = this.sessionWool.get(color).count;
                btn.setText(count);
            }

            this.setGarment(c.GARMENT_HAT);
            this.setColor(c.COLOR_WHITE);

            // if wool changes, update the count in the appropriate wool
            // control button
            this.sessionWool.on('wool:update', bind(this, function _a_onWoolUpdate(clabel, item) {
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
        this.on('craft:start', this.startCrafting);

        this.on('ViewWillAppear', bind(this, function _a_onViewWillAppear() {
            this.muteButton.setMuted({silent: true});
        }));

        /*
         * animate a gentle swaying of the crafts
         */
        this.animateCraft = bind(this, function _a_animateCraft(btn) {
            var wiggle, stepSize = (Math.random() * 15) + 10;
            // 50% of the time, stay put
            var odd = parseInt(stepSize.toFixed(3).substr(4, 1), 10) % 2 == 1;
            if (odd) {
                wiggle = 0;
            } else {
                wiggle = c.WIGGLE_RADIANS / 2;
            }
            animate(btn).clear().now({r: -1 * wiggle}, 20000 / stepSize, animate.easeIn
                ).then({r: wiggle}, 20000 / stepSize, animate.easeIn
                ).then(bind(this, this.animateCraft, btn));
        });


        this.on('craft:addDollars', function _a_onCraftAddDollars(amount) {
            this.total += amount;
            GC.app.player.addCoins(amount);
            _cleanUI();
        });

        this.updateTotal = bind(this, function _a_updateTotal() {
            // 0.0001 adjustment because there is an apparent bug with (0).toFixed()
            // -- it sometimes appears negative, most likely due to floating
            // point error.
            this.totalButton.setText('Total: $' + (this.total + 0.0001).toFixed(2));
        });

        /*
         * => new Craft() from current garment, current color, and an index
         * into the craft buy control columns
         */
        this.craftByIndex = bind(this, function _a_craftByIndex(contrastIndex) {
            var contrast = colorPairings[this.selectedColor.label][contrastIndex];
            return new Craft(this.selectedGarment, this.selectedColor, contrast);
        });

        /*
         * Update the craft counts boxes based on current selections and
         * inventory
         */
        this.updateCraftCounts = bind(this, function _a_updateCraftContents() {
            var btn1, i, sc = this.sessionCrafts;
            i = this.buttons.craftCount.length;
            while (i--) {
                btn1 = this.buttons.craftCount[i];

                currentCraft = this.craftByIndex(i);
                count = sc.get(currentCraft).count;

                btn1.setText(count);
            }
        });

        this.updateCraftBuyButtons = bind(this, function _a_updateCraftBuyButtons() {
            var i, res, contrast, garment, main, costs, sw, cbbtn;
            garment = this.selectedGarment;
            main = this.selectedColor;
            sw = this.sessionWool;

            i = colorPairings[main.label].length;
            while (i--) {
                cbbtn = this.buttons.craftBuy[i];
                currentCraft = this.craftByIndex(i);
                costs = currentCraft.cost();
                contrast = currentCraft.colors.contrast;

                if (costs[0].amount > sw.get(main).count || costs[1].amount > sw.get(contrast).count) {
                    res = 'resources/images/' + garment.label + '-disabled.png';
                    cbbtn.updateOpts({opacity: 0.9});
                } else {
                    res = 'resources/images/' + garment.label + '-' + main.label + '-' + contrast.label + '.png';
                    cbbtn.updateOpts({opacity: 1.0});
                }

                cbbtn.setImage(res);
            }
        });

        this.updateGarmentPattern = bind(this, function _a_updateGarmentPattern() {
            this.garmentPattern.setImage('resources/images/craft-patterns-' + this.selectedColor.label + '.png');
        });

        /*
         * reset the UI to the view corresponding to the current state
         */
        var _cleanUI = bind(this, function _a_cleanUI() {
            this.updateCraftBuyButtons();
            this.updateGarmentPattern();
            this.updateCraftCounts();
            this.updateTotal();
        });

        // clear out the ui image and replace it when color changes
        this.changeColor = bind(this, function _a_changeColo() {
            _cleanUI();
        });

        // clear out the ui image and replace it when garment changes
        this.changeGarment = bind(this, function _a_changeGarment() {
            _cleanUI();
        });

        // user tries to buy a craft by clicking on a craft button
        this.buyCraft = bind(this, function _a_buyCraft(btn) {
            var main = this.selectedColor,
                garment = this.selectedGarment,
                contrast, craft, costs,
                sw = this.sessionWool,
                sc = this.sessionCrafts,
                sufficient;
            contrast = colorPairings[main.label][btn.getOpts().contrastIndex];
            craft = new Craft(garment, main, contrast);
            costs = craft.cost();

            if (main === contrast) {
                sufficient = sw.get(main).count >= costs[0].amount + costs[1].amount;
            } else {
                sufficient = (sw.get(main).count >= costs[0].amount && sw.get(contrast).count >= costs[1].amount);
            }

            if (sufficient) {
                sc.addCraft(craft);
                this.emit('craft:addDollars', craft.dollars());
                sw.addWool(main, -1 * costs[0].amount);
                sw.addWool(contrast, -1 * costs[1].amount);
            }
            _cleanUI();
        });

        // The garment colors on the right update when you change color. This
        // is a single image that overlays the entire screen.
        var gp = this.garmentPattern = this.defaultButtonFactory(craftScreenRegions.garmentPattern);

        // load up alllll dem buttons
        var kinds = ["colorCount", "garment", "cost", "craftCount",
            "craftBuy"];
        for (kk = 0; kk < kinds.length; kk++) {
            var k = kinds[kk], factory, regions, j, region, btn;

            regions = craftScreenRegions[k];
            factory = bind(this, this[regions.factory] || this.defaultButtonFactory);
            this.buttons[k] = [];
            for (j = 0; j < regions.length; j++) {
                this.buttons[k].push(factory(regions[j], j));
            }
        }

        this.totalButton = this.defaultButtonFactory(craftScreenRegions.total);

        this.shopNameButton = this.defaultButtonFactory(craftScreenRegions.shopName);
        this.shopNameButton.setText(util.choice(c.SHOP_NAMES));

        this.backButton = this.defaultButtonFactory(craftScreenRegions.backButton);
        this.backButtonLabel = this.defaultButtonFactory(craftScreenRegions.backButtonLabel);

        var _back = bind(this, function () {
            this.emit('craft:back');
        });
        this.backButton.on('InputSelect', _back);
        this.backButtonLabel.on('InputSelect', _back);

        muteOpts = {
            superview: this,
            x: 936,
            y: 16,
            width: 48,
            height: 48
        };
        this.muteButton = new MuteButton(muteOpts);

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
total: {y:504, x:144, width:322, height:48, text: 'Total: 0'},
shopName: {y:72, x:136, width:750, height:42},
garmentPattern: {x: 0, y: 0, width: 1024, height: 576},
backButton: {x: 0, y: 0, width: 80, height: 80},
backButtonLabel: {x: 80, y: 15, width: 150, height: 50, text: 'Return'}
}

craftScreenRegions.garment.factory = 'garmentFactory';
craftScreenRegions.craftBuy.factory = 'craftBuyFactory';
craftScreenRegions.craftCount.factory = 'craftCountFactory';
