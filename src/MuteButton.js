// common mute button on all screens

import src.Button as Button;
import src.constants as constants;


exports = Class(Button, function proto(supr) {
    this.init = function (opts) {
        var defaultOpts = { click: false };
        merge(opts, defaultOpts);
        supr(this, 'init', [opts]);

        this.audio = GC.app.audio;

        this.setMuted(this.audio.getMuted(), {silent: true});

        this.on('InputSelect', bind(this, function () {
            this.setMuted(!this.audio.getMuted());
        }));
    };

    this.setMuted = function (muted, options) {
        if (typeof arguments[0] === 'object') {
            options = arguments[0];
            muted = undefined;
        }
        options = merge(options || {}, {silent: false});
        if (muted === undefined) { /* with no arguments, just use this to set
                                    * the state of the button to match the
                                    * state of the audio
                                    */
            muted = this.audio.getMuted();
        }

        this.audio.setMuted(muted);

        if (muted) {
            this.setImage(constants.soundOffImage);
        } else {
            this.setImage(constants.soundOnImage);
            // manually play the click sound when sound is turned on.
            if (! options.silent) {
                this.audio.playButton();
            }
        }
        this._initializing = false;
    };
});
