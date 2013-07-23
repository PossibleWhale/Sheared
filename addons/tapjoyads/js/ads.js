/*
 * JS interface with the tapjoy+ads plugin;
 *
 * Public API:
 *
 *      ads.showAd()  - display a fullscreen ad (non-blocking)
 */

var TapjoyAds = Class(function () {
    var cb, tv, origView;

    if (NATIVE && NATIVE.events) {
        this.init = function _a_init() {
            NATIVE.events.registerHandler('tapjoyads', bind(this, function (evt) {
                console.log('[JS PLUGIN] Response from Tapjoy API: message="' + evt.message + '" code=' + evt.errorCode);
                cb = this.callback;
                cb(evt);
            }));
        };

        /*
         * Show an ad to the device.
         *
         * This uses Tapjoy's code to handle the canvas, so we can't do
         * anything else until the user clears the ad or it goes away.
         */
        this.showAd = function _a_showAd(callback) {
            this.callback = callback;
            NATIVE.plugins.sendEvent('TapjoyAdsPlugin', 'requestAd', '');
        };
    } else {
        this.init = function () {};

        /*
         * Pretend to show an ad to the browser
         */
        this.showAd = function () {

            origView = GC.app.engine.getView();
            try {

                import ui.TextView;
                tv = new ui.TextView({
                    text: 'Ad is displaying. Tap to make it go away.',
                    color: 'white',
                    superview: GC.app.view
                });

                GC.app.engine.setView(tv);

                tv.on('InputSelect', function _a_onClickAd() {
                    GC.app.engine.setView(origView);
                    GC.app.view.removeSubview(tv);
                });
            } catch (e) {
                GC.app.engine.setView(origView);
                console.log(e);
                console.log(e.stack);
            }

        };
    }

});

exports = new TapjoyAds();
