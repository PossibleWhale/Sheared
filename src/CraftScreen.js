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
import src.WoolCounter as WoolCounter;


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

        this.wool = GC.app.player.wool;
        this.crafts = GC.app.player.crafts;

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 283,
            y: 0,
            storage: this.wool
        });

        this.selectedGarment = c.GARMENT_HAT;

        var craftScreen = this;

        this.on('craft:start', this.startCrafting);

        this.on('ViewWillAppear', bind(this, function _a_onViewWillAppear() {
            this.muteButton.setMuted({silent: true});
        }));

        this.on('craft:addDollars', function _a_onCraftAddDollars(amount) {
            this.total += amount;
            GC.app.player.addCoins(amount);
            _cleanUI();
        });

        /*
         * Update craft count boxes based on current selections and inventory
         */
        this.updateCraftCounts = bind(this, function _a_updateCraftContents() {
            var btn1, i;
            i = this.buttons.craftCount.length;
            while (i--) {
                btn1 = this.buttons.craftCount[i];

                currentCraft = this.craftByIndex(i);
                count = this.crafts.get(currentCraft).count;

                btn1.setText(count);
            }
        });

        this.updateCraftBuyButtons = bind(this, function _a_updateCraftBuyButtons() {
            var i, res, contrast, garment, main, costs, cbbtn;
            garment = this.selectedGarment;
            main = this.selectedColor;

            i = colorPairings[main.label].length;
            while (i--) {
                cbbtn = this.buttons.craftBuy[i];
                currentCraft = this.craftByIndex(i);
                costs = currentCraft.cost();
                contrast = currentCraft.colors.contrast;

                if (costs[0].amount > this.wool.get(main).count || costs[1].amount > this.wool.get(contrast).count) {
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

        // load up alllll dem buttons
        var kinds = ["garment", "cost", "craftCount", "craftBuy"];
        for (kk = 0; kk < kinds.length; kk++) {
            var k = kinds[kk], factory, rgns, j, region, btn;

            rgns = regions[k];
            factory = bind(this, this[rgns.factory] || this.defaultButtonFactory);
            this.buttons[k] = [];
            for (j = 0; j < rgns.length; j++) {
                this.buttons[k].push(factory(rgns[j], j));
            }
        }

        this.totalButton = this.defaultButtonFactory(regions.total);

        this.shopNameButton = this.defaultButtonFactory(regions.shopName);
        this.shopNameButton.setText(util.choice(c.SHOP_NAMES));

        this.backButton = this.defaultButtonFactory(regions.backButton);
        this.backButtonLabel = this.defaultButtonFactory(regions.backButtonLabel);
        util.reissue(this.backButton, 'InputSelect', this, 'craft:back');
        util.reissue(this.backButtonLabel, 'InputSelect', this, 'craft:back');

        this.store = this.defaultButtonFactory(regions.store);
        util.reissue(this.store, 'InputSelect', this, 'craft:store');

        muteOpts = {
            superview: this,
            x: 936,
            y: 16,
            width: 48,
            height: 48
        };
        this.muteButton = new MuteButton(muteOpts);

        this.on('craftScreen:changeGarment', this.changeGarment);
    };

    /*
     * reset the UI to the view corresponding to the current state
     */
    var _cleanUI = function _a_cleanUI() {
        this.updateCraftBuyButtons();
        this.updateGarmentPattern();
        this.updateCraftCounts();
        this.updateTotal();
    };

    // creates a button on one of the regions defined at the bottom
    this.defaultButtonFactory = function _a_defaultButtonFactory(region) {
        var commonOpts, opts, btn;
        commonOpts = {superview: this, click: false};
        opts = merge(merge({}, commonOpts), region);
        btn = new Button(opts);
        return btn;
    };

    // garment nav buttons
    this.garmentFactory = function _a_garmentFactory(region) {
        var btn = this.defaultButtonFactory(region);
        btn.updateOpts({click: true});
        btn.on('InputSelect', function _a_onInputSelectGarment() {
            this.getSuperview().setGarment(this.getOpts().item);
        });
        return btn;
    };

    // buy garment buttons
    this.craftBuyFactory = function _a_craftBuyFactory(region, i) {
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
    };

    // craftCount fields
    this.craftCountFactory = function _a_craftCountFactory(region, i) {
        var screen = this, updateText, main, motif, contrast, btn;

        btn = this.defaultButtonFactory(region);
        btn.updateOpts({contrastIndex: i});

        return btn;
    };

    // clear out the ui image and replace it when garment changes
    this.changeGarment = function _a_changeGarment() {
        _cleanUI();
    };

    // user tries to buy a craft by clicking on a craft button
    this.buyCraft = function _a_buyCraft(btn) {
        var garment = this.selectedGarment, main, contrast, craft, costs,
            sufficient;
        craft = new Craft(garment, main, contrast);
        costs = craft.cost();

        if (main === contrast) {
            sufficient = this.wool.get(main).count >= costs[0].amount + costs[1].amount;
        } else {
            sufficient = (this.wool.get(main).count >= costs[0].amount && this.wool.get(contrast).count >= costs[1].amount);
        }

        if (sufficient) {
            this.crafts.addCraft(craft);
            this.emit('craft:addDollars', craft.dollars());
            this.wool.addWool(main, -1 * costs[0].amount);
            this.wool.addWool(contrast, -1 * costs[1].amount);
            this.woolCounts.update();
        }
        _cleanUI();
    };

    // user selected a new garment
    this.setGarment = function _a_setGarment(garment) {
        this.selectedGarment = garment;
        this.emit('craftScreen:changeGarment');
    };

    /*
     * reset crafting state
     */
    this.startCrafting = function _a_startCrafting() {
        dh.pre_startCrafting();

        var btn, color, count, i, money;

        this.setGarment(c.GARMENT_HAT);

    };

    // display the new cash total in the box
    this.updateTotal = bind(this, function _a_updateTotal() {
        // 0.0001 adjustment because there is an apparent bug with (0).toFixed()
        // -- it sometimes appears negative, most likely due to floating
        // point error.
        this.totalButton.setText('' + this.total + ' Eweros');
    });

    /*
     * animate a gentle swaying of the crafts
     */
    this.animateCraft = function _a_animateCraft(btn) {
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

var regions = {
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
        [ // white
            {item: {}, x: 182, y: 125, width: 60, height: 60},
            {item: {}, x: 282, y: 125, width: 60, height: 60},
            {item: {}, x: 382, y: 125, width: 60, height: 60},
            {item: {}, x: 482, y: 125, width: 60, height: 60}
        ],
        [ // red
            {item: {}, x: 182, y: 191, width: 60, height: 60},
            {item: {}, x: 282, y: 191, width: 60, height: 60},
            {item: {}, x: 382, y: 191, width: 60, height: 60},
            {item: {}, x: 482, y: 191, width: 60, height: 60}
        ],
        [ // blue
            {item: {}, x: 182, y: 257, width: 60, height: 60},
            {item: {}, x: 282, y: 257, width: 60, height: 60},
            {item: {}, x: 382, y: 257, width: 60, height: 60},
            {item: {}, x: 482, y: 257, width: 60, height: 60}
        ],
        [ // yellow
            {item: {}, x: 182, y: 323, width: 60, height: 60},
            {item: {}, x: 282, y: 323, width: 60, height: 60},
            {item: {}, x: 382, y: 323, width: 60, height: 60},
            {item: {}, x: 482, y: 323, width: 60, height: 60}
        ],
        [ // black
            {item: {}, x: 182, y: 389, width: 60, height: 60},
            {item: {}, x: 282, y: 389, width: 60, height: 60},
            {item: {}, x: 382, y: 389, width: 60, height: 60},
            {item: {}, x: 482, y: 389, width: 60, height: 60}
        ]
    ],
craftStars: [
        [ // white
            {item: {}, x: 242, y: 125, width: 30, height: 60},
            {item: {}, x: 342, y: 125, width: 30, height: 60},
            {item: {}, x: 442, y: 125, width: 30, height: 60},
            {item: {}, x: 542, y: 125, width: 30, height: 60}
        ],
        [ // red
            {item: {}, x: 242, y: 191, width: 30, height: 60},
            {item: {}, x: 342, y: 191, width: 30, height: 60},
            {item: {}, x: 442, y: 191, width: 30, height: 60},
            {item: {}, x: 542, y: 191, width: 30, height: 60}
        ],
        [ // blue
            {item: {}, x: 242, y: 257, width: 30, height: 60},
            {item: {}, x: 342, y: 257, width: 30, height: 60},
            {item: {}, x: 442, y: 257, width: 30, height: 60},
            {item: {}, x: 542, y: 257, width: 30, height: 60}
        ],
        [ // yellow
            {item: {}, x: 242, y: 323, width: 30, height: 60},
            {item: {}, x: 342, y: 323, width: 30, height: 60},
            {item: {}, x: 442, y: 323, width: 30, height: 60},
            {item: {}, x: 542, y: 323, width: 30, height: 60}
        ],
        [ // black
            {item: {}, x: 242, y: 389, width: 30, height: 60},
            {item: {}, x: 342, y: 389, width: 30, height: 60},
            {item: {}, x: 442, y: 389, width: 30, height: 60},
            {item: {}, x: 542, y: 389, width: 30, height: 60}
        ]
    ],
total: {y:521, x:452, width:120, height:26, text: '0 Eweros'},
store: {x: 133, y: 496, width: 200, height: 80},
shopName: {y:72, x:136, width:750, height:42},
backButton: {x: 0, y: 0, width: 80, height: 80},
backButtonLabel: {x: 80, y: 15, width: 150, height: 50, text: 'Return'}
}

regions.garment.factory = 'garmentFactory';
regions.craftBuy.factory = 'craftBuyFactory';
regions.craftCount.factory = 'craftCountFactory';
