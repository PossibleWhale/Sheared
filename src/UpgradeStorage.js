import src.constants as c;
import src.Storage as Storage;
import src.util as util;

var upgrades = [
    {name: 'temp_power', value: 1},
    {name: 'temp_mult', value: 1},
    {name: 'temp_diamond', value: false},
    {name: 'perm_power', value: 1},
    {name: 'perm_mult', value: 1},
    {name: 'perm_diamond', value: false},
    {name: 'adFree', value: false}
];

exports = Class(Storage, function (supr) {
    this.name = 'upgrade';
    this.key = 'name';

    this.init = function _a_init(opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        // check for 'naked'.. if it isn't present we need to preload
        if (this.get('temp_power') === null) {
            this.add(upgrades);
        }

        util.reissue(this, 'Update', this, 'upgrade:update');
    };

    this.addToUpgrade = function (name, value) {
        this.add({name: name, value: value});
    };

    this.resetTemporary = function () {
        this.addToUpgrade('temp_power', this.get('perm_power').value);
        this.addToUpgrade('temp_mult', this.get('perm_mult').value);
        this.addToUpgrade('temp_diamond', this.get('perm_diamond').value);
    };
});


