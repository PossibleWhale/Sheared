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
        version: 4,
        stores: {
            wool: {key: 'color', value: 'count'},
            craft: {key: 'motif', value: 'count'},
            stat: {key: 'name', value: 'value'},
            upgrade: {key: 'name', value: 'value'},
            award: {key: 'name', value: 'value'}
            // DO NOT ADD A TABLE WITHOUT INCREASING SCHEMA VERSION
            // PLEASE
            // KTHX
            //
            // Oh and then write an upgrader function in Storage.js
            //
            // thx again
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
        perm_power: [10000, 20000, 30000, 40000, 50000],
        perm_mult: [10000, 20000, 30000, 40000, 50000],
        perm_diamond: 100000,

        // wool prices. for now they are all the same... we might want them to be different?
        white: 1000,
        red: 1000,
        blue: 1000,
        yellow: 1000,
        black: 1000
    },


    // amount of wool you get from purchasing.. might want to change
    WOOL_QUANTITIES: {
        white: 800,
        red: 800,
        blue: 800,
        yellow: 800,
        black: 800
    },

    // cost, in real dollars, of coins
    EWEROS_PRICES: [
        1, 2, 3, 4, 5
    ],

    // amount of coins you get from purchasing
    EWEROS_QUANTITIES: [
        10000, 30000, 45000, 60000, 75000
    ],

    AWARDS: [
        { key: 'eweros.10', text: '10 Eweros Earned', reward: 20 },
        { key: 'eweros.100', text: '100 Eweros Earned', reward: 40 },
        { key: 'eweros.1000', text: '1000 Eweros Earned', reward: 60 },
        { key: 'eweros.10000', text: '10000 Eweros Earned', reward: 80 },
        { key: 'eweros.100000', text: '100000 Eweros Earned', reward: 100 },

        { key: 'diamonds.1', text: 'Collect 1 Diamond', reward: 20 },
        { key: 'diamonds.10', text: 'Collect 10 Diamonds', reward: 40 },
        { key: 'diamonds.100', text: 'Collect 100 Diamonds', reward: 60 },
        { key: 'diamonds.1000', text: 'Collect 1000 Diamonds', reward: 80 },
        { key: 'diamonds.10000', text: 'Collect 10000 Diamonds', reward: 100 },

        { key: 'batteries.1', text: 'Collect 1 Battery', reward: 20 },
        { key: 'batteries.10', text: 'Collect 10 Batteries', reward: 40 },
        { key: 'batteries.100', text: 'Collect 100 Batteries', reward: 60 },
        { key: 'batteries.1000', text: 'Collect 1000 Batteries', reward: 80 },
        { key: 'batteries.10000', text: 'Collect 10000 Batteries', reward: 100 },

        { key: 'ewes.5', text: 'Shear 5 Ewes', reward: 20 },
        { key: 'ewes.50', text: 'Shear 50 Ewes', reward: 40 },
        { key: 'ewes.500', text: 'Shear 500 Ewes', reward: 60 },
        { key: 'ewes.5000', text: 'Shear 5000 Ewes', reward: 80 },
        { key: 'ewes.50000', text: 'Shear 50000 Ewes', reward: 100 },

        { key: 'ewes.white.1', text: 'Shear 1 White Ewe', reward: 20 },
        { key: 'ewes.white.10', text: 'Shear 10 White Ewes', reward: 40 },
        { key: 'ewes.white.100', text: 'Shear 100 White Ewes', reward: 60 },
        { key: 'ewes.white.1000', text: 'Shear 1000 White Ewes', reward: 80 },
        { key: 'ewes.white.10000', text: 'Shear 10000 White Ewes', reward: 100 },

        { key: 'ewes.red.1', text: 'Shear 1 Red Ewe', reward: 20 },
        { key: 'ewes.red.10', text: 'Shear 10 Red Ewes', reward: 40 },
        { key: 'ewes.red.100', text: 'Shear 100 Red Ewes', reward: 60 },
        { key: 'ewes.red.1000', text: 'Shear 1000 Red Ewes', reward: 80 },
        { key: 'ewes.red.10000', text: 'Shear 10000 Red Ewes', reward: 100 },

        { key: 'ewes.blue.1', text: 'Shear 1 Blue Ewe', reward: 20 },
        { key: 'ewes.blue.10', text: 'Shear 10 Blue Ewes', reward: 40 },
        { key: 'ewes.blue.100', text: 'Shear 100 Blue Ewes', reward: 60 },
        { key: 'ewes.blue.1000', text: 'Shear 1000 Blue Ewes', reward: 80 },
        { key: 'ewes.blue.10000', text: 'Shear 10000 Blue Ewes', reward: 100 },

        { key: 'ewes.yellow.1', text: 'Shear 1 Yellow Ewe', reward: 20 },
        { key: 'ewes.yellow.10', text: 'Shear 10 Yellow Ewes', reward: 40 },
        { key: 'ewes.yellow.100', text: 'Shear 100 Yellow Ewes', reward: 60 },
        { key: 'ewes.yellow.1000', text: 'Shear 1000 Yellow Ewes', reward: 80 },
        { key: 'ewes.yellow.10000', text: 'Shear 10000 Yellow Ewes', reward: 100 },

        { key: 'ewes.black.1', text: 'Shear 1 Black Ewe', reward: 20 },
        { key: 'ewes.black.10', text: 'Shear 10 Black Ewes', reward: 40 },
        { key: 'ewes.black.100', text: 'Shear 100 Black Ewes', reward: 60 },
        { key: 'ewes.black.1000', text: 'Shear 1000 Black Ewes', reward: 80 },
        { key: 'ewes.black.10000', text: 'Shear 10000 Black Ewes', reward: 100 },

        { key: 'rams.5', text: 'Shear 5 Rams', reward: 20 },
        { key: 'rams.50', text: 'Shear 50 Rams', reward: 40 },
        { key: 'rams.500', text: 'Shear 500 Rams', reward: 60 },
        { key: 'rams.5000', text: 'Shear 5000 Rams', reward: 80 },
        { key: 'rams.50000', text: 'Shear 50000 Rams', reward: 100 },

        { key: 'rams.white.1', text: 'Shear 1 White Ram', reward: 20 },
        { key: 'rams.white.10', text: 'Shear 10 White Rams', reward: 40 },
        { key: 'rams.white.100', text: 'Shear 100 White Rams', reward: 60 },
        { key: 'rams.white.1000', text: 'Shear 1000 White Rams', reward: 80 },
        { key: 'rams.white.10000', text: 'Shear 10000 White Rams', reward: 100 },

        { key: 'rams.red.1', text: 'Shear 1 Red Ram', reward: 20 },
        { key: 'rams.red.10', text: 'Shear 10 Red Rams', reward: 40 },
        { key: 'rams.red.100', text: 'Shear 100 Red Rams', reward: 60 },
        { key: 'rams.red.1000', text: 'Shear 1000 Red Rams', reward: 80 },
        { key: 'rams.red.10000', text: 'Shear 10000 Red Rams', reward: 100 },

        { key: 'rams.blue.1', text: 'Shear 1 Blue Ram', reward: 20 },
        { key: 'rams.blue.10', text: 'Shear 10 Blue Rams', reward: 40 },
        { key: 'rams.blue.100', text: 'Shear 100 Blue Rams', reward: 60 },
        { key: 'rams.blue.1000', text: 'Shear 1000 Blue Rams', reward: 80 },
        { key: 'rams.blue.10000', text: 'Shear 10000 Blue Rams', reward: 100 },

        { key: 'rams.yellow.1', text: 'Shear 1 Yellow Ram', reward: 20 },
        { key: 'rams.yellow.10', text: 'Shear 10 Yellow Rams', reward: 40 },
        { key: 'rams.yellow.100', text: 'Shear 100 Yellow Rams', reward: 60 },
        { key: 'rams.yellow.1000', text: 'Shear 1000 Yellow Rams', reward: 80 },
        { key: 'rams.yellow.10000', text: 'Shear 10000 Yellow Rams', reward: 100 },

        { key: 'rams.black.1', text: 'Shear 1 Black Ram', reward: 20 },
        { key: 'rams.black.10', text: 'Shear 10 Black Rams', reward: 40 },
        { key: 'rams.black.100', text: 'Shear 100 Black Rams', reward: 60 },
        { key: 'rams.black.1000', text: 'Shear 1000 Black Rams', reward: 80 },
        { key: 'rams.black.10000', text: 'Shear 10000 Black Rams', reward: 100 },

        { key: 'power.1', text: '+1 Clipper Power', reward: 20 },
        { key: 'power.2', text: '+2 Clipper Power', reward: 40 },
        { key: 'power.3', text: '+3 Clipper Power', reward: 60 },
        { key: 'power.4', text: '+4 Clipper Power', reward: 80 },
        { key: 'power.4', text: '+5 Clipper Power', reward: 100 },
        { key: 'power.max', text: 'Max Clipper Power', reward: 120 },

        { key: 'multiplier.2', text: 'x2 Bolt Multiplier', reward: 20 },
        { key: 'multiplier.3', text: 'x3 Bolt Multiplier', reward: 40 },
        { key: 'multiplier.4', text: 'x4 Bolt Multiplier', reward: 60 },
        { key: 'multiplier.5', text: 'x5 Bolt Multiplier', reward: 80 },
        { key: 'multiplier.6', text: 'x6 Bolt Multiplier', reward: 100 },
        { key: 'multiplier.max', text: 'Max Bolt Multiplier', reward: 120 },

        { key: 'wool.10', text: 'Collected 10 bolts of wool', reward: 20 },
        { key: 'wool.100', text: 'Collected 100 bolts of wool', reward: 40 },
        { key: 'wool.1000', text: 'Collected 1000 bolts of wool', reward: 60 },
        { key: 'wool.10000', text: 'Collected 10000 bolts of wool', reward: 80 },
        { key: 'wool.100000', text: 'Collected 100000 bolts of wool', reward: 100 },

        { key: 'wool.white.2', text: 'Collected 2 bolts of white wool', reward: 20 },
        { key: 'wool.white.20', text: 'Collected 20 bolts of white wool', reward: 40 },
        { key: 'wool.white.200', text: 'Collected 200 bolts of white wool', reward: 60 },
        { key: 'wool.white.2000', text: 'Collected 2000 bolts of white wool', reward: 80 },
        { key: 'wool.white.20000', text: 'Collected 20000 bolts of white wool', reward: 100 },

        { key: 'wool.red.2', text: 'Collected 2 bolts of red wool', reward: 20 },
        { key: 'wool.red.20', text: 'Collected 20 bolts of red wool', reward: 40 },
        { key: 'wool.red.200', text: 'Collected 200 bolts of red wool', reward: 60 },
        { key: 'wool.red.2000', text: 'Collected 2000 bolts of red wool', reward: 80 },
        { key: 'wool.red.20000', text: 'Collected 20000 bolts of red wool', reward: 100 },

        { key: 'wool.blue.2', text: 'Collected 2 bolts of blue wool', reward: 20 },
        { key: 'wool.blue.20', text: 'Collected 20 bolts of blue wool', reward: 40 },
        { key: 'wool.blue.200', text: 'Collected 200 bolts of blue wool', reward: 60 },
        { key: 'wool.blue.2000', text: 'Collected 2000 bolts of blue wool', reward: 80 },
        { key: 'wool.blue.20000', text: 'Collected 20000 bolts of blue wool', reward: 100 },

        { key: 'wool.yellow.2', text: 'Collected 2 bolts of yellow wool', reward: 20 },
        { key: 'wool.yellow.20', text: 'Collected 20 bolts of yellow wool', reward: 40 },
        { key: 'wool.yellow.200', text: 'Collected 200 bolts of yellow wool', reward: 60 },
        { key: 'wool.yellow.2000', text: 'Collected 2000 bolts of yellow wool', reward: 80 },
        { key: 'wool.yellow.20000', text: 'Collected 20000 bolts of yellow wool', reward: 100 },

        { key: 'wool.black.2', text: 'Collected 2 bolts of black wool', reward: 20 },
        { key: 'wool.black.20', text: 'Collected 20 bolts of black wool', reward: 40 },
        { key: 'wool.black.200', text: 'Collected 200 bolts of black wool', reward: 60 },
        { key: 'wool.black.2000', text: 'Collected 2000 bolts of black wool', reward: 80 },
        { key: 'wool.black.20000', text: 'Collected 20000 bolts of black wool', reward: 100 },

        { key: 'crafts.hats', text: 'Crafted all hats', reward: 20 },
        { key: 'crafts.mittens', text: 'Crafted all mittens', reward: 40 },
        { key: 'crafts.socks', text: 'Crafted all socks', reward: 60 },
        { key: 'crafts.scarves', text: 'Crafted all scarves', reward: 80 },
        { key: 'crafts.sweaters', text: 'Crafted all sweaters', reward: 100 },
        { key: 'crafts.white', text: 'Crafted all white items', reward: 120 },
        { key: 'crafts.red', text: 'Crafted all red items', reward: 120 },
        { key: 'crafts.blue', text: 'Crafted all blue items', reward: 120 },
        { key: 'crafts.yellow', text: 'Crafted all yellow items', reward: 120 },
        { key: 'crafts.black', text: 'Crafted all black items', reward: 120 },
        { key: 'crafts.all', text: 'Crafted all items', reward: 140 }
    ]
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

exports.garments = [exports.GARMENT_HAT, exports.GARMENT_MITTEN,
    exports.GARMENT_SOCK, exports.GARMENT_SCARF, exports.GARMENT_SWEATER];
exports.garmentsByLabel = indexByLabel(exports.garments);
