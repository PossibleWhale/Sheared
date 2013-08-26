/*
 * The main application file, your game code begins here.
 */

import device;
import ui.StackView as StackView;
import ui.ImageView as ImageView;
import ui.ParticleEngine as ParticleEngine;

import src.TitleScreen as TitleScreen;
import src.Player as Player;
import src.Audio as Audio;
import src.constants as c;
import src.debughack as dh;
import src.Storage as Storage;


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
exports = Class(GC.Application, function (supr) {

    this.init = function () {
        var _localConfig, lc;
        lc = this.localConfig = {};
        _localConfig = CACHE['resources/conf/localconfig.json'];
        if (_localConfig) {
            merge(lc, JSON.parse(_localConfig));
        }

        Storage.reset(lc.reset, lc.debug);

        supr(this, 'init', arguments);
    };

    /* Run after the engine is created and the scene graph is in
     * place, but before the resources have been loaded.
     */
    this.initUI = function () {
        var stackView, muted;

        this.view.style.backgroundColor = '#000';
        this.view.style.scale = scale;

        // audio manager - must be created early so mute buttons work
        this.audio = new Audio();

        //Add a new StackView to the root of the scene graph
        stackView = this.stackView = new StackView({
            superview: this.view,
            x: 0,
            y: gap,
            height: boundsHeight,
            width: boundsWidth,
            clip: true,
            backgroundColor: '#37B34A'
        });

        this.player = new Player();
        this.titleScreen = new TitleScreen({superview: stackView});

        stackView.push(this.titleScreen);

        if (NATIVE) {
            device.setBackButtonHandler(bind(this, function () {
                if (!this.stackView.getCurrentView().noBackButton) {
                    this.titleScreen.back();
                }
            }));
        }

        GC.hidePreloader();
    };

    /* Executed after the asset resources have been loaded.
     * If there is a splash screen, it's removed.
     */
    this.launchUI = function () {
        dh.pre_launchUI();

        this.particleEngine = new ParticleEngine({
            superview: this.view,
            x: 0,
            y: gap,
            width: boundsWidth,
            height: boundsHeight
        });

        this.titleScreen.animateIntro();
    };
});
