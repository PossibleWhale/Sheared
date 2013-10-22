import device;

import event.Emitter;

import plugins.appflood.appFlood as appFlood;

import src.constants as c;
import src.debughack as dh;
import src.UpgradeStorage as UpgradeStorage;


// ios hacks - appFlood doesn't even work yet, stub it out.
if (device.isIOS) {
    appFlood.on = function () {};
}


AdTimer = Class(event.Emitter, function (supr) {
    this._nativeInit = function () {
        supr(this, 'init', arguments);

        this.suppressTime = c.AD_SUPPRESS_TIME;
        this.isSuppressed = false;

        appFlood.on('appflood:closed', bind(this, function _a_appFloodClosed(callback, cbArgs) {
            callback.apply(cbArgs);
            GC.app.stopSpinner();
            this.start();
        }));
    };

    this._simulatorInit = function () {
        supr(this, 'init', arguments);
        this.isSuppressed = true;
    };

    if (device.isSimulator) {
        this.init = this._simulatorInit;
    } else {
        this.init = this._nativeInit;
    }

    /*
     * User has purchased an ad-free upgrade, so no-op
     */
    this._interruptNoAds = function (callback) {
        var cbArgs = Array.prototype.slice.apply(arguments);
        cbArgs.shift();
        callback.apply(cbArgs);
    };

    /*
     *  Interrupt whatever is happening with an ad, then callback()
     *
     *  If you pass additional arguments to interrupt() they will be passed to
     *  the callback.
     *
     *  This function does not block normally, so you may wish to make
     *  this call the last thing your UI code does in the scope where it's
     *  defined.
     */
    this._interruptNormal = function (callback) {
        var cbArgs = Array.prototype.slice.apply(arguments);

        dh.pre_ads(this);

        cbArgs.shift();

        if (!device.isIOS && !this.isSuppressed) { // doesn't work on ios yet
            this.isSuppressed = true;
            GC.app.startSpinner();
            appFlood.showInterstitial(callback, cbArgs);
        } else {
            callback.apply(cbArgs);
        }
    };

    /*
     * run the timer; ads will be suppressed while it's running
     */
    this.start = function () {
        setTimeout(bind(this, function () {
            this.isSuppressed = false;
        }), this.suppressTime);
    };

    this.interrupt = function (callback) {
        if (GC.app.player.upgrades.get('adFree').value) {
            this._interruptNoAds(callback);
        } else {
            this._interruptNormal(callback);
        }
    };

});


exports = new AdTimer();
