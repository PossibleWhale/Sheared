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
import src.util as util;
import src.Craft as Craft;
import src.debughack as dh;
import src.WoolCounter as WoolCounter;


exports = Class(ImageView, function (supr) {
    this.init = function _a_init(opts) {
        this.background = new Image({url: "resources/images/craft.png"});
        this.buttons = {};
        this.total = Math.round(GC.app.player.stats.get('coins').value, 0);

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

        this.largeCraft = [];

        this.tabs = new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            superview: this
        });

        // load up alllll dem buttons
        var kinds = ["garment", "craftBuy", "craftStars", "total", "store", "backButton"];
        for (kk = 0; kk < kinds.length; kk++) {
            var k = kinds[kk], factory, rgns, btnArray;

            rgns = regions[k];
            this._buildButtons(rgns, k);
        }

        muteOpts = {
            superview: this,
            x: 944,
            y: 0,
            width: 80,
            height: 80
        };
        this.muteButton = new MuteButton(muteOpts);

        this.on('craft:start', this.startCrafting);

        this.on('craft:changeGarment', this.changeGarment);

        this.on('ViewWillAppear', bind(this, function _a_onViewWillAppear() {
            this.muteButton.setMuted({silent: true});
            this.woolCounts.update();
            this.total = GC.app.player.stats.get('coins').value;
            this.updateTotal();
        }));

        this.on('craft:addDollars', function _a_onCraftAddDollars(amount) {
            this.total += amount;
            GC.app.player.addCoins(amount);
            this._cleanUI();
        });

    };

    /*
     * Search through subviews for this type of button and show it
     */
    this.showButtons = function _a_showButtons(kind, showFlag) {
        var all, i, current;

        if (showFlag === undefined) {
            showFlag = true;
        }

        all = this.getSubviews();
        i = all.length;
        while (i--) {
            current = all[i];
            if (!current.getOpts) {
                continue;
            }
            opts = current.getOpts();
            if (opts.buttonKind && opts.buttonKind === kind) {
                if (showFlag) {
                    current.show();
                } else {
                    current.hide();
                }
            }
        }
    };

    /*
     * Search through subviews for this type of button and hide it
     */
    this.hideButtons = function _a_hideButtons(kind) {
        return this.showButtons(kind, false);
    }

    /*
     * Do the looping button builds.
     */
    this._buildButtons = function _a_buildButtons(regionSet, kind) {
        var rgns = regionSet, k = kind;

        factory = bind(this, this[rgns.factory] || this.defaultButtonFactory);
        this.buttons[k] = [];
        if (!isArray(rgns[0])) {
            // 1d button row/column
            for (j = 0; j < rgns.length; j++) {
                this.buttons[k].push(factory(rgns[j], j));
            }
        } else {
            // 2d button grid
            for (i = 0; i < rgns.length; i++) {
                btnArray = [];
                for (j = 0; j < rgns[i].length; j++) {
                    btnArray.push(factory(rgns[i][j], i, j));
                }
                this.buttons[k].push(btnArray);
            }
        }
    };

    /*
     * Update craft count boxes based on current selections and inventory
     */
    this.updateCraftCounts = function _a_updateCraftContents() {
        return; // FIXME
        undefined('TODO');
    };

    // execute the callback once for each craft cell in the visible catalog
    this._loopCrafts = function _a_loopCrafts(callback) {
        var i, j, row;

        i = c.colors.length;
        while (i--) {
            row = this.buttons.craftBuy[i];
            j = row.length;
            while (j--) {
                callback(i, j);
            }
        }
    };

    this.updateCraftBuyButtons = function _a_updateCraftBuyButtons() {
        var garment = this.selectedGarment,
            starImage, disabledImage;

        starImage = new Image({url: 'resources/images/craft-star.png'});

        disabledImage = new Image({url: 'resources/images/' + garment.label + '-disabled-small.png'});

        this._loopCrafts(bind(this, function _a_loopCraftsForUpdate(i, j) {
            var starRow, star, cbRow, cb, res, contrast, main, player = GC.app.player;

            cbRow = this.buttons.craftBuy[i];
            starRow = this.buttons.craftStars[i];
            cb = cbRow[j];
            star = starRow[j];

            main = cb.getOpts().item.main;
            contrast = cb.getOpts().item.contrast;
            currentCraft = new Craft(this.selectedGarment, main, contrast);

            if (player.canCraft(currentCraft)) {
                cb.updateOpts({opacity: 1.0});
                res = new Image({url:
                    'resources/images/' + garment.label + '-' + main.label + '-' + contrast.label + '-small.png'
                });
                cb.setImage(res);
            } else {
                cb.updateOpts({opacity: 0.75});
                cb.setImage(disabledImage);
            }

            if (player.crafts.get(currentCraft).count >= 1) {
                star.setImage(starImage);
            } else {
                star.updateOpts({image: false});
            }
        }));
    };

    this.updateTabs = function _a_updateTabs() {
        this.tabs.setImage('resources/images/craft-' + this.selectedGarment.label + '.png');
    };

    /*
     * reset the UI to the view corresponding to the current state
     */
    this._cleanUI = function _a_cleanUI() {
        this.updateCraftBuyButtons();
        this.updateTabs();
        this.updateCraftCounts();
        this.updateTotal();
    };

    // creates a button on one of the regions defined at the bottom
    this.defaultButtonFactory = function _a_defaultButtonFactory(region, kind) {
        var commonOpts, opts, btn;
        commonOpts = {superview: this, click: false, buttonKind: kind};
        opts = merge(merge({}, commonOpts), region);
        btn = new Button(opts);
        return btn;
    };

    this.totalFactory = function _a_totalFactory(region) {
        this.totalButton = this.defaultButtonFactory(region, 'total');
    };

    this.backButtonFactory = function _a_backButtonFactory(region) {
        this.backButton = this.defaultButtonFactory(region, 'backButton');
        util.reissue(this.backButton, 'InputSelect', this, 'craft:back');
    };

    this.storeFactory = function _a_storeFactory(region) {
        this.store = this.defaultButtonFactory(region, 'store');
        util.reissue(this.store, 'InputSelect', this, 'craft:store');
    };

    // garment nav buttons
    this.garmentFactory = function _a_garmentFactory(region) {
        var btn = this.defaultButtonFactory(region, 'garment');
        btn.updateOpts({click: true});
        btn.on('InputSelect', function _a_onInputSelectGarment() {
            this.getSuperview().setGarment(this.getOpts().item);
        });
        return btn;
    };

    this.resetLargeCraft = function _a_clearLargeCraft() {
        if (this.largeCraft.length >= 1) {
            var sub = this.largeCraft.pop();
            util.assert(sub !== undefined);
            this.removeSubview(sub);
        }
    };

    this.nullLargeCraft = function _a_nullLargeCraft() {
        this.resetLargeCraft();
        var nullCraft = new Craft(this.selectedGarment, null, null);
        this.largeCraft.push(nullCraft);
        nullCraft.show({x: 585, y: 125, superview: this, enabled: true});
    };

    this.showLargeCraft = function _a_showLargeCraft(data) {
        var craft, isEnabled;

        this.resetLargeCraft();

        craft = new Craft(this.selectedGarment, data.main, data.contrast);
        isEnabled = GC.app.player.canCraft(craft);

        this.largeCraft.push(craft);
        craft.show({x: 585, y: 125, superview: this, enabled: isEnabled});

        craft.on('largeCraft:purchased', bind(this, function _a_largeCraftPurchased() {
            this.buyCraft(craft);
            this.showLargeCraft(data);
        }));
    };

    // buy garment buttons
    this.craftBuyFactory = function _a_craftBuyFactory(region, i, j) {
        var me = this, btn;
        btn = this.defaultButtonFactory(region, 'craftBuy');
        btn.updateOpts({anchorX: btn.getOpts().width / 2,
            anchorY: 8,
            click: false}); // these have their own noise

        btn.on('InputSelect', (function _a_onInputSelectCraftBuyClosure(_btn) {
            return function _a_onInputSelectCraftBuy() {
                me.showLargeCraft(_btn.getOpts().item);
            };
        })(btn));

        this.animateCraft(btn);

        return btn;
    };

    this.craftStarsFactory = function _a_craftStarFactory(region, i, j) {
        var me = this.btn;
        btn = this.defaultButtonFactory(region, 'craftStars');

        this.animateStar(btn);

        return btn;
    };

    // clear out the ui image and replace it when garment changes
    this.changeGarment = function _a_changeGarment() {
        this.nullLargeCraft();
        this._cleanUI();
    };

    // user tries to buy a craft by clicking on a craft button
    this.buyCraft = function _a_buyCraft(craft) {
        var garment = this.selectedGarment, costs;
        costs = craft.cost();

        if (GC.app.player.canCraft(craft)) {
            this.crafts.addCraft(craft);
            this.emit('craft:addDollars', craft.dollars());
            this.wool.addWool(craft.colors.main, -1 * costs[0].amount);
            this.wool.addWool(craft.colors.contrast, -1 * costs[1].amount);
            this.woolCounts.update();
        }
        this._cleanUI();
    };

    // user selected a new garment
    this.setGarment = function _a_setGarment(garment) {
        this.selectedGarment = garment;
        this.emit('craft:changeGarment');
    };

    /*
     * reset crafting state
     */
    this.startCrafting = function _a_startCrafting() {
        dh.pre_startCrafting();
        this.setGarment(c.GARMENT_HAT);
    };

    // display the new cash total in the box
    this.updateTotal = function _a_updateTotal() {
        // 0.0001 adjustment because there is an apparent bug with (0).toFixed()
        // -- it sometimes appears negative, most likely due to floating
        // point error.
        this.totalButton.setText('' + this.total /* + 0.0001).toFixed(2) */);
    };

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
        animate(btn).clear().now({r: -1 * wiggle}, 14000 / stepSize, animate.easeIn
            ).then({r: wiggle}, 14000 / stepSize, animate.easeIn
            ).then(bind(this, this.animateCraft, btn));
    };

    /*
     * make stars glow
     */
    this.animateStar = function _a_animateStar(btn) {
        var stepSize = (Math.random() * 15) + 10;
        animate(btn).clear().now({opacity: 0.4}, 18000 / stepSize, animate.easeIn
            ).then({opacity: 1}, 18000 / stepSize, animate.easeIn
            ).then(bind(this, this.animateStar, btn));
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
    {item: c.GARMENT_HAT,      y:113, x:33, width:137, height:64},
    {item: c.GARMENT_MITTEN,   y:183, x:33, width:137, height:64},
    {item: c.GARMENT_SOCK,     y:255, x:33, width:137, height:64},
    {item: c.GARMENT_SCARF,    y:327, x:33, width:137, height:64},
    {item: c.GARMENT_SWEATER,  y:399, x:33, width:137, height:64}
    ],
