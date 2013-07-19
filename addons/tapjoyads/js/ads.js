
var TapjoyAds = Class(function () {
    this.init = function _a_init() {
        NATIVE.events.registerHandler('tapjoyads', bind(this, function (evt) {
            console.log('[JS PLUGIN] Response from Tapjoy API: message="' + evt.message + '" code=' + evt.errorCode);
            var cb = this.callback;
            cb(evt);
        }));
    };

    this.showAd = function _a_showAd(callback) {
        this.callback = callback;
        NATIVE.plugins.sendEvent('TapjoyAdsPlugin', 'requestAd', '');
    };
});

exports = new TapjoyAds();
