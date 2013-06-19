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

/* Your application inherits from GC.Application, which is
 * exported and instantiated when the game is run.
 */
exports = Class(GC.Application, function () {

    /* Run after the engine is created and the scene graph is in
     * place, but before the resources have been loaded.
     */
    this.initUI = function () {
        var titleScreen = new TitleScreen(),
                craftScreen = new CraftScreen(); // , playScreen = new PlayScreen();

        this.view.style.backgroundColor = '#30B040';

        //Add a new StackView to the root of the scene graph
        var hh = 270, ww = 270*16/9;
        var rootView = new StackView({
            superview: this,
            x: 0,
            y: (device.height - hh)/2,
            height: hh,
            width: ww,
            clip: true,
            backgroundColor: '#37B34A'
        });

        rootView.push(titleScreen);

        var playButton = new ui.View({
            superview: this,
            x: 110,
            y: 168,
            width: 50,
            height: 28,
            opacity: 0.5,
            backgroundColor: '#aa77aa'
        });

        var craftButton = new ui.View({
            superview: this,
            x: 321,
            y: 168,
            width: 58,
            height: 28,
            opacity: 0.5,
            backgroundColor: '#77aa77'
        });

        playButton.on('InputSelect', bind(this, function () {
            this.emit('titleScreen:play');
        }));

        craftButton.on('InputSelect', bind(this, function () {
            this.emit('titleScreen:craft');
        }));

        titleScreen.on('titleScreen:play', bind(this, function () {
            rootView.push(playScreen);
            playScreen.emit('play:start');
        }));

        titleScreen.on('titleScreen:craft', bind(this, function () {
            rootView.push(craftScreen);
            craftScreen.emit('craft:start');
        }));

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
