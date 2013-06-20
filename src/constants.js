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

    TYPE_CAP: 
        {label: 'cap'},
    TYPE_SOCK: 
        {label: 'sock'},
    TYPE_SCARF: 
        {label: 'scarf'},
    TYPE_MITTEN: 
        {label: 'scarf'},
    TYPE_SWEATER: 
        {label: 'scarf'}
};
exports.colors = [exports.COLOR_WHITE, exports.COLOR_RED, exports.COLOR_GREEN,
    exports.COLOR_BLUE, exports.COLOR_YELLOW, exports.COLOR_BLACK];

