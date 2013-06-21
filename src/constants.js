"use strict";

var imagePath = 'resources/images/';

exports = {
    COLOR_NONE: null,

    COLOR_WHITE: {
        label: 'white',
        image: imagePath + 'ewe-white.png',
        weight: 2
    },
    COLOR_RED: {
        label: 'red',
        image: imagePath + 'ewe-red.png',
        weight: 2
    },
    COLOR_GREEN: {
        label: 'green',
        image: imagePath + 'ewe-green.png',
        weight: 2
    },
    COLOR_BLUE: {
        label: 'blue',
        image: imagePath + 'ewe-blue.png',
        weight: 2
    },
    COLOR_YELLOW: {
        label: 'yellow',
        image: imagePath + 'ewe-yellow.png',
        weight: 2
    },
    COLOR_BLACK: {
        label: 'black',
        image: imagePath + 'ewe-black.png',
        weight: 1
    },

    GARMENT_NAKED: null,

    GARMENT_YARN: 
        {label: 'yarn', cost: {fringe: 0, body: 1}},
    GARMENT_HAT: 
        {label: 'hat', cost: {fringe: 1, body: 2}},
    GARMENT_SOCK: 
        {label: 'sock', cost: {fringe: 1, body: 3}},
    GARMENT_SCARF: 
        {label: 'scarf', cost: {fringe: 3, body: 6}},
    GARMENT_MITTEN: 
        {label: 'mitten', cost: {fringe: 1, body: 2}},
    GARMENT_SWEATER: 
        {label: 'sweater', cost: {fringe: 5, body: 20}},
};

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
