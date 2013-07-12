import ui.StackView;
import ui.ImageView as ImageView;
import src.Button as Button;
import src.TutorialScreen as TutorialScreen;

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
            image: "resources/images/menu-instructions.png",
            autoSize: true
        });

        var playButton = new Button({
            superview: this,
            x: 117,
            y: 88,
            width: 320,
            height: 320
        });

        var craftButton = new Button({
            superview: this,
            x: 587,
            y: 88,
            width: 320,
            height: 320
        });

        this.backButton = new Button({
            superview: this,
            x: 0,
            y: 496,
            width: 1024,
            height: 80
        });

        playButton.on('InputSelect', bind(this, function () {
            this.playTutorial();
        }));

        craftButton.on('InputSelect', bind(this, function () {
        }));

        this.backButton.on('InputSelect', bind(this, function () {
            this.emit('tutorial:back');
            this.popAll();
        }));
    };

    this.playTutorial = function () {
        this.tutorialScreen = new TutorialScreen();
        this.push(this.tutorialScreen);
        this.tutorialScreen.clipperTutorial();
    };
});