craftBuy: [
        [ // white
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_RED},    x: 182, y: 125, width: 60, height: 60},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_BLUE},   x: 282, y: 125, width: 60, height: 60},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_YELLOW}, x: 382, y: 125, width: 60, height: 60},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_BLACK},  x: 482, y: 125, width: 60, height: 60}
        ],
        [ // red
            {item: {main: c.COLOR_RED, contrast: c.COLOR_WHITE},    x: 182, y: 191, width: 60, height: 60},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_BLUE},     x: 282, y: 191, width: 60, height: 60},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_YELLOW},   x: 382, y: 191, width: 60, height: 60},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_BLACK},    x: 482, y: 191, width: 60, height: 60}
        ],
        [ // blue
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_WHITE},   x: 182, y: 257, width: 60, height: 60},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_RED},     x: 282, y: 257, width: 60, height: 60},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_YELLOW},  x: 382, y: 257, width: 60, height: 60},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_BLACK},   x: 482, y: 257, width: 60, height: 60}
        ],
        [ // yellow
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_WHITE}, x: 182, y: 323, width: 60, height: 60},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_RED},   x: 282, y: 323, width: 60, height: 60},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_BLUE},  x: 382, y: 323, width: 60, height: 60},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_BLACK}, x: 482, y: 323, width: 60, height: 60}
        ],
        [ // black
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_WHITE},   x: 182, y: 389, width: 60, height: 60},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_RED},     x: 282, y: 389, width: 60, height: 60},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_BLUE},    x: 382, y: 389, width: 60, height: 60},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_YELLOW},  x: 482, y: 389, width: 60, height: 60}
        ]
    ],
