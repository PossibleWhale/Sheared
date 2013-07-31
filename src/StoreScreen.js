import animate;
import plugins.billing.billing as billing;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View as View;
import src.constants as constants;
import src.Button as Button;
import src.WoolCounter as WoolCounter;
import src.Alert as Alert;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/store.png'
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var coinsLabel = new Button({
            superview: this,
            x: 432,
            y: 486,
            width: 160,
            height: 80,
            text: '' + GC.app.player.stats.get('coins').value
        });

        this.tabs = {
            upgrades: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/store-upgrades.png'
            }),
            wool: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/store-wool.png'
            }),
            eweros: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/store-eweros.png'
            })
        };
        this.currentTab = this.tabs.upgrades;
        this.addSubview(this.currentTab);

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 283,
            y: 0,
            storage: GC.app.player.wool
        });
        var backButton = new Button({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80
        });
        backButton.on('InputSelect', bind(this, function () {
            this.emit('store:back');
        }));

        craftButton = new Button({
            superview: this,
            x: 133,
            y: 496,
            width: 200,
            height: 80
        });
        craftButton.on('InputSelect', bind(this, function () {
            this.emit('store:craft');
        }));

        var upgradesTab = new Button({
            superview: this,
            x: 33,
            y: 113,
            zIndex: 99,
            width: 137,
            height: 64
        });
        upgradesTab.on('InputSelect', bind(this, function () {
            this.switchTab('upgrades');
        }));

        var woolTab = new Button({
            superview: this,
            x: 33,
            y: 183,
            zIndex: 99,
            width: 137,
            height: 64
        });
        woolTab.on('InputSelect', bind(this, function () {
            this.switchTab('wool');
        }));

        var ewerosTab = new Button({
            superview: this,
            x: 33,
            y: 255,
            zIndex: 99,
            width: 137,
            height: 64
        });
        ewerosTab.on('InputSelect', bind(this, function () {
            this.switchTab('eweros');
        }));

        this._buildUpgradeTab();
        this._buildWoolTab();
        this._buildEwerosTab();

        /* TODO add this in when we are ready for in-app purchases
        this.addCoinsButton = new Button({
            superview: this,
            x: 1024/2 - 200,
            y: 576/2 - 100,
            width: 400,
            height: 200,
            text: 'Click to buy 1000 coins',
            backgroundColor: '#999999'
        });

        this.addCoinsButton.on('InputSelect', function () {
            billing.purchase('coins');
        });

        billing.onPurchase = function (item) {
            if (item === 'coins') {
                GC.app.player.addCoins(1000);
            }
        };
        */
    };

    this._buildUpgradeTab = function () {
        this.progressBars = {};
        this.progressBars.temporary = {
            power: new ImageView({
                superview: this.tabs.upgrades,
                x: 212,
                y: 141,
                width: 140,
                height: 32,
            }),
            multiplier: new ImageView({
                superview: this.tabs.upgrades,
                x: 411,
                y: 141,
                width: 140,
                height: 32,
            })
        };
        this.progressBars.permanent = {
            power: new ImageView({
                superview: this.tabs.upgrades,
                x: 614,
                y: 141,
                width: 140,
                height: 32,
            }),
            multiplier: new ImageView({
                superview: this.tabs.upgrades,
                x: 813,
                y: 141,
                width: 140,
                height: 32,
            })
        };

        this.updateProgressBars();

        this.priceDisplays = {};

        this.priceDisplays.temporary = {
            power: new TextView(merge({
                superview: this.tabs.upgrades,
                x: 248,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            multiplier: new TextView(merge({
                superview: this.tabs.upgrades,
                x: 447,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            diamond: new TextView(merge({
                superview: this.tabs.upgrades,
                x: 248,
                y: 324,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS))
        };
        this.priceDisplays.permanent = {
            power: new TextView(merge({
                superview: this.tabs.upgrades,
                x: 650,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            multiplier: new TextView(merge({
                superview: this.tabs.upgrades,
                x: 849,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            diamond: new TextView(merge({
                superview: this.tabs.upgrades,
                x: 650,
                y: 324,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS))
        };
        this.updatePriceDisplays();

        ///// Buttons for temporary upgrades
        var powerUpgradeButton = new Button({
            superview: this.tabs.upgrades,
            x: 207,
            y: 136,
            width: 150,
            height: 90
        });
        powerUpgradeButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a clipper power upgrade. Do you wish to continue?',
                'temp', 'power');
        }));

        var multiplierUpgradeButton = new Button({
            superview: this.tabs.upgrades,
            x: 406,
            y: 136,
            width: 150,
            height: 90
        });
        multiplierUpgradeButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a bolt multiplier upgrade. Do you wish to continue?',
                'temp', 'mult');
        }));

        var diamondButton = new Button({
            superview: this.tabs.upgrades,
            x: 207,
            y: 268,
            width: 150,
            height: 90
        });
        diamondButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a diamond blade. Do you wish to continue?',
                'temp', 'diamond');
        }));


        ///// Buttons for permanent upgrades
        var powerPermanentButton = new Button({
            superview: this.tabs.upgrades,
            x: 610,
            y: 136,
            width: 150,
            height: 90
        });
        powerPermanentButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent clipper power upgrade. Do you wish to continue?',
                'perm', 'power');
        }));

        var multiplierPermanentButton = new Button({
            superview: this.tabs.upgrades,
            x: 808,
            y: 136,
            width: 150,
            height: 90
        });
        multiplierPermanentButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent bolt multiplier upgrade. Do you wish to continue?',
            'perm', 'mult');
        }));

        var diamondPermanentButton = new Button({
            superview: this.tabs.upgrades,
            x: 610,
            y: 268,
            width: 150,
            height: 90
        });
        diamondPermanentButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a permanent diamond blade. Do you wish to continue?',
                'perm', 'diamond');
        }));
    };

    this._buildWoolTab = function () {
        var _registerClick = bind(this, function (view, index) {
            view.on('InputSelect', bind(this, function () {
                this.showPurchaseWool(constants.colors[index]);
            }));
        });
        var startX = 227, containerStart = 182, gap = 162, i = 0, container;
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
            this.tabs.wool.addSubview(new Button({
                x: startX + gap*i,
                y: 145,
                width: 95,
                height: 36,
                text: '100' // TODO put the actual quantity in
            }));

            // cost
            this.tabs.wool.addSubview(new Button({
                x: startX + gap*i,
                y: 265,
                width: 95,
                height: 36,
                text: '1000' // TODO
            }));
        }
    };

    this._buildEwerosTab = function () {
        var startX = 227, gap = 162, i = 0;
        for (i; i < constants.colors.length; i++) {
            // quantity
            this.tabs.eweros.addSubview(new Button({
                x: startX + gap*i,
                y: 120,
                width: 95,
                height: 36,
                text: '' + (1000*(1+i)) // TODO put the actual quantity in
            }));

            // cost
            this.tabs.eweros.addSubview(new Button({
                x: startX + gap*i,
                y: 256,
                width: 95,
                height: 36,
                text: '$' + (1+i) // TODO
            }));
        }
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
            false,
            color
        );
    };

    this.showPurchaseDialog = function (text, tempOrPerm, upgrade, woolColor) {
        var confirmDialog, cost, key = tempOrPerm + '_' + upgrade;
        if (woolColor) {
            cost = 1000; // TODO
        } else if (upgrade === 'diamond') {
            cost = constants.UPGRADE_PRICES[key];
        } else {
            cost = constants.UPGRADE_PRICES[key][GC.app.player.upgrades.get(key).value];
        }
        if (!GC.app.localConfig.debug && GC.app.player.stats.get('coins').value < cost) {
            confirmDialog = new Alert({
                superview: this,
                text: 'Not enough eweros! Earn more by crafting, or buy more in the store.',
                confirmFn: function () { return; },
                showCancelButton: false
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
                        GC.app.player.purchased(tempOrPerm, upgrade);
                        this.updateProgressBars();
                        this.updatePriceDisplays();
                    }
                })
            });
        }
        confirmDialog.show();
    };

    this.updateProgressBars = function () {
        var upgradeLevels = this._upgradeLevels();
        this.progressBars.temporary.power.setImage(
            'resources/images/store-power-' +
            upgradeLevels.temporary.power +
            '.png'
        );
        this.progressBars.temporary.multiplier.setImage(
            'resources/images/store-multiplier-' +
            upgradeLevels.temporary.multiplier +
            '.png'
        );
        this.progressBars.permanent.power.setImage(
            'resources/images/store-power-' +
            upgradeLevels.permanent.power +
            '.png'
        );
        this.progressBars.permanent.multiplier.setImage(
            'resources/images/store-multiplier-' +
            upgradeLevels.permanent.multiplier +
            '.png'
        );
    };

    this.updatePriceDisplays = function () {
        var upgradeLevels = this._upgradeLevels();

        // price displays for temporary upgrades
        this.priceDisplays.temporary.power.setText(
            constants.UPGRADE_PRICES.temp_power[upgradeLevels.temporary.power-1] ||
            'Purchased!'
        );
        this.priceDisplays.temporary.multiplier.setText(
            constants.UPGRADE_PRICES.temp_mult[upgradeLevels.temporary.multiplier-1] ||
            'Purchased!'
        );
        if (GC.app.player.upgrades.get('temp_diamond').value) {
            this.priceDisplays.temporary.diamond.setText('Purchased!');
        } else {
            this.priceDisplays.temporary.diamond.setText(constants.UPGRADE_PRICES.temp_diamond);
        }
        
        // price displays for permanent upgrades
        this.priceDisplays.permanent.power.setText(
            constants.UPGRADE_PRICES.perm_power[upgradeLevels.permanent.power-1] ||
            'Purchased!'
        );
        this.priceDisplays.permanent.multiplier.setText(
            constants.UPGRADE_PRICES.perm_mult[upgradeLevels.permanent.multiplier-1] ||
            'Purchased!'
        );
        if (GC.app.player.upgrades.get('perm_diamond').value) {
            this.priceDisplays.permanent.diamond.setText('Purchased!');
        } else {
            this.priceDisplays.permanent.diamond.setText(constants.UPGRADE_PRICES.perm_diamond);
        }
    };

    this._upgradeLevels = function () {
        var upgrades = GC.app.player.upgrades;
        return {
            temporary: {
                power: upgrades.get('temp_power').value >= 5 ? 'max' : upgrades.get('temp_power').value,
                multiplier: upgrades.get('temp_mult').value >= 6 ? 'max' : upgrades.get('temp_mult').value
            },
            permanent: {
                power: upgrades.get('perm_power').value >= 5 ? 'max' : upgrades.get('perm_power').value,
                multiplier: upgrades.get('perm_mult').value >= 6 ? 'max' : upgrades.get('perm_mult').value
            }
        };
    };
});
