/*
 * various patches and patching utilites to make debugging simpler
 */
import event.Emitter as Emitter;


var Hax = function () {
    /*
     * make button outlines visible
     */
    this.pre_initButton = function (opts) {
        merge(opts, {
            backgroundColor: '#c6c',
            opacity: 0.4
        });
    };

    /*
     * add some wool to test crafting
     */
    this.pre_startCrafting = function () {
        if (!GC.app.woolhack) {
            GC.app.woolhack = true;
            GC.app.player.inventory.wool.add({color: 'white', count: 100});
            GC.app.player.inventory.wool.add({color: 'red', count: 100});
            GC.app.player.inventory.wool.add({color: 'yellow', count: 100});
            GC.app.player.inventory.wool.add({color: 'blue', count: 100});
            GC.app.player.inventory.wool.add({color: 'black', count: 100});
        }
    };

    var _args, debugWrap = function (fn) {
        return bind(this, function () {
            _args = arguments;
            if (GC.app.localConfig.debug) {
                return fn.apply(this, _args);
            }
        });
    };

    this.pre_initButton = debugWrap(this.pre_initButton);
    this.pre_startCrafting = debugWrap(this.pre_startCrafting);
};

exports = new Hax();
