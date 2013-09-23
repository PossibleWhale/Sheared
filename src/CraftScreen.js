/*
 * Crafting booth
 */

import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.geom.Point as Point;

import src.constants as c;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.util as util;
import src.debughack as dh;
import src.awardtracker as at;
import src.WoolCounter as WoolCounter;
import src.CoinLabel as CoinLabel;


exports = Class(View, function (supr) {
    this.init = function _a_init(opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        _myBGOpts = {
            canHandleEvents: false,
            superview: this
        };

        _footerBG = new ImageView(merge({
            x: 0,
            y: 0,
            height: 80,
            width: 1024,
            image: 'resources/images/background-header-wood.png'
        }, _myBGOpts));

        _centerBG = new ImageView(merge({
            x: 0,
            y: 80,
            height: 576-160,
            width: 1024,
            image: 'resources/images/background-wood.png'
        }, _myBGOpts));

        _headerBG = new ImageView(merge({
            x: 0,
            y: 496,
            height: 80,
            width: 1024,
            image: 'resources/images/background-footer-wood.png'
        }, _myBGOpts));

        this.coinsLabel = new CoinLabel({
            superview: this,
            x: 398,
            y: 504
        });

        this.buttons = {};
        this.player = opts.player || GC.app.player;
        this.wool = this.player.wool;
        this.crafts = this.player.crafts;

        this.selectedGarment = c.GARMENT_HAT;
        this.selectedCraft = null;

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 300,
            y: 8,
            storage: this.wool
        });

        this.craftHighlight = new ImageView({
            x: 0,
            y: 0,
            width: 52,
            height: 52,
            image: c.swatchHighlight,
        });

        // tab background image
        this.tabBG = new ImageView({
            superview: this,
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/tab-0.png'
        });

        this.tabs = new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-1.png',
            superview: this.tabBG,
            buttonKind: "tabs"
        });

        _colorSwatches = new ImageView({
            x: 182,
            y: 125,
            width: 390,
            height: 324,
            image: 'resources/images/craft-swatches.png',
            canHandleEvents: false,
            superview: this
        });

        var pt = this.tabBG.localizePoint(new Point(585, 125));
        this.largeCraft = new View({
            x: pt.x,
            y: pt.y,
            width: 394,
            height: 324,
            superview: this.tabBG
        });

        // used to prevent input during crafting
        this.inputBlock = new View({
            x: 0,
            y: 80,
            width: 1024,
            height: 416
        });

        // load up alllll dem buttons
        var kinds = ["garment", "craftBuy", "craftStars", "store", "backButton"];
        for (kk = 0; kk < kinds.length; kk++) {
            var k = kinds[kk], factory, rgns, btnArray;

            rgns = regions[k];
            this._buildButtons(rgns, k);
        }

        muteOpts = {
            superview: this,
            x: 952,
            y: 8,
            width: 64,
            height: 64
        };
        this.muteButton = new MuteButton(muteOpts);

        this.on('craft:start', this.startCrafting);

        this.on('craft:changeGarment', this.changeGarment);

        this.on('ViewWillAppear', bind(this, function _a_onViewWillAppear() {
            this.muteButton.setMuted({silent: true});
            this.woolCounts.update();
        }));

        this.on('craft:addDollars', function _a_onCraftAddDollars(amount) {
            this.player.addCoins(amount);
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
            disabledImage;

        disabledImage = garment.disabledImage;

        this._loopCrafts(bind(this, function _a_loopCraftsForUpdate(i, j) {
            var starRow, star, cbRow, cb, res, contrast, main, player = this.player;

            cbRow = this.buttons.craftBuy[i];
            starRow = this.buttons.craftStars[i];
            cb = cbRow[j];
            star = starRow[j];

            main = cb.getOpts().item.main;
            contrast = cb.getOpts().item.contrast;
            currentCraft = c.crafts[garment.label][main.label][contrast.label];

            if (player.canCraft(currentCraft)) {
                cb.updateOpts({opacity: 1.0, purchaseable: true});
                res = c.craftImages[garment.label][main.label][contrast.label];
                cb.setImage(res);
            } else {
                cb.updateOpts({opacity: 0.75, purchaseable: false});
                cb.setImage(disabledImage);
            }

            if (player.crafts.get(currentCraft).count >= 1) {
                star.show();
            } else {
                star.hide();
            }
        }));
    };

    this.updateTabs = function _a_updateTabs() {
        var num = c.garments.indexOf(this.selectedGarment);
        this.tabs.setImage(c.tabImages[num]);
        this.craftHighlight.removeFromSuperview();
    };

    /*
     * reset the UI to the view corresponding to the current state
     */
    this._cleanUI = function _a_cleanUI() {
        this.updateCraftBuyButtons();
        this.updateTabs();
        this.coinsLabel.update();
    };

    // creates a button on one of the regions defined at the bottom
    this.defaultButtonFactory = function _a_defaultButtonFactory(region, kind) {
        var commonOpts, opts, btn;
        commonOpts = {superview: this, click: false, buttonKind: kind};
        opts = merge(merge({}, commonOpts), region);
        btn = new Button(opts);
        return btn;
    };

    this.backButtonFactory = function _a_backButtonFactory(region) {
        this.backButton = this.defaultButtonFactory(region, 'backButton');
        this.backButton.updateOpts({click: true});
        util.reissue(this.backButton, 'InputSelect', this, 'craft:back');
    };

    this.storeFactory = function _a_storeFactory(region) {
        this.store = this.defaultButtonFactory(region, 'store');
        this.store.updateOpts({click: true});
        util.reissue(this.store, 'InputSelect', this, 'craft:store');
    };

    // garment nav buttons
    this.garmentFactory = function _a_garmentFactory(region) {
        var btn, me = this;
        region.superview = this.tabs;
        var btn = this.defaultButtonFactory(region, 'garment');
        btn.updateOpts({click: true});
        btn.on('InputSelect', function _a_onInputSelectGarment() {
            me.setGarment(this.getOpts().item);
        });
        return btn;
    };

    this.nullLargeCraft = function _a_nullLargeCraft() {
        this.largeCraft.removeAllSubviews();
        this.selectedCraft = c.nullCrafts[this.selectedGarment.label];
        this.largeCraft.addSubview(this.selectedCraft);
        this.selectedCraft.enable(false, 'Select a ' + this.selectedGarment.label + ' to craft');
    };

    this.showLargeCraft = function _a_showLargeCraft(craft) {
        var isEnabled;

        this.largeCraft.removeAllSubviews();
        isEnabled = this.player.canCraft(craft);
        if (isEnabled) {
            this.animateCraft(craft.pvItem);
        }
        this.largeCraft.addSubview(craft);
        craft.enable(isEnabled, isEnabled ? undefined : 'Requires more wool');

        craft.removeAllListeners();
        craft.on('largeCraft:purchased', bind(this, function _a_largeCraftPurchased() {
            this.addSubview(this.inputBlock);
            craft._disableBuy();
            this.buyCraft(craft);
        }));
    };

    // buy garment buttons
    this.craftBuyFactory = function _a_craftBuyFactory(region, i, j) {
        var me = this, btn;
        region.superview = this.tabs;
        btn = this.defaultButtonFactory(region, 'craftBuy');
        btn.updateOpts({
            click: false, // these have their own noise
            purchaseable: true
        });

        btn.on('InputSelect', (function _a_onInputSelectCraftBuyClosure(_btn) {
            return function _a_onInputSelectCraftBuy() {

                me.craftHighlight.removeFromSuperview();
                btn.addSubview(me.craftHighlight);
                var craft = c.crafts[me.selectedGarment.label][_btn.getOpts().item.main.label]
                                    [_btn.getOpts().item.contrast.label];
                me.showLargeCraft(craft);
            };
        })(btn));

        return btn;
    };

    this.craftStarsFactory = function _a_craftStarFactory(region, i, j) {
        var me = this.btn;
        region.superview = this.tabs;
        region.image = c.starImage;
        btn = this.defaultButtonFactory(region, 'craftStars');
        btn.hide();

        //this.animateStar(btn);

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

        if (this.player.canCraft(craft)) {
            // animate the coin "particles"
            var numCoins = 20, i, numFinished = 0, coins = [];
            for (i = 0; i < numCoins; i++) {
                coins.push(new ImageView({
                    superview: this,
                    x: 585 + 394/2,
                    y: 125 + 325/2,
                    width: 20,
                    height: 20,
                    image: c.coinParticleImage
                })),
                x = Math.random() * 150,
                y = Math.random() * 150;
                if (Math.random() > 0.5) {
                    x *= -1;
                }
                if (Math.random() > 0.5) {
                    y *= -1;
                }
                animate(coins[i]).now({
                    x: coins[i].style.x + x,
                    y: coins[i].style.y + y,
                    opacity: 0}, 1000
                ).then(bind(this, function () {
                    numFinished++;
                    var j;
                    if (numFinished === numCoins) {
                        // clean up all the coins
                        for (j = 0; j < coins.length; j++) {
                            coins[j].removeFromSuperview();
                            delete coins[j];
                        }
                        coins.length = 0;
                        this.crafts.addCraft(craft);
                        this.emit('craft:addDollars', craft.eweros());
                        this.wool.addWool(craft.colors.main, -1 * costs[0].amount);
                        this.wool.addWool(craft.colors.contrast, -1 * costs[1].amount);
                        this.woolCounts.update();
                        at.emit('player:crafted', craft);
                        this._cleanUI();
                        this.inputBlock.removeFromSuperview();
                        this.showLargeCraft(craft);
                    }
                }));
            }
        } else {
            this._cleanUI();
        }
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
        dh.pre_startCrafting(this);
        this.setGarment(c.GARMENT_HAT);
    };

    /*
     * animate a gentle swaying of the crafts
     */
    this.animateCraft = function _a_animateCraft(btn) {
        var wiggle = c.WIGGLE_RADIANS/3;
        animate(btn).clear().now({r: -1 * wiggle}, 1000, animate.easeIn
            ).then({r: wiggle}, 1000, animate.easeIn
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
    {item: c.GARMENT_HAT,      y:117, x:37, width:133, height:64,
        image: 'resources/images/tab-label-hat.png'},
    {item: c.GARMENT_MITTEN,   y:186, x:37, width:133, height:64,
        image: 'resources/images/tab-label-mitten.png'},
    {item: c.GARMENT_SOCK,     y:256, x:37, width:133, height:64,
        image: 'resources/images/tab-label-sock.png'},
    {item: c.GARMENT_SCARF,    y:326, x:37, width:133, height:64,
        image: 'resources/images/tab-label-scarf.png'},
    {item: c.GARMENT_SWEATER,  y:396, x:37, width:133, height:64,
        image: 'resources/images/tab-label-sweater.png'}
    ],
craftBuy: [
        [ // white
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_RED},    x: 186, y: 129, width: 52, height: 52},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_BLUE},   x: 286, y: 129, width: 52, height: 52},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_YELLOW}, x: 386, y: 129, width: 52, height: 52},
            {item: {main: c.COLOR_WHITE, contrast: c.COLOR_BLACK},  x: 486, y: 129, width: 52, height: 52}
        ],
        [ // red
            {item: {main: c.COLOR_RED, contrast: c.COLOR_WHITE},    x: 186, y: 195, width: 52, height: 52},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_BLUE},     x: 286, y: 195, width: 52, height: 52},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_YELLOW},   x: 386, y: 195, width: 52, height: 52},
            {item: {main: c.COLOR_RED, contrast: c.COLOR_BLACK},    x: 486, y: 195, width: 52, height: 52}
        ],
        [ // blue
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_WHITE},   x: 186, y: 261, width: 52, height: 52},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_RED},     x: 286, y: 261, width: 52, height: 52},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_YELLOW},  x: 386, y: 261, width: 52, height: 52},
            {item: {main: c.COLOR_BLUE, contrast: c.COLOR_BLACK},   x: 486, y: 261, width: 52, height: 52}
        ],
        [ // yellow
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_WHITE}, x: 186, y: 327, width: 52, height: 52},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_RED},   x: 286, y: 327, width: 52, height: 52},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_BLUE},  x: 386, y: 327, width: 52, height: 52},
            {item: {main: c.COLOR_YELLOW, contrast: c.COLOR_BLACK}, x: 486, y: 327, width: 52, height: 52}
        ],
        [ // black
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_WHITE},   x: 186, y: 393, width: 52, height: 52},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_RED},     x: 286, y: 393, width: 52, height: 52},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_BLUE},    x: 386, y: 393, width: 52, height: 52},
            {item: {main: c.COLOR_BLACK, contrast: c.COLOR_YELLOW},  x: 486, y: 393, width: 52, height: 52}
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
store: [
    {x: 141, y: 506, width: 184, height: 60, image: 'resources/images/button-general-store.png'}
],
backButton: [
    {x: 8, y: 8, width: 64, height: 64, image: 'resources/images/button-return.png'}
]
}

regions.garment.factory = 'garmentFactory';
regions.craftBuy.factory = 'craftBuyFactory';
regions.craftStars.factory = 'craftStarsFactory';
regions.store.factory = 'storeFactory';
regions.backButton.factory = 'backButtonFactory';
