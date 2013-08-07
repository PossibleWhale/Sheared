import ui.StackView;
import ui.ImageView as ImageView;
import src.Button as Button;
import src.TutorialPlayScreen as TutorialPlayScreen;
import src.TutorialCraftScreen as TutorialCraftScreen;

exports = Class(ui.StackView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);
    };

    this.build = function() {

        this.menu = new ImageView({
            superview: this,
            image: "resources/images/tutorials.png",
            autoSize: true
        });

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
            this.popAll();
        }));
    };

    this.playTutorial = function () {
        this.tutorialScreen = new TutorialPlayScreen();
        this.push(this.tutorialScreen);
        this.tutorialScreen.clipperTutorial();
    };

    this.craftTutorial = function () {
        this.tutorialScreen = new TutorialCraftScreen();
        this.push(this.tutorialScreen);
        this.tutorialScreen.step1();
    };
});
