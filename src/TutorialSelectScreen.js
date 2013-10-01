import ui.View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.TutorialPlayScreen as TutorialPlayScreen;
import src.TutorialCraftScreen as TutorialCraftScreen;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        // header
        this.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        }));

        // footer
        this.addSubview(new ImageView({
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        }));

        // title
        this.addSubview(new ImageView({
            x: 200,
            y: 8,
            width: 624,
            height: 64,
            image: 'resources/images/header-tutorials.png'
        }));

        // background
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/background-wood.png'
        }));

        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/tab-0.png'
        }));

        // shearing title
        this.addSubview(new TextView({
            x: 259,
            y: 147,
            width: 206,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Shearing',
            horizontalAlign: 'center'
        }));

        // shearing button
        var playButton = new Button({
            superview: this,
            x: 259,
            y: 185,
            width:  206,
            height: 206,
            click: true,
            image: 'resources/images/button-tutorial-shearing.png'
        });

        // shearing tutorial
        this.addSubview(new TextView({
            x: 259,
            y: 401,
            width: 206,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Tutorial',
            horizontalAlign: 'center'
        }));

        // crafting title
        this.addSubview(new TextView({
            x: 559,
            y: 147,
            width: 206,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Crafting',
            horizontalAlign: 'center'
        }));

        // crafting button
        var craftButton = new Button({
            superview: this,
            x: 559,
            y: 185,
            width:  206,
            height: 206,
            click: true,
            image: 'resources/images/button-tutorial-crafting.png'
        });

        // crafting tutorial
        this.addSubview(new TextView({
            x: 559,
            y: 401,
            width: 206,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Tutorial',
            horizontalAlign: 'center'
        }));

        this.backButton = new Button({
            superview: this,
            x: 8,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-return.png'
        });

        playButton.on('InputSelect', bind(this, function () {
            this.playTutorial();
        }));

        craftButton.on('InputSelect', bind(this, function () {
            this.craftTutorial();
        }));

        this.backButton.on('InputSelect', bind(this, function () {
            this.emit('tutorial:back');
        }));

        this.muteButton = new MuteButton({
            superview: this,
            x: 952,
            y: 8,
            zIndex: 9999,
            width: 64,
            height: 64
        });

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
        }));
    };

    this.playTutorial = function () {
        if (this.tutorialScreen) {
            delete this.tutorialScreen;
        }
        this.tutorialScreen = new TutorialPlayScreen();
        GC.app.titleScreen.stackView.push(this.tutorialScreen);
        this.tutorialScreen.clipperTutorial();
    };

    this.craftTutorial = function () {
        if (this.tutorialScreen) {
            delete this.tutorialScreen;
        }
        this.tutorialScreen = new TutorialCraftScreen();
        GC.app.titleScreen.stackView.push(this.tutorialScreen);
        this.tutorialScreen.tutor();

        this.tutorialScreen.on('craft:back', bind(this, function () {
            this.emit('tutorial:back');
        }));
    };
});
