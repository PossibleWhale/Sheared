
import event.Emitter;

import src.constants as c;
import plugins.tapjoyads.ads as ads;


AdTimer = Class(event.Emitter, function (supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.suppressTime = c.AD_SUPPRESS_TIME;
        this.isSuppressed = false;
    };

    /*
     * User has purchased an ad-free upgrade, so no-op
     */
    this._interruptNoAds = function (callback) {
        var cbArgs = arguments.slice();
        cbArgs.shift();
        callback.apply(cbArgs);
    }

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
        cbArgs.shift();

        if (!this.isSuppressed) {
            ads.showAd(bind(this, function _a_onShowAd(evt) {
                if (evt.errorCode) {
                    console.log("[APP] Response from Plugin: message='" + evt.message + "' code=" + evt.errorCode);
                } else {
                    console.log("[APP] Response from Plugin: message=" + evt.message);
                }
                this.start();
                callback.apply(cbArgs);
            }));
        } else {
            callback.apply(cbArgs);
        }
    }

    /*
     * run the timer; ads will be suppressed while it's running
     */
    this.start = function () {
        this.isSuppressed = true;
        setTimeout(bind(this, function () {
            this.isSuppressed = false;
        }), this.suppressTime);
    };


    if ("TODO CHECK DATABASE TO SEE IF WE CAN TURN OFF ADS") {
        this.interrupt = this._interruptNormal;
    } else {
        this.interrupt = this._interruptNoAds;
    }

});


exports = new AdTimer();
