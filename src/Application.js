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

        this.titleScreen = new TitleScreen({superview: stackView});

        stackView.push(this.titleScreen);

        GC.hidePreloader();
    };

    /* Executed after the asset resources have been loaded.
     * If there is a splash screen, it's removed.
     */
    this.launchUI = function () {
        dh.pre_launchUI();

        var gcSplash = new ImageView({
            superview: this.stackView,
            image: 'resources/images/landscape1536.png'
        });
        this.stackView.push(gcSplash, /* noAnimate= */ true);
        setTimeout(bind(this, function () {
            this.stackView.pop(/* noAnimate= */ true);
        }), c.SPLASH_TIME);
        this.player = new Player();
        this.particleEngine = new ParticleEngine({
            superview: this,
            width: 1024,
            height: 576
        });
    };
});
