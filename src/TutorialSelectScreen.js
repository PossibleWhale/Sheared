import ui.View;
import ui.ImageView as ImageView;
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
            x: 192,
            y: 0,
            width: 640,
            height: 80,
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

        // tutorial selector
        this.addSubview(new ImageView({
            x: 252,
            y: 113,
            width: 520,
            height: 350,
            image: "resources/images/tutorials.png",
        }));

        var playButton = new Button({
            superview: this,
            x: 262,
            y: 188,
            width: 200,
            height: 200
        });

        var craftButton = new Button({
            superview: this,
            x: 562,
            y: 188,
            width: 200,
            height: 200
        });

        this.backButton = new Button({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
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

        var muteButton = new MuteButton({
            superview: this,
            x: 944,
            y: 0,
            zIndex: 9999,
            width: 80,
            height: 80
        });
    };

    this.playTutorial = function () {
        this.tutorialScreen = new TutorialPlayScreen();
        GC.app.titleScreen.stackView.push(this.tutorialScreen);
        this.tutorialScreen.clipperTutorial();
    };

    this.craftTutorial = function () {
        this.tutorialScreen = new TutorialCraftScreen();
        GC.app.titleScreen.stackView.push(this.tutorialScreen);
        this.tutorialScreen.tutor();
    };
});
