import event.Emitter as Emitter;

import src.constants as c;

exports = Class(Emitter, function (supr) {
    this.init = function (garment, main, contrast, monogram) {
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

