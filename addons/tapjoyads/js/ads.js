/*
 * JS interface with the tapjoy+ads plugin;
 *
 * Public API:
 *
 *      ads.showAd()  - display a fullscreen ad (non-blocking)
 */

var TapjoyAds = Class(function () {
    this._initNATIVE = function _a_init() {
        NATIVE.events.registerHandler('tapjoyads', bind(this, function (evt) {
            console.log('[JS PLUGIN] Response from Tapjoy API: message="' + evt.message + '" code=' + evt.errorCode);
            this.callback(evt);
            return;
        }));
    };

    /*
     * Show an ad to the device.
     *
     * This uses Tapjoy's code to handle the canvas, so we can't do
     * anything else until the user clears the ad or it goes away.
     */
    this._showAdNATIVE = function _a_showAd(callback) {
        this.callback = callback;
        NATIVE.plugins.sendEvent('TapjoyAdsPlugin', 'requestAd', '');
    };



    this._initSimulated = function () {};

    /*
     * Pretend to show an ad to the browser
     */
    this._showAdSimulated = function (callback) {
        var tv, origView;

        origView = GC.app.engine.getView();
        try {

            import ui.TextView;
            tv = new ui.TextView({
                text: 'Ad is displaying. Tap to make it go away.',
                color: 'white',
                superview: GC.app.view
            });

            GC.app.engine.setView(tv);

            tv.on('InputSelect', function _a_onClickAd(evt) {
                GC.app.engine.setView(origView);
                GC.app.view.removeSubview(tv);
                callback(evt);
                return;
            });
        } catch (e) {
            GC.app.engine.setView(origView);
            console.log(e);
            console.log(e.stack);
        }

    };

    if (NATIVE && NATIVE.events) {
        this.init = this._initNATIVE;
        this.showAd = this._showAdNATIVE;
    } else {
        this.init = this._initSimulated;
        this.showAd = this._showAdSimulated;
    }


});

exports = new TapjoyAds();
