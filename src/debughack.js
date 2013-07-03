/*
 * various patches and patching utilites to make debugging simpler
 */
import event.Emitter as Emitter;
import ui.View as View;


var Hax = function () {
    /*
     * make button outlines visible
     */
    this.post_initButton = function (button, opts) {
        var v, vopts, subs;
        // pop all subviews so we can add them back on top
        subs = button.getSubviews();
        button.removeAllSubviews();

        vopts = {
            backgroundColor: '#c6c',
            opacity: 0.2,
            superview: button,
            width: button.style.width,
            height: button.style.height
        };
        v = new View(vopts);
        for (var i = 0; i < subs.length; i++) {
            button.addSubview(subs[i]);
        }
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

    /*
     * Make the timer shorter
     */
    this.post_initTimer = function (timer) {
        timer.time = 10;
        timer.updateOpts({text: timer.time});
    };

    var _args, debugWrap = function (fn) {
        return bind(this, function () {
            _args = arguments;
            if (GC.app.localConfig.debug) {
                return fn.apply(this, _args);
            }
        });
    };

    this.post_initButton = debugWrap(this.post_initButton);
    this.pre_startCrafting = debugWrap(this.pre_startCrafting);
};

exports = new Hax();
