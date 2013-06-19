"use strict";

import src.constants as constants;

exports = function Craft() {
    this.colors = {};
    this.colors.base = constants.COLOR_NONE;
    this.colors.trim = constants.COLOR_NONE;
    this.type = constants.TYPE_NAKED;
    this.monogram = '';
};

