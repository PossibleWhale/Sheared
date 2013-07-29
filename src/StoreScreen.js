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
        var upgradesView = new ImageView({
            superview: this,
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/store-upgrades.png'
        }),
        woolCounts = new WoolCounter({
            superview: this,
            x: 283,
            y: 0,
            storage: GC.app.player.wool
        }),
        backButton = new Button({
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

        this.progressBars = {};
        this.progressBars.temporary = {
            power: new ImageView({
                superview: upgradesView,
                x: 212,
                y: 141,
                width: 140,
                height: 32,
            }),
            multiplier: new ImageView({
                superview: upgradesView,
                x: 411,
                y: 141,
                width: 140,
                height: 32,
            })
        };
        this.progressBars.permanent = {
            power: new ImageView({
                superview: upgradesView,
                x: 614,
                y: 141,
                width: 140,
                height: 32,
            }),
            multiplier: new ImageView({
                superview: upgradesView,
                x: 813,
                y: 141,
                width: 140,
                height: 32,
            })
        };

        this.updateProgressBars();

        this.priceDisplays = {};

        ////// TODO put the real prices in
        this.priceDisplays.temporary = {
            power: new TextView(merge({
                superview: upgradesView,
                x: 248,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            multiplier: new TextView(merge({
                superview: upgradesView,
                x: 447,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            diamond: new TextView(merge({
                superview: upgradesView,
                x: 248,
                y: 324,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS))
        };
        this.priceDisplays.permanent = {
            power: new TextView(merge({
                superview: upgradesView,
                x: 650,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            multiplier: new TextView(merge({
                superview: upgradesView,
                x: 849,
                y: 182,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS)),
            diamond: new TextView(merge({
                superview: upgradesView,
                x: 650,
                y: 324,
                width: 100,
                height: 36,
                strokeWidth: 3
            }, constants.TEXT_OPTIONS))
        };
        this.updatePriceDisplays();

        var confirmDialog;

        ///// Buttons for temporary upgrades
        var powerUpgradeButton = new Button({
            superview: upgradesView,
            x: 207,
            y: 136,
            width: 150,
            height: 90
        });
        powerUpgradeButton.on('InputSelect', bind(this, function () {
            confirmDialog = new Alert({
                superview: this,
                text: 'You are about to purchase a clipper power upgrade. Do you wish to continue?',
                confirmFn: bind(this, function () {
                    GC.app.player.purchased('temp', 'power');
                    this.updateProgressBars();
                    this.updatePriceDisplays();
                })
            });
            confirmDialog.show();
        }));

        var multiplierUpgradeButton = new Button({
            superview: upgradesView,
            x: 406,
            y: 136,
            width: 150,
            height: 90
        });
        multiplierUpgradeButton.on('InputSelect', bind(this, function () {
            confirmDialog = new Alert({
                superview: this,
                text: 'You are about to purchase a bolt multiplier upgrade. Do you wish to continue?',
                confirmFn: bind(this, function () {
                    GC.app.player.purchased('temp', 'mult');
                    this.updateProgressBars();
                    this.updatePriceDisplays();
                })
            });
            confirmDialog.show();
        }));

        var diamondButton = new Button({
            superview: upgradesView,
            x: 207,
            y: 268,
            width: 150,
            height: 90
        });
        diamondButton.on('InputSelect', bind(this, function () {
            confirmDialog = new Alert({
                superview: this,
                text: 'You are about to purchase a diamond blade. Do you wish to continue?',
                confirmFn: bind(this, function () {
                    GC.app.player.purchased('temp', 'diamond');
                    this.updatePriceDisplays();
                })
            });
            confirmDialog.show();
        }));


        ///// Buttons for permanent upgrades
        var powerPermanentButton = new Button({
            superview: upgradesView,
            x: 610,
            y: 136,
            width: 150,
            height: 90
        });
        powerPermanentButton.on('InputSelect', bind(this, function () {
            confirmDialog = new Alert({
                superview: this,
                text: 'You are about to purchase a clipper power upgrade. Do you wish to continue?',
                confirmFn: bind(this, function () {
                    GC.app.player.purchased('perm', 'power');
                    this.updateProgressBars();
                    this.updatePriceDisplays();
                })
            });
            confirmDialog.show();
        }));

        var multiplierPermanentButton = new Button({
            superview: upgradesView,
            x: 808,
            y: 136,
            width: 150,
            height: 90
        });
        multiplierPermanentButton.on('InputSelect', bind(this, function () {
            confirmDialog = new Alert({
                superview: this,
                text: 'You are about to purchase a bolt multiplier upgrade. Do you wish to continue?',
                confirmFn: bind(this, function () {
                    GC.app.player.purchased('perm', 'mult');
                    this.updateProgressBars();
                    this.updatePriceDisplays();
                })
            });
            confirmDialog.show();
        }));

        var diamondPermanentButton = new Button({
            superview: upgradesView,
            x: 610,
            y: 268,
            width: 150,
            height: 90
        });
        diamondPermanentButton.on('InputSelect', bind(this, function () {
            confirmDialog = new Alert({
                superview: this,
                text: 'You are about to purchase a diamond blade. Do you wish to continue?',
                confirmFn: bind(this, function () {
                    GC.app.player.purchased('perm', 'diamond');
                    this.updatePriceDisplays();
                })
            });
            confirmDialog.show();
        }));
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

    this.updateProgressBars = function () {
        var upgradeLevels = this._upgradeLevels();
        this.progressBars.temporary.power.setImage('resources/images/store-power-' + upgradeLevels.temporary.power + '.png');
        this.progressBars.temporary.multiplier.setImage('resources/images/store-multiplier-' + upgradeLevels.temporary.multiplier + '.png');
        this.progressBars.permanent.power.setImage('resources/images/store-power-' + upgradeLevels.permanent.power + '.png');
        this.progressBars.permanent.multiplier.setImage('resources/images/store-multiplier-' + upgradeLevels.permanent.multiplier + '.png');
    };

    this.updatePriceDisplays = function () {
        var upgradeLevels = this._upgradeLevels();
        this.priceDisplays.temporary.power.setText(constants.UPGRADE_PRICES.temp_power[upgradeLevels.temporary.power-1] || 'Purchased!');
        this.priceDisplays.temporary.multiplier.setText(constants.UPGRADE_PRICES.temp_mult[upgradeLevels.temporary.multiplier-1] || 'Purchased!');
        if (GC.app.player.upgrades.get('temp_diamond').value) {
            this.priceDisplays.temporary.diamond.setText('Purchased!');
        } else {
            this.priceDisplays.temporary.diamond.setText(constants.UPGRADE_PRICES.temp_diamond);
        }
        this.priceDisplays.permanent.power.setText(constants.UPGRADE_PRICES.perm_power[upgradeLevels.permanent.power-1] || 'Purchased!');
        this.priceDisplays.permanent.multiplier.setText(constants.UPGRADE_PRICES.perm_mult[upgradeLevels.permanent.multiplier-1] || 'Purchased!');
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
                power: (upgrades.get('temp_power').value + 1) >= 5 ? 'max' : upgrades.get('temp_power').value+1,
                multiplier: upgrades.get('temp_mult').value >= 6 ? 'max' : upgrades.get('temp_mult').value
            },
            permanent: {
                power: (upgrades.get('perm_power').value+1) >= 5 ? 'max' : upgrades.get('perm_power').value+1,
                multiplier: upgrades.get('perm_mult').value >= 6 ? 'max' : upgrades.get('perm_mult').value
            }
        };
    };
});
