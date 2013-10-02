
import event.Emitter;

import plugins.appflood.appFlood as appFlood;

import src.constants as c;
import src.debughack as dh;
import src.UpgradeStorage as UpgradeStorage;


AdTimer = Class(event.Emitter, function (supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.suppressTime = c.AD_SUPPRESS_TIME;
        this.isSuppressed = false;

        appFlood.on('appflood:closed', bind(this, function _a_appFloodClosed(callback, cbArgs) {
            callback.apply(cbArgs);
            GC.app.stopSpinner();
            this.start();
        }));
    };

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

        if (!this.isSuppressed) {
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

    var storage = new UpgradeStorage();
    if (!storage.get('adFree').value) {
        this.interrupt = this._interruptNormal;
    } else {
        this.interrupt = this._interruptNoAds;
    }

});


exports = new AdTimer();
