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
        version: 7,
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
    ramRarity: 0.2,

    UPGRADE_PRICES: {
        power: [250, 500,  1000, 2000, 4000],
        mult:  [500, 1000, 2000, 4000, 8000],
        blade: [750, 1500, 3000, 6000, 12000],
        diamond: 24000,

        // wool prices. for now they are all the same... we might want them to be different?
        white: 1000,
        red: 1500,
        blue: 1500,
        yellow: 1500,
        black: 2000
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
        8000, 16000, 24000, 48000, 72000 
    ],

    AWARDS: {
        'eweros.10': { text: '10 Eweros Earned', reward: 75 },
        'eweros.100': { text: '100 Eweros Earned', reward: 150 },
        'eweros.1000': { text: '1000 Eweros Earned', reward: 300 },
        'eweros.10000': { text: '10000 Eweros Earned', reward: 600 },
        'eweros.100000': { text: '100000 Eweros Earned', reward: 1200 },

        'diamonds.1': { text: 'Collect 1 Diamond', reward: 75 },
        'diamonds.10': { text: 'Collect 10 Diamonds', reward: 150 },
        'diamonds.100': { text: 'Collect 100 Diamonds', reward: 300 },
        'diamonds.1000': { text: 'Collect 1000 Diamonds', reward: 600 },
        'diamonds.10000': { text: 'Collect 10000 Diamonds', reward: 1200 },

        'batteries.1': { text: 'Collect 1 Battery', reward: 75 },
        'batteries.10': { text: 'Collect 10 Batteries', reward: 150 },
        'batteries.100': { text: 'Collect 100 Batteries', reward: 300 },
        'batteries.1000': { text: 'Collect 1000 Batteries', reward: 600 },
        'batteries.10000': { text: 'Collect 10000 Batteries', reward: 1200 },

        'ewes.5': { text: 'Shear 5 Ewes', reward: 50 },
        'ewes.50': { text: 'Shear 50 Ewes', reward: 100 },
        'ewes.500': { text: 'Shear 500 Ewes', reward: 200 },
        'ewes.5000': { text: 'Shear 5000 Ewes', reward: 400 },
        'ewes.50000': { text: 'Shear 50000 Ewes', reward: 800 },

        'ewes.white.1': { text: 'Shear 1 White Ewe', reward: 75 },
        'ewes.white.10': { text: 'Shear 10 White Ewes', reward: 150 },
        'ewes.white.100': { text: 'Shear 100 White Ewes', reward: 300 },
        'ewes.white.1000': { text: 'Shear 1000 White Ewes', reward: 600 },
        'ewes.white.10000': { text: 'Shear 10000 White Ewes', reward: 1200 },

        'ewes.red.1': { text: 'Shear 1 Red Ewe', reward: 100 },
        'ewes.red.10': { text: 'Shear 10 Red Ewes', reward: 200 },
        'ewes.red.100': { text: 'Shear 100 Red Ewes', reward: 400 },
        'ewes.red.1000': { text: 'Shear 1000 Red Ewes', reward: 800 },
        'ewes.red.10000': { text: 'Shear 10000 Red Ewes', reward: 1600 },

        'ewes.blue.1': { text: 'Shear 1 Blue Ewe', reward: 100 },
        'ewes.blue.10': { text: 'Shear 10 Blue Ewes', reward: 200 },
        'ewes.blue.100': { text: 'Shear 100 Blue Ewes', reward: 400 },
        'ewes.blue.1000': { text: 'Shear 1000 Blue Ewes', reward: 800 },
        'ewes.blue.10000': { text: 'Shear 10000 Blue Ewes', reward: 1600 },

        'ewes.yellow.1': { text: 'Shear 1 Yellow Ewe', reward: 100 },
        'ewes.yellow.10': { text: 'Shear 10 Yellow Ewes', reward: 200 },
        'ewes.yellow.100': { text: 'Shear 100 Yellow Ewes', reward: 400 },
        'ewes.yellow.1000': { text: 'Shear 1000 Yellow Ewes', reward: 800 },
        'ewes.yellow.10000': { text: 'Shear 10000 Yellow Ewes', reward: 1600 },

        'ewes.black.1': { text: 'Shear 1 Black Ewe', reward: 125 },
        'ewes.black.10': { text: 'Shear 10 Black Ewes', reward: 250 },
        'ewes.black.100': { text: 'Shear 100 Black Ewes', reward: 500 },
        'ewes.black.1000': { text: 'Shear 1000 Black Ewes', reward: 1000 },
        'ewes.black.10000': { text: 'Shear 10000 Black Ewes', reward: 2000 },

        'rams.5': { text: 'Shear 5 Rams', reward: 75 },
        'rams.50': { text: 'Shear 50 Rams', reward: 150 },
        'rams.500': { text: 'Shear 500 Rams', reward: 300 },
        'rams.5000': { text: 'Shear 5000 Rams', reward: 600 },
        'rams.50000': { text: 'Shear 50000 Rams', reward: 1200 },

        'rams.white.1': { text: 'Shear 1 White Ram', reward: 100 },
        'rams.white.10': { text: 'Shear 10 White Rams', reward: 200 },
        'rams.white.100': { text: 'Shear 100 White Rams', reward: 400 },
        'rams.white.1000': { text: 'Shear 1000 White Rams', reward: 800 },
        'rams.white.10000': { text: 'Shear 10000 White Rams', reward: 1600 },

        'rams.red.1': { text: 'Shear 1 Red Ram', reward: 125 },
        'rams.red.10': { text: 'Shear 10 Red Rams', reward: 250 },
        'rams.red.100': { text: 'Shear 100 Red Rams', reward: 500 },
        'rams.red.1000': { text: 'Shear 1000 Red Rams', reward: 1000 },
        'rams.red.10000': { text: 'Shear 10000 Red Rams', reward: 2000 },

        'rams.blue.1': { text: 'Shear 1 Blue Ram', reward: 125 },
        'rams.blue.10': { text: 'Shear 10 Blue Rams', reward: 250 },
        'rams.blue.100': { text: 'Shear 100 Blue Rams', reward: 500 },
        'rams.blue.1000': { text: 'Shear 1000 Blue Rams', reward: 1000 },
        'rams.blue.10000': { text: 'Shear 10000 Blue Rams', reward: 2000 },

        'rams.yellow.1': { text: 'Shear 1 Yellow Ram', reward: 125 },
        'rams.yellow.10': { text: 'Shear 10 Yellow Rams', reward: 250 },
        'rams.yellow.100': { text: 'Shear 100 Yellow Rams', reward: 500 },
        'rams.yellow.1000': { text: 'Shear 1000 Yellow Rams', reward: 1000 },
        'rams.yellow.10000': { text: 'Shear 10000 Yellow Rams', reward: 2000 },

        'rams.black.1': { text: 'Shear 1 Black Ram', reward: 150 },
        'rams.black.10': { text: 'Shear 10 Black Rams', reward: 300 },
        'rams.black.100': { text: 'Shear 100 Black Rams', reward: 600 },
        'rams.black.1000': { text: 'Shear 1000 Black Rams', reward: 1200 },
        'rams.black.10000': { text: 'Shear 10000 Black Rams', reward: 2400 },

        'power.1': { text: '+1 Clipper Power', reward: 25 },
        'power.2': { text: '+2 Clipper Power', reward: 50 },
        'power.3': { text: '+3 Clipper Power', reward: 100 },
        'power.4': { text: '+4 Clipper Power', reward: 200 },
        'power.max': { text: 'Max Clipper Power', reward: 400 },

        'multiplier.2': { text: 'x2 Bolt Multiplier', reward: 50 },
        'multiplier.3': { text: 'x3 Bolt Multiplier', reward: 100 },
        'multiplier.4': { text: 'x4 Bolt Multiplier', reward: 200 },
        'multiplier.5': { text: 'x5 Bolt Multiplier', reward: 400 },
        'multiplier.max': { text: 'Max Bolt Multiplier', reward: 800 },

        'bladepower.1': { text: '+1 Blade Power', reward: 75 },
        'bladepower.2': { text: '+2 Blade Power', reward: 150 },
        'bladepower.3': { text: '+3 Blade Power', reward: 300 },
        'bladepower.4': { text: '+4 Blade Power', reward: 600 },
        'bladepower.max': { text: 'Max Blade Power', reward: 1200 },

        'wool.10': { text: 'Collect 10 bolts of wool', reward: 25 },
        'wool.100': { text: 'Collect 100 bolts of wool', reward: 50 },
        'wool.1000': { text: 'Collect 1000 bolts of wool', reward: 100 },
        'wool.10000': { text: 'Collect 10000 bolts of wool', reward: 200 },
        'wool.100000': { text: 'Collect 100000 bolts of wool', reward: 400 },

        'wool.white.2': { text: 'Collect 2 bolts of white wool', reward: 50 },
        'wool.white.20': { text: 'Collect 20 bolts of white wool', reward: 100 },
        'wool.white.200': { text: 'Collect 200 bolts of white wool', reward: 200 },
        'wool.white.2000': { text: 'Collect 2000 bolts of white wool', reward: 400 },
        'wool.white.20000': { text: 'Collect 20000 bolts of white wool', reward: 800 },

        'wool.red.2': { text: 'Collect 2 bolts of red wool', reward: 75 },
        'wool.red.20': { text: 'Collect 20 bolts of red wool', reward: 150 },
        'wool.red.200': { text: 'Collect 200 bolts of red wool', reward: 300 },
        'wool.red.2000': { text: 'Collect 2000 bolts of red wool', reward: 600 },
        'wool.red.20000': { text: 'Collect 20000 bolts of red wool', reward: 1200 },

        'wool.blue.2': { text: 'Collect 2 bolts of blue wool', reward: 75 },
        'wool.blue.20': { text: 'Collect 20 bolts of blue wool', reward: 150 },
        'wool.blue.200': { text: 'Collect 200 bolts of blue wool', reward: 300 },
        'wool.blue.2000': { text: 'Collect 2000 bolts of blue wool', reward: 600 },
        'wool.blue.20000': { text: 'Collect 20000 bolts of blue wool', reward: 1200 },

        'wool.yellow.2': { text: 'Collect 2 bolts of yellow wool', reward: 75 },
        'wool.yellow.20': { text: 'Collect 20 bolts of yellow wool', reward: 150 },
        'wool.yellow.200': { text: 'Collect 200 bolts of yellow wool', reward: 300 },
        'wool.yellow.2000': { text: 'Collect 2000 bolts of yellow wool', reward: 600 },
        'wool.yellow.20000': { text: 'Collect 20000 bolts of yellow wool', reward: 1200 },

        'wool.black.2': { text: 'Collect 2 bolts of black wool', reward: 100 },
        'wool.black.20': { text: 'Collect 20 bolts of black wool', reward: 200 },
        'wool.black.200': { text: 'Collect 200 bolts of black wool', reward: 400 },
        'wool.black.2000': { text: 'Collect 2000 bolts of black wool', reward: 800 },
        'wool.black.20000': { text: 'Collect 20000 bolts of black wool', reward: 1600 },

        'crafts.hats': { text: 'Craft all hats', reward: 50 },
        'crafts.mittens': { text: 'Craft all mittens', reward: 100 },
        'crafts.socks': { text: 'Craft all socks', reward: 150 },
        'crafts.scarves': { text: 'Craft all scarves', reward: 200 },
        'crafts.sweaters': { text: 'Craft all sweaters', reward: 250 },
        'crafts.white': { text: 'Craft all white items', reward: 500 },
        'crafts.red': { text: 'Craft all red items', reward: 750 },
        'crafts.blue': { text: 'Craft all blue items', reward: 750 },
        'crafts.yellow': { text: 'Craft all yellow items', reward: 750 },
        'crafts.black': { text: 'Craft all black items', reward: 1000 },
        'crafts.all': { text: 'Craft all items', reward: 3000 }
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

exports.garments = [exports.GARMENT_HAT, exports.GARMENT_MITTEN,
    exports.GARMENT_SOCK, exports.GARMENT_SCARF, exports.GARMENT_SWEATER];
exports.garmentsByLabel = indexByLabel(exports.garments);
