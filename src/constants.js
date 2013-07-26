var imagePath = 'resources/images/';

exports = {
    WIGGLE_RADIANS: Math.PI / 32,

    AD_SUPPRESS_TIME: 120000, // minimum time between ads, in milliseconds

    TEXT_OPTIONS: {
        x: (1024-800)/2,
        y: (576-400)/2,
        width: 800,
        height: 400,
        color: '#FFFFFF',
        fontFamily: 'delius',
        strokeWidth: 6,
        strokeColor: '#333333',
        wrap: true,
        size: 64,
        verticalAlign: 'middle',
        shadowColor: '#000000',
        autoFontSize: true
    },

    SPLASH_TIME: 3000, // how long the GameClosure splash screen will be shown, in milliseconds

    COLOR_NONE: {label: 'none'},

    SCHEMA: {
        version: 1,
        stores: {
            wool: {key: 'color', value: 'count'},
            craft: {key: 'motif', value: 'count'},
            stat: {key: 'name', value: 'value'},
            upgrade: {key: 'name', value: 'value'}
        }
    },

    // Given rarity R, value V of the corresponding wool is:
    //
    //    V = 0.20 / R

    COLOR_WHITE: {
        label: 'white',
        eweImage: imagePath + 'ewe-white.png',
        ramImage: imagePath + 'ram-white.png',
        rarity: 1.00
    },
    COLOR_RED: {
        label: 'red',
        eweImage: imagePath + 'ewe-red.png',
        ramImage: imagePath + 'ram-red.png',
        rarity: 0.57
    },
    COLOR_BLUE: {
        label: 'blue',
        eweImage: imagePath + 'ewe-blue.png',
        ramImage: imagePath + 'ram-blue.png',
        rarity: 0.57
    },
    COLOR_YELLOW: {
        label: 'yellow',
        eweImage: imagePath + 'ewe-yellow.png',
        ramImage: imagePath + 'ram-yellow.png',
        rarity: 0.57
    },
    COLOR_BLACK: {
        label: 'black',
        eweImage: imagePath + 'ewe-black.png',
        ramImage: imagePath + 'ram-black.png',
        rarity: 0.40
    },

    GARMENT_NAKED: {label: 'naked'},

    GARMENT_HAT: {
        label: 'hat',
        cost: {contrast: 2, main: 10}
    },
    GARMENT_SOCK: {
        label: 'sock',
        cost: {contrast: 10, main: 26}
    },
    GARMENT_SCARF: {
        label: 'scarf',
        cost: {contrast: 14, main: 34}
    },
    GARMENT_MITTEN: {
        label: 'mitten',
        cost: {contrast: 6, main: 18}
    },
    GARMENT_SWEATER: {
        label: 'sweater',
        cost: {contrast: 18, main: 42}
    },

    SHOP_NAMES: [
        "On the Lamb",
        "Shear Elegance",
        "Yarn Ever Gonna Believe It",
        "Knit Picky",
        "Wool Gathering",
        "Purls Before Swine",
        "All's Wool That Ends Wool",
        "I Yarn for You",
        "Yarn's Revenge",
        "Where's Wooly?",
        "Woolpower",
        "Knit in Shining Armor",
        "Wool of a Good Time",
        "Lambic Pentameter",
        "Everywhere That Mary Went"
    ],

    fenceSize: 80,
    laneSize: 52,
    ramRarity: 0.3,

    UPGRADE_PRICES: {
        temp_power: [1000, 2000, 3000, 4000, 5000],
        temp_mult: [1000, 2000, 3000, 4000, 5000],
        temp_diamond: 10000,
        perm_power: [100000, 200000, 300000, 400000, 500000],
        perm_mult: [100000, 200000, 300000, 400000, 500000],
        perm_diamond: 1000000
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

exports.garments = [exports.GARMENT_HAT, exports.GARMENT_SOCK,
    exports.GARMENT_SCARF, exports.GARMENT_MITTEN, exports.GARMENT_SWEATER];
exports.garmentsByLabel = indexByLabel(exports.garments);

