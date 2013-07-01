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
            ret.push({color: this.colors.main, amount: this.garment.cost.main});
            ret.push({color: this.colors.contrast, amount: this.garment.cost.contrast});
            return ret;
        });
    }
});

