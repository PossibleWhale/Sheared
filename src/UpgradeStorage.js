import src.constants as c;
import src.Storage as Storage;
import src.util as util;

var upgrades = [
    {name: 'temp.power', value: 0},
    {name: 'temp.mult', value: 1},
    {name: 'temp.diamond', value: false},
    {name: 'perm.power', value: 0},
    {name: 'perm.mult', value: 1},
    {name: 'perm.diamond', value: false}
];

exports = Class(Storage, function (supr) {
    this.name = 'upgrade';
    this.key = 'name';

    this.init = function _a_init(opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        // check for 'naked'.. if it isn't present we need to preload
        if (this.get('temp.power') === null) {
            this.add(upgrades);
        }

        util.reissue(this, 'Update', this, 'upgrade:update');
    };
});


