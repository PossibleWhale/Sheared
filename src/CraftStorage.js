import src.constants as c;
import src.Storage as Storage;
import src.util as util;


var crafts = [
    {motif: 'naked|none|none', count: 0}
];


exports = Class(Storage, function (supr) {
    this.name = 'craft';
    this.key = 'motif';

    this.addCraft = function _a_addCraft(craft, amt) {
        var old = this.get(craft).count;
        this.add({motif: this.toKey(craft), count: old + (amt || 1)});
    };

    // get by either motif string, or instance of Craft
    this.get = function _a_get(craft) {
        var lookup, motif = this.toKey(craft);
        lookup = supr(this, 'get', [motif]);
        if (!lookup) {
            return {motif: motif, count: 0};
        } else {
            return lookup;
        }
    };

    this.toKey = function _a_toKey(craft) {
        if (typeof craft === 'string') {
            return craft;
        } else {
            return craft.toMotif();
        }
    };

    this.init = function _a_init(opts) {
        supr(this, 'init', [opts]);

        // check for 'naked'.. if it isn't present we need to preload
        if (this.get('naked|none|none') === null) {
            this.add(crafts);
        }

        util.reissue(this, 'Update', this, 'craft:update');
    };
});

