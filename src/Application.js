/*
 * The main application file, your game code begins here.
 */

import device;
import ui.resource.loader as loader;
import ui.StackView as StackView;

import src.TitleScreen as TitleScreen;
import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.ModeScreen as ModeScreen;
import src.Button as Button;
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
        this.view.style.backgroundColor = '#000';
        this.view.style.scale = scale;

        //Add a new StackView to the root of the scene graph
        var rootView = new StackView({
            superview: this.view,
            x: 0,
            y: gap,
            height: boundsHeight,
            width: boundsWidth,
            clip: true,
            backgroundColor: '#37B34A'
        });
        this.rootView = rootView;

        var titleScreen = new TitleScreen(),
            craftScreen = new CraftScreen(),
            playScreen = new PlayScreen(),
            modeScreen = new ModeScreen();


        rootView.push(titleScreen);

        var pbOpts = {
            superview: titleScreen,
            x: 235,
            y: 271,
            width: 105,
            height: 70
        };
        var playButton = new Button(pbOpts);

        var cbOpts = {
            superview: titleScreen,
            x: 680,
            y: 271,
            width: 130,
            height: 70
        }
        var craftButton = new Button(cbOpts);

        rootView.on('titleScreen:craft', function () {
            rootView.push(craftScreen);
            craftScreen.emit('craft:start');
        });

        modeScreen.on('play:normal', function () {
            playScreen.infiniteMode = false;
            rootView.push(playScreen);
        });

        modeScreen.on('play:infinite', function () {
            playScreen.infiniteMode = true;
            rootView.push(playScreen);
        });

        modeScreen.on('play:back', function () {
            rootView.pop();
        });

        playButton.on('InputSelect', function () {
            if (localStorage['completedWeek'] === 'true') {
                rootView.push(modeScreen);
            } else {
                modeScreen.emit('play:normal');
            }
        });

        craftButton.on('InputSelect', function () {
            rootView.emit('titleScreen:craft');
        });

        /* When the game screen has signalled that the game is over,
         * reset the play screen so we can play again
         */
        rootView.on('playscreen:end', function () {
            playScreen = new PlayScreen();
        });

        this.engine.on('Tick', bind(this, function (dt) {
            if (playScreen && playScreen.clipper) {
                playScreen.clipper.emitDiamonds();
            }
            playScreen.particleEngine.runTick(dt);
        }));

        GC.hidePreloader();

        this.audio = new Audio();
    };

    /* Executed after the asset resources have been loaded.
     * If there is a splash screen, it's removed.
     */
    this.launchUI = function () {
        this.player = new Player();
    };
});
