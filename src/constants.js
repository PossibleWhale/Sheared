"use strict";

exports = {
    COLOR_NONE: null,

    COLOR_WHITE: 
        {label: 'white', weight: 2},
    COLOR_RED: 
        {label: 'red', weight: 2},
    COLOR_GREEN:
        {label: 'green', weight: 2},
    COLOR_BLUE:
        {label: 'blue', weight: 2},
    COLOR_YELLOW:
        {label: 'yellow', weight: 2},
    COLOR_BLACK: 
        {label: 'black', weight: 1},

    TYPE_NAKED: null,

    TYPE_YARN: 
        {label: 'yarn'},
    TYPE_CAP: 
        {label: 'cap'},
    TYPE_SOCK: 
        {label: 'sock'},
    TYPE_SCARF: 
        {label: 'scarf'},
    TYPE_MITTEN: 
        {label: 'mitten'},
    TYPE_SWEATER: 
        {label: 'sweater'}
};
exports.colors = [exports.COLOR_WHITE, exports.COLOR_RED, exports.COLOR_GREEN,
    exports.COLOR_BLUE, exports.COLOR_YELLOW, exports.COLOR_BLACK];

exports.garments = [exports.TYPE_YARN, exports.TYPE_CAP, exports.TYPE_SOCK,
    exports.TYPE_SCARF, exports.TYPE_MITTEN, exports.TYPE_SWEATER];
