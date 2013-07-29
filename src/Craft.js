import ui.ImageView as ImageView;

import src.constants as c;
import src.Button as Button;


exports = Class(ImageView, function (supr) {
    this.init = function (garment, main, contrast, monogram) {
        opts = {x: 0, y: 0, width: 394, height: 325};
        supr(this, 'init', [opts]);

        this.colors = {};
        if (typeof garment === 'string') {
            garment = c.garmentsByLabel[garment];
        }
        if (typeof main === 'string') {
            main = c.colorsByLabel[main];
        }
        if (typeof contrast === 'string') {
            contrast = c.colorsByLabel[contrast];
        }
        this.colors.main = main || c.COLOR_NONE;
        this.colors.contrast = contrast || c.COLOR_NONE;
        this.garment = garment || c.GARMENT_NAKED;
        this.monogram = monogram || '';

        this.buyButton = new Button({x: 149, y: 283, width: 96, height: 37,
            superview: this});
        this.mainWoolCost = new Button({x: 29, y: 135, width: 55, height: 55,
            superview: this});
        this.contrastWoolCost = new Button({x: 309, y: 135, width: 55, height: 55,
            superview: this});
        this.value = new Button({x: 305, y: 0, width: 76, height: 48,
            superview: this});

        this.buyButton.on('InputSelect', bind(this, function _a_onBuyButtonClick() {
            GC.app.audio.playBuyGarment();
            this.emit('largeCraft:purchased');
        }));
    };

    /*
     * display the widget somewhere
     * pass in {x: .., y: .., superview: .., enabled: true|false}
     */
    this.show = function (opts) {
        var enabled = opts.enabled;
        delete opts.enabled;
        if (enabled) {
            this.setImage('resources/images/' +
                    this.garment.label + '-' +
                    this.colors.main.label + '-' +
                    this.colors.contrast.label + '-large.png');
        } else {
            this.setImage('resources/images/' + this.garment.label + '-disabled-large.png');
        }
        this.updateOpts(opts);
    };

    // return 2-array of [main, contrast] as objects
    this.cost = function _a_cost() {
        var ret = [];
        vMainWool = Math.round(1 / this.colors.main.rarity, 0);
        vContrastWool = Math.round(1 / this.colors.contrast.rarity, 0);

        ret.push({color: this.colors.main,
            amount: this.garment.cost.main,
            dollars: this.garment.cost.main * vMainWool
        });

        ret.push({color: this.colors.contrast,
            amount: this.garment.cost.contrast,
            dollars: this.garment.cost.contrast * vContrastWool
        });
        return ret;
    };

    this.toMotif = function _a_toMotif() {
        return this.garment.label + '|' + this.colors.main.label + '|' + this.colors.contrast.label;
    };

    this.dollars = function _a_dollars(count) {
        if (count === undefined) {
            count = 1;
        }
        costs = this.cost();
        return (count * (costs[0].dollars + costs[1].dollars));
    };

    this.formatDollars = function _a_formatDollars(count) {
        return this.dollars(count).toFixed(2);
    };
});

