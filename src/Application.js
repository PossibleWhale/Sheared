/*
 * The main application file, your game code begins here.
 */

import device;
import ui.View;
import ui.StackView as StackView;

import src.TitleScreen as TitleScreen;
import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.Button as Button;

GC.debug = false;


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

        var titleScreen = new TitleScreen(),
            craftScreen = new CraftScreen(),
            playScreen = new PlayScreen();


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

        rootView.on('titleScreen:play', function () {
            rootView.push(playScreen);
            playScreen.emit('play:start');
        });

        rootView.on('titleScreen:craft', function () {
            rootView.push(craftScreen);
            craftScreen.emit('craft:start');
        });

        playButton.on('InputSelect', function () {
            rootView.emit('titleScreen:play');
        });

        craftButton.on('InputSelect', function () {
            rootView.emit('titleScreen:craft');
        });

        function _back() {
            // FIXME - if the game is in play when back is hit, don't do
            // this.
            if (rootView.getCurrentView() === titleScreen) {
                return;
            }
            rootView.pop();
        }
        
        device.setBackButtonHandler(_back);

        /* When the game screen has signalled that the game is over,
         * show the title screen so that the user may play the game again.
         */
        rootView.on('gamescreen:end', function () {
            _back();
        });
    };

    /* Executed after the asset resources have been loaded.
     * If there is a splash screen, it's removed.
     */
    this.launchUI = function () {};
});
