/*
 * The main application file, your game code begins here.
 */

//sdk imports
import device;
import ui.View;
import ui.StackView as StackView;
//user imports
import src.TitleScreen as TitleScreen;
import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.Button as Button;

GC.debug = false;

var boundsWidth = 1024,
    boundsHeight = 576,
    scale = device.screen.height / boundsHeight,
    baseWidth = device.screen.width / scale,
    baseHeight = device.screen.height / scale;

/* Your application inherits from GC.Application, which is
 * exported and instantiated when the game is run.
 */
exports = Class(GC.Application, function () {

    /* Run after the engine is created and the scene graph is in
     * place, but before the resources have been loaded.
     */
    this.initUI = function () {
        var titleScreen = new TitleScreen({
                width: boundsWidth,
                height: boundsHeight
            }),
            craftScreen = new CraftScreen(),
            playScreen = new PlayScreen();

        this.view.style.backgroundColor = '#30B040';
        this.view.style.scale = scale;

        //Add a new StackView to the root of the scene graph
        var rootView = new StackView({
            superview: this.view,
            x: 0,
            y: 0,
            height: baseHeight,
            width: baseWidth,
            clip: true,
            backgroundColor: '#37B34A'
        });

        rootView.push(titleScreen);

        var playButton = new Button({
            superview: titleScreen,
            x: 190,
            y: 300,
            width: 100,
            height: 70
        });

        var craftButton = new Button({
            superview: titleScreen,
            x: 570,
            y: 295,
            width: 125,
            height: 70
        });

        titleScreen.on('titleScreen:play', function () {
            rootView.push(playScreen);
            playScreen.emit('play:start');
        });

        titleScreen.on('titleScreen:craft', function () {
            rootView.push(craftScreen);
            craftScreen.emit('craft:start');
        });

        playButton.on('InputSelect', function () {
            titleScreen.emit('titleScreen:play');
        });

        craftButton.on('InputSelect', function () {
            titleScreen.emit('titleScreen:craft');
        });

        //// /* When the game screen has signalled that the game is over,
        ////  * show the title screen so that the user may play the game again.
        ////  */
        //// gamescreen.on('gamescreen:end', function () {
        ////     rootView.pop();
        //// });
    };

    /* Executed after the asset resources have been loaded.
     * If there is a splash screen, it's removed.
     */
    this.launchUI = function () {};
});
