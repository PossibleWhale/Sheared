/*
 * The main application file, your game code begins here.
 */

import device;
import ui.StackView as StackView;

import src.TitleScreen as TitleScreen;
import src.Player as Player;
import src.Audio as Audio;


// DO NOT QUESTION THIS MATH
var boundsWidth = 1024,
    boundsHeight = 576,
    scale = device.width / boundsWidth,
    baseWidth = device.width,
    baseHeight = boundsHeight * scale,
    gap = (device.height - baseHeight) / (2 * scale);

/* Your application inherits from GC.Application, which is
 * exported and instantiated when the game is run.
 */
exports = Class(GC.Application, function () {

    this.localConfig = {};
    var _localConfig = CACHE['resources/conf/localconfig.json'];
    if (_localConfig) {
        merge(this.localConfig, JSON.parse(_localConfig));
    }

    /* Run after the engine is created and the scene graph is in
     * place, but before the resources have been loaded.
     */
    this.initUI = function () {
        var rootView, muted;

        this.view.style.backgroundColor = '#000';
        this.view.style.scale = scale;

        //Add a new StackView to the root of the scene graph
        rootView = this.rootView = new StackView({
            superview: this.view,
            x: 0,
            y: gap,
            height: boundsHeight,
            width: boundsWidth,
            clip: true,
            backgroundColor: '#37B34A'
        });

        this.titleScreen = new TitleScreen({superview: rootView});

        // audio manager and audio toggles
        this.audio = new Audio();
        this.on('audio:toggleMute', bind(this, function (btn) {
            muted = this.audio.getMuted();
            if (muted) {
                this.audio.setMuted(false);
                btn.setText("<(=");
            } else {
                this.audio.setMuted(true);
                btn.setText("<() ");
            }
        }));

        rootView.push(this.titleScreen);

        GC.hidePreloader();
    };

    /* Executed after the asset resources have been loaded.
     * If there is a splash screen, it's removed.
     */
    this.launchUI = function () {
        this.player = new Player();
    };
});
