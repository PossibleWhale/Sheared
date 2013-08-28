import animate;
import plugins.billing.billing as billing;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View as View;
import src.constants as constants;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.WoolCounter as WoolCounter;
import src.Alert as Alert;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        billing.onPurchase = bind(this, function (item) {
            var name, index, split;
            split = item.split('_');
            name = split[0];
            index = parseInt(split[1]);

            if (name === 'coins') {
                GC.app.player.addCoins(constants.EWEROS_QUANTITIES[index]);
                this.updateCoinsLabel();
            } else if (item === 'adFree') {
                GC.app.player.upgrades.add('adFree', true);
            }
        });

        // header image
        this.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        }));

        // footer image
        this.addSubview(new ImageView({
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        }));

        // background image
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/background-wood.png'
        }));

        // coin background
        this.addSubview(new ImageView({
            x: 390,
            y: 496,
            width: 244,
            height: 80,
            image: 'resources/images/label-eweros.png'
        }));
        this.coinsLabel = new TextView({
            superview: this,
            x: 452,
            y: 516,
            width: 152,
            height: 40,
            color: '#333333',
            fontFamily: 'delius',
            horizontalAlign: 'left',
            text: '' + GC.app.player.stats.get('coins').value
        });

        this.tabs = {
            upgrades: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/tab-1.png'
            }),
            wool: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/tab-2.png'
            }),
            eweros: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/tab-3.png'
            }),
            ads: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/tab-4.png'
            })
        };
        this.currentTab = this.tabs.upgrades;
        this.addSubview(this.currentTab);

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 292,
            y: 0,
            storage: GC.app.player.wool
        });

        this.addSubview(new MuteButton({
            x: 944,
            y: 0,
            zIndex: 9999,
            width: 80,
            height: 80
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this.woolCounts.update();
            this.updateCoinsLabel();
        }));

        var backButton = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-return.png'
        });
        backButton.on('InputSelect', bind(this, function () {
            this.emit('store:back');
        }));

        craftButton = new ImageView({
            superview: this,
            x: 133,
            y: 496,
            width: 200,
            height: 80,
            image: 'resources/images/button-crafts-catalog.png'
        });
        craftButton.on('InputSelect', bind(this, function () {
            this.emit('store:craft');
        }));

        var upgradesTab = new ImageView({
            superview: this,
            x: 37,
            y: 117,
            zIndex: 99,
            width: 133,
            height: 64,
            image: 'resources/images/tab-label-upgrades.png'
        });
        upgradesTab.on('InputSelect', bind(this, function () {
            this.switchTab('upgrades');
        }));

        var woolTab = new ImageView({
            superview: this,
            x: 37,
            y: 186,
            zIndex: 99,
            width: 133,
            height: 64,
            image: 'resources/images/tab-label-wool.png'
        });
        woolTab.on('InputSelect', bind(this, function () {
            this.switchTab('wool');
        }));

        var ewerosTab = new ImageView({
            superview: this,
            x: 37,
            y: 256,
            zIndex: 99,
            width: 133,
            height: 64,
            image: 'resources/images/tab-label-eweros.png'
        });
        ewerosTab.on('InputSelect', bind(this, function () {
            this.switchTab('eweros');
        }));

        var adsTab = new ImageView({
            superview: this,
            x: 37,
            y: 326,
            zIndex: 99,
            width: 133,
            height: 64,
            image: 'resources/images/tab-label-ads.png'
        });
        adsTab.on('InputSelect', bind(this, function () {
            this.switchTab('ads');
        }));

        this._buildUpgradeTab();
        this._buildWoolTab();
        this._buildEwerosTab();
        this._buildAdsTab();
    };

    this.updateCoinsLabel = function () {
        this.coinsLabel.setText('' + GC.app.player.stats.get('coins').value);
    };

    this._buildUpgradeTab = function () {
        this.tabs.upgrades.addSubview(new ImageView({
            x: 210,
            y: 40,
            width: 740,
            height: 256,
            image: 'resources/images/store-upgrades.png'
        }));

        this.progressBars = {
            power: new ImageView({
                superview: this.tabs.upgrades,
                x: 225,
                y: 141,
                width: 140,
                height: 32
            }),
            multiplier: new ImageView({
                superview: this.tabs.upgrades,
                x: 415,
                y: 141,
                width: 140,
                height: 32
            }),
            blade: new ImageView({
                superview: this.tabs.upgrades,
                x: 606,
                y: 141,
                width: 140,
                height: 32
            })
        };

        this.updateProgressBars();

        this.priceDisplays = {
            power: new TextView({
                superview: this.tabs.upgrades,
                x: 260,
                y: 185,
                width: 104,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: "left"
            }),
            multiplier: new TextView({
                superview: this.tabs.upgrades,
                x: 450,
                y: 185,
                width: 104,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: "left"
            }),
            blade: new TextView({
                superview: this.tabs.upgrades,
                x: 641,
                y: 185,
                width: 104,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: "left"
            }),
            diamond: new TextView({
                superview: this.tabs.upgrades,
                x: 831,
                y: 185,
                width: 104,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: "left"
            })
        };
        this.updatePriceDisplays();

        ///// Buttons for upgrades
        var powerButton = new Button({
            superview: this.tabs.upgrades,
            x: 215,
            y: 136,
            width: 160,
            height: 91
        });
        powerButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent clipper power upgrade. Do you wish to continue?', 'power');
        }));

        var multiplierButton = new Button({
            superview: this.tabs.upgrades,
            x: 405,
            y: 136,
            width: 160,
            height: 91
        });
        multiplierButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent bolt multiplier upgrade. Do you wish to continue?', 'mult');
        }));

        var bladeButton = new Button({
            superview: this.tabs.upgrades,
            x: 596,
            y: 136,
            width: 160,
            height: 91
        });
        bladeButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent blade power upgrade. Do you wish to continue?', 'blade');
        }));

        var diamondButton = new Button({
            superview: this.tabs.upgrades,
            x: 786,
            y: 136,
            width: 160,
            height: 91
        });
        diamondButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent diamond blade. Do you wish to continue?', 'diamond');
        }));
    };

    this._buildWoolTab = function () {
        var _registerClick = bind(this, function (view, index) {
            view.on('InputSelect', bind(this, function () {
                this.showPurchaseWool(constants.colors[index]);
            }));
        });
        var startX = 227, containerStart = 182, gap = 162, i = 0, container;
        this.tabs.wool.addSubview(new ImageView({
            x: 177,
            y: 40,
            width: 806,
            height: 275,
            image: 'resources/images/store-wool.png'
        }));
        for (i; i < constants.colors.length; i++) {
            //container
            container = new Button({
                superview: this.tabs.wool,
                x: containerStart + i*gap,
                y: 136,
                width: 150,
                height: 174
            });
            _registerClick(container, i);
            // quantity
            this.tabs.wool.addSubview(new TextView({
                x: startX + gap*i,
                y: 147,
                width: 95,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: 'left',
                text: '' + constants.WOOL_QUANTITIES[constants.colors[i].label]
            }));

            // cost
            this.tabs.wool.addSubview(new TextView({
                x: startX + gap*i,
                y: 268,
                width: 95,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: 'left',
                text: '' + constants.UPGRADE_PRICES[constants.colors[i].label]
            }));
        }
    };

    this._buildEwerosTab = function () {
        var _registerClick = bind(this, function (view, index) {
            view.on('InputSelect', function () {
                billing.purchase('coins_' + index);
            });
        });
        var startX = 227, containerStart = 182, gap = 162, i = 0;
        this.tabs.eweros.addSubview(new ImageView({
            x: 177,
            y: 40,
            width: 806,
            height: 262,
            image: 'resources/images/store-eweros.png'
        }));
        for (i; i < constants.colors.length; i++) {
            //container
            container = new Button({
                superview: this.tabs.eweros,
                x: containerStart + i*gap,
                y: 116,
                width: 150,
                height: 182
            });
            _registerClick(container, i);
            // quantity
            this.tabs.eweros.addSubview(new TextView({
                x: startX + gap*i,
                y: 120,
                width: 93,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: 'left',
                text: '' + constants.EWEROS_QUANTITIES[i]
            }));

            // cost
            this.tabs.eweros.addSubview(new TextView({
                x: startX + gap*i,
                y: 256,
                width: 93,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                horizontalAlign: 'left',
                text: '$' + constants.EWEROS_PRICES[i]
            }));
        }
    };

    this._buildAdsTab = function () {
        var startX = 550, containerStart = 182, gap = 162, i = 0;

        this.tabs.ads.addSubview(new ImageView({
            x: 435,
            y: 40,
            width: 290,
            height: 228,
            image: 'resources/images/store-ads.png'
        }));
        
        // cost
        this.tabs.ads.addSubview(new TextView({
            x: startX + gap*i,
            y: 223,
            width: 93,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            horizontalAlign: 'left',
            text: '$' + constants.ADS_PRICE[i]
        }));
        
        var button = new Button({
            superview: this.tabs.ads,
            x: 505,
            y: 115,
            width: 150,
            height: 148
        });

        button.on('InputSelect', function () {
            billing.purchase('adFree');
        });
    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };

    this.showPurchaseWool = function (color) {
        this.showPurchaseDialog(
            'You are about to purchase ' + color.label + ' wool. Do you wish to continue?',
            false,
            color
        );
    };

    this.showPurchaseDialog = function (text, upgrade, woolColor) {
        var confirmDialog, cost;
        if (woolColor) {
            cost = constants.UPGRADE_PRICES[woolColor.label];
        } else if (upgrade === 'diamond') {
            cost = constants.UPGRADE_PRICES[upgrade];
        } else {
            cost = constants.UPGRADE_PRICES[upgrade][GC.app.player.upgrades.get(upgrade).value-1];
        }
        if (!GC.app.localConfig.debug && GC.app.player.stats.get('coins').value < cost) {
            confirmDialog = new Alert({
                superview: this,
                text: 'Not enough Eweros! Earn more by crafting, or buy more in the store.',
                confirmFn: bind(this, function () { this.switchTab('eweros'); }),
                confirmText: 'Buy Eweros!'
            });
        } else {
            confirmDialog = new Alert({
                superview: this,
                text: text,
                confirmFn: bind(this, function () {
                    if (woolColor) {
                        GC.app.player.purchased(false, false, woolColor.label);
                        this.woolCounts.update(woolColor);
                    } else {
                        GC.app.player.purchased(upgrade);
                        this.updateProgressBars();
                        this.updatePriceDisplays();
                    }
                    this.updateCoinsLabel();
                }),
                confirmText: 'OK'
            });
        }
        confirmDialog.show();
    };

    this.updateProgressBars = function () {
        var upgradeLevels = this._upgradeLevels();
        this.progressBars.power.setImage(
            'resources/images/store-clipperpower-' +
            upgradeLevels.power +
            '.png'
        );
        this.progressBars.multiplier.setImage(
            'resources/images/store-multiplier-' +
            upgradeLevels.multiplier +
            '.png'
        );
        this.progressBars.blade.setImage(
            'resources/images/store-bladepower-' +
            upgradeLevels.blade +
            '.png'
        );
    };

    this.updatePriceDisplays = function () {
        var upgradeLevels = this._upgradeLevels();

        // price displays for upgrades
        this.priceDisplays.power.setText(
            constants.UPGRADE_PRICES.power[upgradeLevels.power-1] ||
            'Purchased!'
        );
        this.priceDisplays.multiplier.setText(
            constants.UPGRADE_PRICES.mult[upgradeLevels.multiplier-1] ||
            'Purchased!'
        );
        this.priceDisplays.blade.setText(
            constants.UPGRADE_PRICES.blade[upgradeLevels.blade-1] ||
            'Purchased!'
        );
        if (GC.app.player.upgrades.get('diamond').value) {
            this.priceDisplays.diamond.setText('Purchased!');
        } else {
            this.priceDisplays.diamond.setText(constants.UPGRADE_PRICES.diamond);
        }
    };

    this._upgradeLevels = function () {
        var upgrades = GC.app.player.upgrades;
        return {
            power: upgrades.get('power').value >= 6 ? 'max' : upgrades.get('power').value,
            multiplier: upgrades.get('mult').value >= 6 ? 'max' : upgrades.get('mult').value,
            blade: upgrades.get('blade').value >= 6 ? 'max' : upgrades.get('blade').value
        };
    };
});
