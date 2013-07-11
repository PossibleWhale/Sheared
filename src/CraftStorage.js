import src.constants as c;
import src.Storage as Storage;
import src.util as util;


var crafts = [
    {motif: 'naked|none|none', count: 0}
];


exports = Class(Storage, function (supr) {
    this.name = 'craft';
    this.key = 'motif';

    this.addCraft = bind(this, function _a_addCraft(craft, amt) {
        var old = this.get(craft).count;
        this.add({motif: this.toKey(craft), count: oldCount + (amt || 1)});
    });

    this.get = function (craft) {
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
        merge(opts, {preload: crafts});
        supr(this, 'init', [opts]);

        util.reissue(this, 'Update', this, 'craft:update');
    };
});

