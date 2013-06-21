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

    TYPE_NAKED: null,

    TYPE_YARN: 
        {label: 'yarn', cost: {fringe: 0, body: 1}},
    TYPE_HAT: 
        {label: 'hat', cost: {fringe: 1, body: 2}},
    TYPE_SOCK: 
        {label: 'sock', cost: {fringe: 1, body: 3}},
    TYPE_SCARF: 
        {label: 'scarf', cost: {fringe: 3, body: 6}},
    TYPE_MITTEN: 
        {label: 'mitten', cost: {fringe: 1, body: 2}},
    TYPE_SWEATER: 
        {label: 'sweater', cost: {fringe: 5, body: 20}},
};
exports.colors = [exports.COLOR_WHITE, exports.COLOR_RED, exports.COLOR_GREEN,
    exports.COLOR_BLUE, exports.COLOR_YELLOW, exports.COLOR_BLACK];

exports.garments = [exports.TYPE_YARN, exports.TYPE_HAT, exports.TYPE_SOCK,
    exports.TYPE_SCARF, exports.TYPE_MITTEN, exports.TYPE_SWEATER];
