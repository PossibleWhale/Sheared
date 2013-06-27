"use strict";

import src.constants as c;

exports = function Craft(garment, main, contrast, monogram) {
    this.colors.main = main || c.COLOR_NONE;
    this.colors.contrast = contrast || c.COLOR_NONE;
    this.garment = garment || c.GARMENT_NAKED;
    this.monogram = monogram || '';
};

