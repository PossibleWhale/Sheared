import src.constants as c;
import src.Storage as Storage;
import src.util as util;

var upgrades = [
    {name: 'power', value: 1},
    {name: 'mult', value: 1},
    {name: 'blade', value: 1},
    {name: 'diamond', value: false},
    {name: 'adFree', value: false}
];

exports = Class(Storage, function (supr) {
    this.name = 'upgrade';
    this.key = 'name';

    this.init = function _a_init(opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        // check for 'naked'.. if it isn't present we need to preload
        if (this.get('power') === null) {
            this.add(upgrades);
        }

        util.reissue(this, 'Update', this, 'upgrade:update');
    };

    this.addToUpgrade = function (name, value) {
        console.log('name=' + name + ', value=' + value);
        this.add({name: name, value: value});
    };
});


