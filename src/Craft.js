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
        this.mainWoolCost = new Button({x: 32, y: 134, width: 46, height: 46,
            superview: this});
        this.contrastWoolCost = new Button({x: 312, y: 134, width: 46, height: 46,
            superview: this});
        this.value = new Button({x: 305, y: 0, width: 76, height: 36,
            superview: this});

        this.buyButton.on('InputSelect', bind(this, this.purchased));
    };

    this.purchased = function () {
        GC.app.audio.playBuyGarment();
        this.emit('largeCraft:purchased');
    };

    /*
     * display the widget somewhere
     * pass in {x: .., y: .., superview: .., enabled: true|false}
     */
    this.enable = function (enabled) {
        var costs, eweros;
        if (enabled === undefined || enabled) {
            this.setImage('resources/images/' +
                    this.garment.label + '-' +
                    this.colors.main.label + '-' +
                    this.colors.contrast.label + '-large.png');
        } else {
            this.setImage('resources/images/' + this.garment.label + '-disabled-large.png');
        }
        costs = this.cost();
        this.mainWoolCost.setText(costs[0].amount);
        this.contrastWoolCost.setText(costs[1].amount);

        eweros = this.eweros();
        this.value.setText(eweros ? eweros : '-');
    };

    // return 2-array of [main, contrast] as objects
    this.cost = function _a_cost() {
        var ret = [];
        vMainWool = Math.round(1 / this.colors.main.rarity, 0);
        vContrastWool = Math.round(1 / this.colors.contrast.rarity, 0);

        ret.push({color: this.colors.main,
            amount: this.garment.cost.main,
            eweros: this.garment.cost.main * vMainWool
        });

        ret.push({color: this.colors.contrast,
            amount: this.garment.cost.contrast,
            eweros: this.garment.cost.contrast * vContrastWool
        });
        return ret;
    };

    this.toMotif = function _a_toMotif() {
        return this.garment.label + '|' + this.colors.main.label + '|' + this.colors.contrast.label;
    };

    this.eweros = function _a_eweros(count) {
        if (count === undefined) {
            count = 1;
        }
        costs = this.cost();
        return (count * (costs[0].eweros + costs[1].eweros));
    };

    this.formatDollars = function _a_formatDollars(count) {
        return this.eweros(count).toFixed(2);
    };
});

