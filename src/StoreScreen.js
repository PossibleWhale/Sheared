import plugins.billing.billing as billing;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.constants as constants;
import src.Button as Button;
import src.WoolCounter as WoolCounter;

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
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/store-upgrades.png'
        }),
        woolCounts = new WoolCounter({
            superview: this,
            x: 283,
            y: 0,
            fromLocal: true
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

        this.progressBars = {};

        ///// TODO get images from current upgrade status
        this.progressBars.temporary = {
            clipper: new ImageView({
                superview: upgradesView,
                x: 212,
                y: 221,
                width: 140,
                height: 32,
                image: 'resources/images/store-power-1.png'
            }),
            multiplier: new ImageView({
                superview: upgradesView,
                x: 411,
                y: 221,
                width: 140,
                height: 32,
                image: 'resources/images/store-multiplier-1.png'
            }),
        };
        this.progressBars.permanent = {
            clipper: new ImageView({
                superview: upgradesView,
                x: 614,
                y: 221,
                width: 140,
                height: 32,
                image: 'resources/images/store-power-1.png'
            }),
            multiplier: new ImageView({
                superview: upgradesView,
                x: 813,
                y: 221,
                width: 140,
                height: 32,
                image: 'resources/images/store-multiplier-1.png'
            }),
        };

        this.priceDisplays = {};

        ////// TODO put the real prices in
        this.priceDisplays.temporary = {
            clipper: new TextView(merge({
                superview: upgradesView,
                x: 248,
                y: 262,
                width: 100,
                height: 36,
                strokeWidth: 3,
                text: '1,000'
            }, constants.TEXT_OPTIONS)),
            multiplier: new TextView(merge({
                superview: upgradesView,
                x: 447,
                y: 262,
                width: 100,
                height: 36,
                strokeWidth: 3,
                text: '1,000'
            }, constants.TEXT_OPTIONS)),
            diamond: new TextView(merge({
                superview: upgradesView,
                x: 248,
                y: 404,
                width: 100,
                height: 36,
                strokeWidth: 3,
                text: '10,000'
            }, constants.TEXT_OPTIONS))
        };
        this.priceDisplays.temporary = {
            clipper: new TextView(merge({
                superview: upgradesView,
                x: 650,
                y: 262,
                width: 100,
                height: 36,
                strokeWidth: 3,
                text: '100,000'
            }, constants.TEXT_OPTIONS)),
            multiplier: new TextView(merge({
                superview: upgradesView,
                x: 849,
                y: 262,
                width: 100,
                height: 36,
                strokeWidth: 3,
                text: '100,000'
            }, constants.TEXT_OPTIONS)),
            diamond: new TextView(merge({
                superview: upgradesView,
                x: 650,
                y: 404,
                width: 100,
                height: 36,
                strokeWidth: 3,
                text: '1,000,000'
            }, constants.TEXT_OPTIONS))
        };
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
});

