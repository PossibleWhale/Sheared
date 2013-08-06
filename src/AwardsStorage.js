import src.constants as c;
import src.Storage as Storage;
import src.util as util;

var awards = [], i = 0;
for (i; i < constants.AWARDS.length; i++) {
    awards.push({name: constants.AWARDS[i].key, value: false});
}

exports = Class(Storage, function (supr) {
    this.name = 'award';
    this.key = 'name';

    this.init = function _a_init(opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        if (this.get('eweros.10') === null) {
            this.add(awards);
        }

        util.reissue(this, 'Update', this, 'award:update');
    };
});
