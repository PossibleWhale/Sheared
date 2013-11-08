// common mute button on all screens

import src.Button as Button;
import src.constants as constants;


exports = Class(Button, function proto(supr) {
    this.init = function (opts) {
        var defaultOpts = { click: false };
        merge(opts, defaultOpts);
        supr(this, 'init', [opts]);

        this._initializing = true;
        this.audio = GC.app.audio;
        this.setMuted(this.audio.getMusicMuted(), this.audio.getEffectsMuted(), {silent: true});

        this.on('InputSelect', bind(this, function () {
            //this.setMuted(!this.audio.getMuted());
            if (this.audio.getMusicMuted() && this.audio.getEffectsMuted()) {
                this.setMuted(false, false);
            } else if (this.audio.getMusicMuted()) {
                this.setMuted(true, true);
            } else {
                this.setMuted(true, false);
            }
        }));
    };

    this.setMuted = function (mutedMusic, mutedEffects, options) {
        if (typeof arguments[0] === 'object') {
            options = arguments[0];
            mutedMusic = undefined;
            mutedEffects = undefined;
        }
        options = merge(options || {}, {silent: false});
        if (mutedMusic === undefined) { /* with no arguments, just use this to set
                                        * the state of the button to match the
                                        * state of the audio
                                        */
            mutedMusic = this.audio.getMusicMuted();
        }
        if (mutedEffects === undefined) {
            mutedEffects = this.audio.getEffectsMuted();
        }

        if (!this._initializing) {
            this.audio.setMusicMuted(mutedMusic);
            this.audio.setEffectsMuted(mutedEffects);
        }

        if (mutedMusic && mutedEffects) {
            this.setImage(constants.soundOffImage);
        } else if (mutedMusic) {
            this.setImage(constants.soundPartialImage);
            // manually play the click sound when sound is turned on.
            if (! options.silent) {
                this.audio.playButton();
            }
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
