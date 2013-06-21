"use strict";

import src.constants as c;

exports = function Craft(garment, base, trim, monogram) {
    this.colors.base = base || c.COLOR_NONE;
    this.colors.trim = trim || c.COLOR_NONE;
    this.garment = garment || c.GARMENT_NAKED;
    this.monogram = monogram || '';
};

