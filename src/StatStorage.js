import src.Storage as Storage;
import src.util as util;
import src.constants as c;

stats = [
{name: 'ewesSheared', value: 0},
{name: 'ewesSheared.white', value: 0},
{name: 'ewesSheared.blue', value: 0},
{name: 'ewesSheared.yellow', value: 0},
{name: 'ewesSheared.red', value: 0},
{name: 'ewesSheared.black', value: 0},
{name: 'ewesSheared.gold', value: 0},
{name: 'ramsSheared', value: 0},
{name: 'ramsSheared.white', value: 0},
{name: 'ramsSheared.blue', value: 0},
{name: 'ramsSheared.yellow', value: 0},
{name: 'ramsSheared.red', value: 0},
{name: 'ramsSheared.black', value: 0},
{name: 'ramsSheared.gold', value: 0},
{name: 'wool', value: 0},
{name: 'wool.white', value: 0},
{name: 'wool.blue', value: 0},
{name: 'wool.yellow', value: 0},
{name: 'wool.red', value: 0},
{name: 'wool.black', value: 0},
{name: 'diamonds', value: 0},
{name: 'batteries', value: 0},
{name: 'diamondBladesHit', value: 0},
{name: 'diamondBladesFired', value: 0},
{name: 'regularBladesHit', value: 0},
{name: 'regularBladesFired', value: 0},
{name: 'coinsEarned', value: 0},
{name: 'coins', value: 0},
{name: 'seen.playTutorial', value: false},
{name: 'seen.craftTutorial', value: false}
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

        if (this.get('ewesSheared.gold') === null) {
            this.add(stats);
        }

        util.reissue(this, 'Update', this, 'stat:update');
    };

    this.setSeen = function (name, value) {
        this.add({name: 'seen.' + name, value: value});
    };
});