craftStars: [
        [ // white
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_RED},    x: 242, y: 125, width: 30, height: 60},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_BLUE},   x: 342, y: 125, width: 30, height: 60},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_YELLOW}, x: 442, y: 125, width: 30, height: 60},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_BLACK},  x: 542, y: 125, width: 30, height: 60}
        ],
        [ // red
            {item: {main: c.COLOR_RED, contrast: c.COLOR_WHITE},    x: 242, y: 191, width: 30, height: 60},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_BLUE},     x: 342, y: 191, width: 30, height: 60},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_YELLOW},   x: 442, y: 191, width: 30, height: 60},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_BLACK},    x: 542, y: 191, width: 30, height: 60}
        ],
        [ // blue
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_WHITE},   x: 242, y: 257, width: 30, height: 60},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_RED},     x: 342, y: 257, width: 30, height: 60},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_YELLOW},  x: 442, y: 257, width: 30, height: 60},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_BLACK},   x: 542, y: 257, width: 30, height: 60}
        ],
        [ // yellow
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_WHITE}, x: 242, y: 323, width: 30, height: 60},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_RED},   x: 342, y: 323, width: 30, height: 60},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_BLUE},  x: 442, y: 323, width: 30, height: 60},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_BLACK}, x: 542, y: 323, width: 30, height: 60}
        ],
        [ // black
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_WHITE},  x: 242, y: 389, width: 30, height: 60},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_RED},    x: 342, y: 389, width: 30, height: 60},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_BLUE},   x: 442, y: 389, width: 30, height: 60},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_YELLOW}, x: 542, y: 389, width: 30, height: 60}
        ]
    ],
total: [
    {y: 486, x: 432, width: 160, height: 80, text: '0'}
],
store: [
    {x: 143, y: 496, width: 180, height: 80, image: 'resources/images/button-general-store.png'}
],
backButton: [
    {x: 0, y: 0, width: 80, height: 80, image: 'resources/images/button-return.png'}
]
}

regions.garment.factory = 'garmentFactory';
regions.craftBuy.factory = 'craftBuyFactory';
regions.craftStars.factory = 'craftStarsFactory';
regions.total.factory = 'totalFactory';
regions.store.factory = 'storeFactory';
regions.backButton.factory = 'backButtonFactory';
