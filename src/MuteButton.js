// common mute button on all screens

import src.Button as Button;


exports = Class(Button, function proto(supr) {
    this.init = function (opts) {
        var defaultOpts = { click: false };
        merge(opts, defaultOpts);
        supr(this, 'init', [opts]);

        this.audio = GC.app.audio;

        this.muted = this.audio.getMuted();

        this._initializing = true; // turned off once setMuted is called once
        this.setMuted(this.muted);

        this.on('InputSelect', bind(this, function () {
            this.setMuted(!this.muted);
        }));
    };

    this.setMuted = function (muted) {
        if (muted === undefined) { /* with no arguments, just use this to set
                                    * the state of the button to match the
                                    * state of the audio
                                    */
            muted = this.audio.getMuted();
        }

        this.audio.setMuted(muted);
        this.muted = muted;

        if (muted) {
            this.setImage('resources/images/audio-off.png');
        } else {
            this.setImage('resources/images/audio-on.png');
            // manually play the click sound when sound is turned on.
            if (! this._initializing) {
                this.audio.playButton();
            }
        }
        this._initializing = false;
    };
});
