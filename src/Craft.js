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

        this.toMotif = bind(this, function () {
            return this.garment.label + '|' + this.colors.main.label + '|' + this.colors.contrast.label;
        });

        // return 2-array of [main, contrast] as objects
        this.cost = bind(this, function () {
            var ret = [];
            vMainWool = 0.2 / this.colors.main.rarity;
            vContrastWool = 0.2 / this.colors.contrast.rarity;

            ret.push({color: this.colors.main,
                amount: this.garment.cost.main,
                dollars: this.garment.cost.main * vMainWool
            });

            ret.push({color: this.colors.contrast,
                amount: this.garment.cost.contrast,
                dollars: this.garment.cost.contrast * vContrastWool
            });
            return ret;
        });

        this.dollars = bind(this, function (count) {
            if (count === undefined) {
                count = 1;
            }
            costs = this.cost();
            return (count * (costs[0].dollars + costs[1].dollars));
        });

        this.formatDollars = bind(this, function (count) {
            return this.dollars(count).toFixed(2);
        });
    }
});

