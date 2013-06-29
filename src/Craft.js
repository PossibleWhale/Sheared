"use strict";

import src.constants as c;

exports = function Craft(garment, main, contrast, monogram) {
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
};

