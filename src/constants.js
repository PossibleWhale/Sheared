"use strict";

var imagePath = 'resources/images/';

exports = {
    COLOR_NONE: null,

    COLOR_WHITE: {
        label: 'white',
        image: imagePath + 'ewe-white.png',
        weight: 2,
        rarity: 2.00
    },
    COLOR_RED: {
        label: 'red',
        image: imagePath + 'ewe-red.png',
        weight: 2,
        rarity: 1.00
    },
    COLOR_GREEN: {
        label: 'green',
        image: imagePath + 'ewe-green.png',
        weight: 2,
        rarity: 1.00
    },
    COLOR_BLUE: {
        label: 'blue',
        image: imagePath + 'ewe-blue.png',
        weight: 2,
        rarity: 1.00
    },
    COLOR_YELLOW: {
        label: 'yellow',
        image: imagePath + 'ewe-yellow.png',
        weight: 2,
        rarity: 1.00
    },
    COLOR_BLACK: {
        label: 'black',
        image: imagePath + 'ewe-black.png',
        weight: 1,
        rarity: 0.50
    },

    GARMENT_NAKED: null,

    GARMENT_YARN: {
        label: 'yarn', 
        cost: {fringe: 0, body: 1},
        price: 1.00
    },
    GARMENT_HAT: {
        label: 'hat', 
        cost: {fringe: 1, body: 5},
        price: 6.00
    },
    GARMENT_SOCK: {
        label: 'sock', 
        cost: {fringe: 5, body: 13},
        price: 18.00
    },
    GARMENT_SCARF: {
        label: 'scarf', 
        cost: {fringe: 7, body: 17},
        price: 24.00
    },
    GARMENT_MITTEN: {
        label: 'mitten', 
        cost: {fringe: 3, body: 9},
        price: 12.00
    },
    GARMENT_SWEATER: {
        label: 'sweater', 
        cost: {fringe: 9, body: 21},
        price: 30.00
    }
};

// build a mapping for looking up each kind of object
function indexByLabel(objs) {
    var r = {};
    for (var i = 0; i < objs.length; i++) {
        var o = objs[i];
        r[o.label] = o;
    }
    return r;
}

exports.colors = [exports.COLOR_WHITE, exports.COLOR_RED, exports.COLOR_GREEN,
    exports.COLOR_BLUE, exports.COLOR_YELLOW, exports.COLOR_BLACK];
exports.colorsByLabel = indexByLabel(exports.colors);


exports.garments = [exports.GARMENT_YARN, exports.GARMENT_HAT, exports.GARMENT_SOCK,
    exports.GARMENT_SCARF, exports.GARMENT_MITTEN, exports.GARMENT_SWEATER];
exports.garmentsByLabel = indexByLabel(exports.garments);
