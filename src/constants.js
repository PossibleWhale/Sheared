"use strict";

var imagePath = 'resources/images/';

exports = {
    COLOR_NONE: null,

    COLOR_WHITE: {
        label: 'white',
        eweImage: imagePath + 'ewe-white.png',
        ramImage: imagePath + 'ram-white.png',
        rarity: 2.00
    },
    COLOR_RED: {
        label: 'red',
        eweImage: imagePath + 'ewe-red.png',
        ramImage: imagePath + 'ram-red.png',
        rarity: 1.00
    },
    COLOR_BLUE: {
        label: 'blue',
        eweImage: imagePath + 'ewe-blue.png',
        ramImage: imagePath + 'ram-blue.png',
        rarity: 1.00
    },
    COLOR_YELLOW: {
        label: 'yellow',
        eweImage: imagePath + 'ewe-yellow.png',
        ramImage: imagePath + 'ram-yellow.png',
        rarity: 1.00
    },
    COLOR_BLACK: {
        label: 'black',
        eweImage: imagePath + 'ewe-black.png',
        ramImage: imagePath + 'ram-black.png',
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

exports.colors = [exports.COLOR_WHITE, exports.COLOR_RED,
    exports.COLOR_BLUE, exports.COLOR_YELLOW, exports.COLOR_BLACK];
exports.colorsByLabel = indexByLabel(exports.colors);

exports.garments = [exports.GARMENT_YARN, exports.GARMENT_HAT, exports.GARMENT_SOCK,
    exports.GARMENT_SCARF, exports.GARMENT_MITTEN, exports.GARMENT_SWEATER];
exports.garmentsByLabel = indexByLabel(exports.garments);

exports.fenceSize = 80;
exports.laneSize = 52;

exports.days = [];
for (var i = 0; i < 7; i++) {
    exports.days.push({
        sheepFrequency: (2 - (i * 1/6))*1000, // delay between sheep spawns
        rams: true // TODO only have rams on some days
    });
}
