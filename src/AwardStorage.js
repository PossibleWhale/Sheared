import src.constants as c;
import src.Storage as Storage;
import src.util as util;

var awards = [], key;
for (key in c.AWARDS) {
    if (c.AWARDS.hasOwnProperty(key)) {
        awards.push({name: key, value: false});
    }
}

exports = Class(Storage, function (supr) {
    this.name = 'award';
    this.key = 'name';

    this.init = function _a_init(opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        if (this.get('ewes.gold.1') === null) {
            this.add(awards);
        }

        util.reissue(this, 'Update', this, 'award:update');
    };
});
