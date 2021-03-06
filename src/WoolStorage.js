import src.constants as c;
import src.Storage as Storage;
import src.util as util;


var wools = [
    {color: c.COLOR_NONE.label, count: 0},
    {color: c.COLOR_WHITE.label, count: 0},
    {color: c.COLOR_RED.label, count: 0},
    {color: c.COLOR_BLUE.label, count: 0},
    {color: c.COLOR_YELLOW.label, count: 0},
    {color: c.COLOR_BLACK.label, count: 0}
];

exports = Class(Storage, function (supr) {
    this.name = 'wool';
    this.key = 'color';

    this.addWool = function (color, amt) {
        var old = this.get(color).count;
        this.add({color: color, count: old + (amt || 1)});
    };

    this.get = function (color) {
        return supr(this, 'get', [this.toKey(color)]);
    };

    /*
     * supports three forms:
     * #1  wool.add(color, count)
     * #2  wool.add({color: color, count: count})
     * #3  wool.add([array of #2...])
     *
     * In all cases color will be converted to color label if necessary
     */
    this.add = function () {
        var item, obj, arr, icolor;
        if (typeof arguments[0] === 'object' && arguments[0].length !== undefined) {
            return this.addArray(arguments[0]);
        }

        if (arguments.length === 2) {
            obj = {color: arguments[0], count: arguments[1]};
        } else {
            obj = {color: arguments[0].color, count: arguments[0].count};
        }
        obj.color = this.toKey(obj.color);
        return supr(this, 'add', [obj]);
    };

    this.toKey = function (color) {
        if (typeof color === 'string') {
            return color;
        } else {
            return color.label;
        }
    };

    this.init = function (opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        // check for 'none' as an item.. if it isn't present we need to
        // preload
        if (this.get(c.COLOR_NONE) === null) {
            this.add(wools);
        }

        util.reissue(this, 'Update', this, 'wool:update');
    };

});

