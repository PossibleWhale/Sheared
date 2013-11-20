import ui.resource.Image as Image;

var imagePath = 'resources/images/';

exports = {
    WIGGLE_RADIANS: Math.PI / 32,

    AD_SUPPRESS_TIME: 120000, // minimum time between ads, in milliseconds

    TEXT_OPTIONS: {
        x: (1024-800)/2,
        y: (576-400)/2,
        width: 800,
        height: 400,
        color: '#ffffff',
        fontFamily: 'delius',
        strokeWidth: 6,
        strokeColor: '#333333',
        wrap: true,
        size: 64,
        verticalAlign: 'middle',
        shadowColor: '#000000',
        autoFontSize: true
    },

    SPLASH_TIME: 3000, // How long the GameClosure splash screen will be
                       // shown, in ms

    SPIN_DELAY: 300, // If a view takes too long to load, this is the delay
                     // before a spinner appears

    COLOR_NONE: {label: 'none'},

    SCHEMA: {
        version: 9,
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
        eweImage: new Image({url: imagePath + 'ewe-white.png'}),
        ramImage: new Image({url: imagePath + 'ram-white.png'}),
        rarity: 1.00
    },
    COLOR_RED: {
        label: 'red',
        eweImage: new Image({url: imagePath + 'ewe-red.png'}),
        ramImage: new Image({url: imagePath + 'ram-red.png'}),
        rarity: 0.57
    },
    COLOR_BLUE: {
        label: 'blue',
        eweImage: new Image({url: imagePath + 'ewe-blue.png'}),
        ramImage: new Image({url: imagePath + 'ram-blue.png'}),
        rarity: 0.57
    },
    COLOR_YELLOW: {
        label: 'yellow',
        eweImage: new Image({url: imagePath + 'ewe-yellow.png'}),
        ramImage: new Image({url: imagePath + 'ram-yellow.png'}),
        rarity: 0.57
    },
    COLOR_BLACK: {
        label: 'black',
        eweImage: new Image({url: imagePath + 'ewe-black.png'}),
        ramImage: new Image({url: imagePath + 'ram-black.png'}),
        rarity: 0.40
    },
    COLOR_GOLD: {
        label: 'gold',
        eweImage: new Image({url: imagePath + 'ewe-gold.png'}),
        ramImage: new Image({url: imagePath + 'ram-gold.png'}),
        rarity: 0.15
    },

    GARMENT_NAKED: {label: 'naked'},

    GARMENT_HAT: {
        label: 'hat',
        cost: {contrast: 8, main: 32},
        disabledImage: new Image({url: imagePath + 'hat-disabled.png'})
    },
    GARMENT_MITTEN: {
        label: 'mitten',
        cost: {contrast: 16, main: 64},
        disabledImage: new Image({url: imagePath + 'mitten-disabled.png'})
    },
    GARMENT_SOCK: {
        label: 'sock',
        cost: {contrast: 32, main: 128},
        disabledImage: new Image({url: imagePath + 'sock-disabled.png'})
    },
    GARMENT_SCARF: {
        label: 'scarf',
        cost: {contrast: 64, main: 256},
        disabledImage: new Image({url: imagePath + 'scarf-disabled.png'})
    },
    GARMENT_SWEATER: {
        label: 'sweater',
        cost: {contrast: 128, main: 512},
        disabledImage: new Image({url: imagePath + 'sweater-disabled.png'})
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
    pigRarity: 0.05,

    diamondImage: new Image({url: imagePath + 'diamond.png'}),
    batteryImage: new Image({url: imagePath + 'battery.png'}),
    soundOnImage: new Image({url: imagePath + 'button-sound-on.png'}),
    soundOffImage: new Image({url: imagePath + 'button-sound-off.png'}),
    soundPartialImage: new Image({url: imagePath + 'button-sound-partial.png'}),
    regularBladeImage: new Image({url: imagePath + 'blade-regular.png'}),
    diamondBladeImage: new Image({url: imagePath + 'blade-diamond.png'}),
    starImage: new Image({url: imagePath + 'gold-star.png'}),
    coinParticleImage: new Image({url: imagePath + 'particle-ewero.png'}),
    craftButtonImage: new Image({url: imagePath + 'button-craft.png'}),
    craftButtonDisabledImage: new Image({url: imagePath + 'button-craft-disabled.png'}),
    clipperRegularImage: new Image({url: imagePath + 'clipper-regular.png'}),
    clipperDiamondImage: new Image({url: imagePath + 'clipper-diamond.png'}),
    clipperGoldImage: new Image({url: imagePath + 'clipper-gold-regular.png'}),
    clipperGoldDiamondImage: new Image({url: imagePath + 'clipper-gold-diamond.png'}),
    clipperNoneImage: new Image({url: imagePath + 'clipper-none.png'}),
    clipperGoldNoneImage: new Image({url: imagePath + 'clipper-gold-none.png'}),
    swatchHighlight: new Image({url: imagePath + 'craft-swatch-highlight.png'}),
    woolImages: {
        white: new Image({url: imagePath + 'wool-white.png'}),
        red: new Image({url: imagePath + 'wool-red.png'}),
        blue: new Image({url: imagePath + 'wool-blue.png'}),
        yellow: new Image({url: imagePath + 'wool-yellow.png'}),
        black: new Image({url: imagePath + 'wool-black.png'}),
        disabledMain: new Image({url: imagePath + 'wool-main.png'}),
        disabledContrast: new Image({url: imagePath + 'wool-contrast.png'})
    },
    tabImages: [
        new Image({url: imagePath + 'tab-1.png'}),
        new Image({url: imagePath + 'tab-2.png'}),
        new Image({url: imagePath + 'tab-3.png'}),
        new Image({url: imagePath + 'tab-4.png'}),
        new Image({url: imagePath + 'tab-5.png'})
    ],
    pigImage: new Image({url: imagePath + 'pig.png'}),

    UPGRADE_PRICES: {
        power: [1000, 2000, 4000,  8000,  16000],
        mult:  [3000, 6000, 12000, 24000, 48000],
        blade: [2000, 4000, 8000, 16000,  32000],
        diamond: 64000,

        // wool prices
        white:  1000,
        red:    1500,
        blue:   1500,
        yellow: 1500,
        black:  2000
    },

    UPGRADE_MAX: {
        power: 6,
        mult:  6,
        blade: 6
    },


    // amount of wool you get from purchasing.. might want to change
    WOOL_QUANTITIES: {
        white:  500,
        red:    500,
        blue:   500,
        yellow: 500,
        black:  500
    },

    // cost, in real dollars, of coins
    EWEROS_PRICES: [
        1, 2, 3, 4, 5
    ],

    // amount of coins you get from purchasing
    EWEROS_QUANTITIES: [
        20000, 40000, 60000, 80000, 100000 
    ],

    ADS_PRICE: 0.99,

    AWARDS: {
        'eweros.1000': { text:     '1000 Eweros Earned',     reward: 100  },
        'eweros.10000': { text:    '10000 Eweros Earned',    reward: 200  },
        'eweros.100000': { text:   '100000 Eweros Earned',   reward: 400  },
        'eweros.1000000': { text:  '1000000 Eweros Earned',  reward: 800  },
        'eweros.10000000': { text: '10000000 Eweros Earned', reward: 1600 },

        'diamonds.10': { text:     'Collect 10 Diamonds',     reward: 100  },
        'diamonds.100': { text:    'Collect 100 Diamonds',    reward: 200  },
        'diamonds.1000': { text:   'Collect 1000 Diamonds',   reward: 400  },
        'diamonds.10000': { text:  'Collect 10000 Diamonds',  reward: 800  },
        'diamonds.100000': { text: 'Collect 100000 Diamonds', reward: 1600 },

        'batteries.10': { text:     'Collect 10 Batteries',     reward: 100  },
        'batteries.100': { text:    'Collect 100 Batteries',    reward: 200  },
        'batteries.1000': { text:   'Collect 1000 Batteries',   reward: 400  },
        'batteries.10000': { text:  'Collect 10000 Batteries',  reward: 800  },
        'batteries.100000': { text: 'Collect 100000 Batteries', reward: 1600 },

        'ewes.20': { text:     'Shear 20 Ewes',     reward: 100  },
        'ewes.200': { text:    'Shear 200 Ewes',    reward: 200  },
        'ewes.2000': { text:   'Shear 2000 Ewes',   reward: 400  },
        'ewes.20000': { text:  'Shear 20000 Ewes',  reward: 800  },
        'ewes.200000': { text: 'Shear 200000 Ewes', reward: 1600 },

        'ewes.white.10': { text:     'Shear 10 White Ewes',     reward: 100  },
        'ewes.white.100': { text:    'Shear 100 White Ewes',    reward: 200  },
        'ewes.white.1000': { text:   'Shear 1000 White Ewes',   reward: 400  },
        'ewes.white.10000': { text:  'Shear 10000 White Ewes',  reward: 800  },
        'ewes.white.100000': { text: 'Shear 100000 White Ewes', reward: 1600 },

        'ewes.red.10': { text:     'Shear 10 Red Ewes',     reward: 100  },
        'ewes.red.100': { text:    'Shear 100 Red Ewes',    reward: 200  },
        'ewes.red.1000': { text:   'Shear 1000 Red Ewes',   reward: 400  },
        'ewes.red.10000': { text:  'Shear 10000 Red Ewes',  reward: 800  },
        'ewes.red.100000': { text: 'Shear 100000 Red Ewes', reward: 1600 },

        'ewes.blue.10': { text:     'Shear 10 Blue Ewes',     reward: 100  },
        'ewes.blue.100': { text:    'Shear 100 Blue Ewes',    reward: 200  },
        'ewes.blue.1000': { text:   'Shear 1000 Blue Ewes',   reward: 400  },
        'ewes.blue.10000': { text:  'Shear 10000 Blue Ewes',  reward: 800  },
        'ewes.blue.100000': { text: 'Shear 100000 Blue Ewes', reward: 1600 },

        'ewes.yellow.10': { text:     'Shear 10 Yellow Ewes',     reward: 100  },
        'ewes.yellow.100': { text:    'Shear 100 Yellow Ewes',    reward: 200  },
        'ewes.yellow.1000': { text:   'Shear 1000 Yellow Ewes',   reward: 400  },
        'ewes.yellow.10000': { text:  'Shear 10000 Yellow Ewes',  reward: 800  },
        'ewes.yellow.100000': { text: 'Shear 100000 Yellow Ewes', reward: 1600 },

        'ewes.black.10': { text:     'Shear 10 Black Ewes',     reward: 100  },
        'ewes.black.100': { text:    'Shear 100 Black Ewes',    reward: 200  },
        'ewes.black.1000': { text:   'Shear 1000 Black Ewes',   reward: 400  },
        'ewes.black.10000': { text:  'Shear 10000 Black Ewes',  reward: 800  },
        'ewes.black.100000': { text: 'Shear 100000 Black Ewes', reward: 1600 },

        'ewes.gold.5': { text:     'Shear 5 Gold Ewes',     reward: 100  },
        'ewes.gold.50': { text:    'Shear 50 Gold Ewes',    reward: 200  },
        'ewes.gold.500': { text:   'Shear 500 Gold Ewes',   reward: 400  },
        'ewes.gold.5000': { text:  'Shear 5000 Gold Ewes',  reward: 800  },
        'ewes.gold.50000': { text: 'Shear 50000 Gold Ewes', reward: 1600 },

        'rams.10': { text:     'Shear 10 Rams',     reward: 100  },
        'rams.100': { text:    'Shear 100 Rams',    reward: 200  },
        'rams.1000': { text:   'Shear 1000 Rams',   reward: 400  },
        'rams.10000': { text:  'Shear 10000 Rams',  reward: 800  },
        'rams.100000': { text: 'Shear 100000 Rams', reward: 1600 },

        'rams.white.10': { text:     'Shear 10 White Rams',     reward: 100  },
        'rams.white.100': { text:    'Shear 100 White Rams',    reward: 200  },
        'rams.white.1000': { text:   'Shear 1000 White Rams',   reward: 400  },
        'rams.white.10000': { text:  'Shear 10000 White Rams',  reward: 800  },
        'rams.white.100000': { text: 'Shear 100000 White Rams', reward: 1600 },

        'rams.red.10': { text:     'Shear 10 Red Rams',     reward: 100  },
        'rams.red.100': { text:    'Shear 100 Red Rams',    reward: 200  },
        'rams.red.1000': { text:   'Shear 1000 Red Rams',   reward: 400  },
        'rams.red.10000': { text:  'Shear 10000 Red Rams',  reward: 800  },
        'rams.red.100000': { text: 'Shear 100000 Red Rams', reward: 1600 },

        'rams.blue.10': { text:     'Shear 10 Blue Rams',     reward: 100  },
        'rams.blue.100': { text:    'Shear 100 Blue Rams',    reward: 200  },
        'rams.blue.1000': { text:   'Shear 1000 Blue Rams',   reward: 400  },
        'rams.blue.10000': { text:  'Shear 10000 Blue Rams',  reward: 800  },
        'rams.blue.100000': { text: 'Shear 100000 Blue Rams', reward: 1600 },

        'rams.yellow.10': { text:     'Shear 10 Yellow Rams',     reward: 100  },
        'rams.yellow.100': { text:    'Shear 100 Yellow Rams',    reward: 200  },
        'rams.yellow.1000': { text:   'Shear 1000 Yellow Rams',   reward: 400  },
        'rams.yellow.10000': { text:  'Shear 10000 Yellow Rams',  reward: 800  },
        'rams.yellow.100000': { text: 'Shear 100000 Yellow Rams', reward: 1600 },

        'rams.black.10': { text:     'Shear 10 Black Rams',     reward: 100  },
        'rams.black.100': { text:    'Shear 100 Black Rams',    reward: 200  },
        'rams.black.1000': { text:   'Shear 1000 Black Rams',   reward: 400  },
        'rams.black.10000': { text:  'Shear 10000 Black Rams',  reward: 800  },
        'rams.black.100000': { text: 'Shear 100000 Black Rams', reward: 1600 },

        'rams.gold.5': { text:     'Shear 5 Gold Rams',     reward: 100  },
        'rams.gold.50': { text:    'Shear 50 Gold Rams',    reward: 200  },
        'rams.gold.500': { text:   'Shear 500 Gold Rams',   reward: 400  },
        'rams.gold.5000': { text:  'Shear 5000 Gold Rams',  reward: 800  },
        'rams.gold.50000': { text: 'Shear 50000 Gold Rams', reward: 1600 },

        'power.1': { text:   '+1 Clipper Power',  reward: 100  },
        'power.2': { text:   '+2 Clipper Power',  reward: 200  },
        'power.3': { text:   '+3 Clipper Power',  reward: 400  },
        'power.4': { text:   '+4 Clipper Power',  reward: 800  },
        'power.max': { text: 'Max Clipper Power', reward: 1600 },

        'multiplier.2': { text:   'x2 Bolt Multiplier',  reward: 100  },
        'multiplier.3': { text:   'x3 Bolt Multiplier',  reward: 200  },
        'multiplier.4': { text:   'x4 Bolt Multiplier',  reward: 400  },
        'multiplier.5': { text:   'x5 Bolt Multiplier',  reward: 800  },
        'multiplier.max': { text: 'Max Bolt Multiplier', reward: 1600 },

        'bladepower.1': { text:   '+1 Blade Power',  reward: 100  },
        'bladepower.2': { text:   '+2 Blade Power',  reward: 200  },
        'bladepower.3': { text:   '+3 Blade Power',  reward: 400  },
        'bladepower.4': { text:   '+4 Blade Power',  reward: 800  },
        'bladepower.max': { text: 'Max Blade Power', reward: 1600 },

        'wool.100': { text:     'Collect 100 bolts of wool',     reward: 100  },
        'wool.1000': { text:    'Collect 1000 bolts of wool',    reward: 200  },
        'wool.10000': { text:   'Collect 10000 bolts of wool',   reward: 400  },
        'wool.100000': { text:  'Collect 100000 bolts of wool',  reward: 800  },
        'wool.1000000': { text: 'Collect 1000000 bolts of wool', reward: 1600 },

        'wool.white.50': { text:     'Collect 50 bolts of white wool',     reward: 100  },
        'wool.white.500': { text:    'Collect 500 bolts of white wool',    reward: 200  },
        'wool.white.5000': { text:   'Collect 5000 bolts of white wool',   reward: 400  },
        'wool.white.50000': { text:  'Collect 50000 bolts of white wool',  reward: 800  },
        'wool.white.500000': { text: 'Collect 500000 bolts of white wool', reward: 1600 },

        'wool.red.50': { text:     'Collect 50 bolts of red wool',     reward: 100  },
        'wool.red.500': { text:    'Collect 500 bolts of red wool',    reward: 200  },
        'wool.red.5000': { text:   'Collect 5000 bolts of red wool',   reward: 400  },
        'wool.red.50000': { text:  'Collect 50000 bolts of red wool',  reward: 800  },
        'wool.red.500000': { text: 'Collect 500000 bolts of red wool', reward: 1600 },

        'wool.blue.50': { text:     'Collect 50 bolts of blue wool',     reward: 100  },
        'wool.blue.500': { text:    'Collect 500 bolts of blue wool',    reward: 200  },
        'wool.blue.5000': { text:   'Collect 5000 bolts of blue wool',   reward: 400  },
        'wool.blue.50000': { text:  'Collect 50000 bolts of blue wool',  reward: 800  },
        'wool.blue.500000': { text: 'Collect 500000 bolts of blue wool', reward: 1600 },

        'wool.yellow.50': { text:     'Collect 50 bolts of yellow wool',     reward: 100  },
        'wool.yellow.500': { text:    'Collect 500 bolts of yellow wool',    reward: 200  },
        'wool.yellow.5000': { text:   'Collect 5000 bolts of yellow wool',   reward: 400  },
        'wool.yellow.50000': { text:  'Collect 50000 bolts of yellow wool',  reward: 800  },
        'wool.yellow.500000': { text: 'Collect 500000 bolts of yellow wool', reward: 1600 },

        'wool.black.50': { text:     'Collect 50 bolts of black wool',     reward: 100  },
        'wool.black.500': { text:    'Collect 500 bolts of black wool',    reward: 200  },
        'wool.black.5000': { text:   'Collect 5000 bolts of black wool',   reward: 400  },
        'wool.black.50000': { text:  'Collect 50000 bolts of black wool',  reward: 800  },
        'wool.black.500000': { text: 'Collect 500000 bolts of black wool', reward: 1600 },

        'crafts.hats': { text:     'Craft all hats',         reward: 100  },
        'crafts.mittens': { text:  'Craft all mittens',      reward: 200  },
        'crafts.socks': { text:    'Craft all socks',        reward: 300  },
        'crafts.scarfs': { text:   'Craft all scarves',      reward: 400  },
        'crafts.sweaters': { text: 'Craft all sweaters',     reward: 500  },
        'crafts.white': { text:    'Craft all white items',  reward: 100  },
        'crafts.red': { text:      'Craft all red items',    reward: 200  },
        'crafts.blue': { text:     'Craft all blue items',   reward: 300  },
        'crafts.yellow': { text:   'Craft all yellow items', reward: 400  },
        'crafts.black': { text:    'Craft all black items',  reward: 500  },
        'crafts.all': { text:      'Craft all items',        reward: 1000 }
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

// build crafts (and images) for every craft
exports.initCrafts = function () {
    import src.Craft as Craft;
    var i = exports.garments.length, j = exports.colors.length, k = exports.colors.length,
        garment, main, contrast; 
    exports.crafts = {};
    exports.craftImages = {};
    exports.nullCrafts = {};
    exports.nullCraftImages = {};
    exports.swatchImages = {};
    while (i--) {
        garment = exports.garments[i];
        exports.craftImages[garment.label] = {};
        exports.nullCraftImages[garment.label] = new Image({url: imagePath + garment.label + '-disabled.png'});
        exports.crafts[garment.label] = {};
        exports.nullCrafts[garment.label] = new Craft(garment, exports.COLOR_NONE, exports.COLOR_NONE);
        while (j--) {
            main = exports.colors[j];
            exports.crafts[garment.label][main.label] = {};
            exports.craftImages[garment.label][main.label] = {};

            if (i === 0) {
                exports.swatchImages[main.label] = {};
            }
            while (k--) {
                contrast = exports.colors[k];
                if (main !== contrast) {
                    exports.craftImages[garment.label][main.label][contrast.label] = 
                        new Image({url: imagePath + garment.label + '-' + main.label + '-' + contrast.label + '.png'});
                    exports.crafts[garment.label][main.label][contrast.label] = 
                        new Craft(garment, main, contrast);


                    if (i === 0) {
                        exports.swatchImages[main.label][contrast.label] =
                            new Image({url: imagePath + 'swatch-' + main.label + '-' + contrast.label + '.png'});
                    }
                }
            }
            k = exports.colors.length;
        }
        j = exports.colors.length;
    }
};
