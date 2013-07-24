import src.Storage as Storage;
import src.util as util;

stats = [
{name: 'ewesSheared.white', value: 0},
{name: 'ewesSheared.blue', value: 0},
{name: 'ewesSheared.yellow', value: 0},
{name: 'ewesSheared.red', value: 0},
{name: 'ewesSheared.black', value: 0},
{name: 'ramsSheared.white', value: 0},
{name: 'ramsSheared.blue', value: 0},
{name: 'ramsSheared.yellow', value: 0},
{name: 'ramsSheared.red', value: 0},
{name: 'ramsSheared.black', value: 0},
{name: 'diamonds', value: 0},
{name: 'batteries', value: 0},
{name: 'diamondBladesHit', value: 0},
{name: 'diamondBladesFired', value: 0},
{name: 'regularBladesHit', value: 0},
{name: 'regularBladesFired', value: 0},
{name: 'coinsEarned', value: 0},
{name: 'coins', value: 0}
];

exports = Class(Storage, function (supr) {
    this.name = 'stat';
    this.key = 'name';

    this.increment = function _a_increment(what, amount) {
        if (amount === undefined) {
            amount = 1;
        }

        var old = this.get(what).value;
        this.add({name: what, value: old + amount});
    };

    this.init = function (opts) {
        opts = opts || {};
        supr(this, 'init', [opts]);

        if (this.get('coins') === null) {
            this.add(stats);
        }

        util.reissue(this, 'Update', this, 'stat:update');
    };
});
