/*
 * Crafting booth
 */

import animate;
import ui.View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.geom.Point as Point;

import src.constants as c;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.util as util;
import src.Craft as Craft;
import src.debughack as dh;
import src.awardtracker as at;
import src.WoolCounter as WoolCounter;


exports = Class(ui.View, function (supr) {
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

        _totalEwerosBG = new ImageView(merge({
            x: 390,
            y: 496,
            height: 80,
            width: 244,
            image: 'resources/images/label-eweros.png'
        }, _myBGOpts));

        this.buttons = {};
        this.player = opts.player || GC.app.player;
        this.total = Math.round(this.player.stats.get('coins').value, 0);
        this.wool = this.player.wool;
        this.crafts = this.player.crafts;

        this.selectedGarment = c.GARMENT_HAT;
        this.selectedCraft = null;

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 283,
            y: 0,
            storage: this.wool
        });

        this.tabs = new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 576-160,
            image: 'resources/images/tab-1.png',
            superview: this,
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

        var pt = this.tabs.localizePoint(new Point(585, 125));
        this.largeCraft = new ui.View({
            x: pt.x,
            y: pt.y,
            width: 394,
            height: 325,
            superview: this.tabs
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
            this.woolCounts.matchStorage();
            this.total = this.player.stats.get('coins').value;
            this.updateTotal();
        }));

        this.on('craft:addDollars', function _a_onCraftAddDollars(amount) {
            this.total += amount;
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

        disabledImage = new Image({url: 'resources/images/' + garment.label + '-disabled-small.png'});

        this._loopCrafts(bind(this, function _a_loopCraftsForUpdate(i, j) {
            var starRow, star, cbRow, cb, res, contrast, main, player = this.player;

            cbRow = this.buttons.craftBuy[i];
            starRow = this.buttons.craftStars[i];
            cb = cbRow[j];
            star = starRow[j];

            main = cb.getOpts().item.main;
            contrast = cb.getOpts().item.contrast;
            currentCraft = new Craft(garment, main, contrast);

            if (player.canCraft(currentCraft)) {
                cb.updateOpts({opacity: 1.0, purchaseable: true});
                res = new Image({url:
                    'resources/images/' + garment.label + '-' + main.label + '-' + contrast.label + '-small.png'
                });
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
        var num = c.garments.indexOf(this.selectedGarment) + 1;
        this.tabs.setImage('resources/images/tab-' + num + '.png');
    };

    /*
     * reset the UI to the view corresponding to the current state
     */
    this._cleanUI = function _a_cleanUI() {
        this.updateCraftBuyButtons();
        this.updateTabs();
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
        this.selectedCraft = new Craft(this.selectedGarment, null, null);
        this.largeCraft.addSubview(this.selectedCraft);
        this.selectedCraft.enable(false);
    };

    this.showLargeCraft = function _a_showLargeCraft(data) {
        var isEnabled;

        this.largeCraft.removeAllSubviews();

        this.selectedCraft = new Craft(this.selectedGarment, data.main, data.contrast);
        isEnabled = this.player.canCraft(this.selectedCraft);

        this.largeCraft.addSubview(this.selectedCraft);
        this.selectedCraft.enable(isEnabled);

        this.selectedCraft.on('largeCraft:purchased', bind(this, function _a_largeCraftPurchased() {
            this.buyCraft(this.selectedCraft);
            this.showLargeCraft(data);
        }));
    };

    // buy garment buttons
    this.craftBuyFactory = function _a_craftBuyFactory(region, i, j) {
        var me = this, btn;
        region.superview = this.tabs;
        btn = this.defaultButtonFactory(region, 'craftBuy');
        btn.updateOpts({anchorX: btn.getOpts().width / 2,
            anchorY: 8,
            click: false, // these have their own noise
            purchaseable: true
        });

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
        region.superview = this.tabs;
        region.image = new Image({url: 'resources/images/gold-star.png'});
        btn = this.defaultButtonFactory(region, 'craftStars');
        btn.hide();

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
                    image: 'resources/images/particle-ewero.png'
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
                        }
                        this.crafts.addCraft(craft);
                        this.emit('craft:addDollars', craft.eweros());
                        this.wool.addWool(craft.colors.main, -1 * costs[0].amount);
                        this.wool.addWool(craft.colors.contrast, -1 * costs[1].amount);
                        this.woolCounts.update();
                        at.emit('player:crafted', craft);
                        this._cleanUI();
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
        if (!btn.getOpts().purchaseable) {
            animate(btn).clear().now({r: 0});
            return;
        }

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
    {
        x: 453,
        y: 516,
        width: 152,
        height: 40,
        color: '#333333',
        strokeWidth: 0,
        strokeColor: undefined,
        fontFamily: 'delius',
        horizontalAlign: 'left',
        text: '0'
    }
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
