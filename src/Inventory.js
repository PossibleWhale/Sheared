"use strict";

import constants;

exports = {
    Inventory: function () {
        this.wool = {};
        this.wool.red = 0;
        this.wool.blue = 0;
        this.wool.green = 0;
        this.wool.yellow = 0;
        this.wool.white = 0;
        this.wool.black = 0;

        this.crafts = [];
    },

    Craft: function () {
        this.colors = {};
        this.colors.base = constants.COLOR_NONE;
        this.colors.trim = constants.COLOR_NONE;
        this.type = constants.TYPE_NAKED;
        this.monogram = '';
    }
};

