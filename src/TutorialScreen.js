import ui.StackView;
import ui.ImageView as ImageView;
import ui.GestureView as GestureView;
import src.Button as Button;

exports = Class(ui.StackView, function (supr) {
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
        this.gestureView = new GestureView({
            x: 0,
            y: 0,
            width: this.style.width,
            height: this.style.height
        });

        this.menu = new ImageView({
            superview: this,
            image: "resources/images/menu-instructions.png"
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

        var backButton = new Button({
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
            this.craftTutorial();
        }));

        backButton.on('InputSelect', bind(this, function () {
            this.emit('tutorial:back');
        }));
    };

    this.playTutorial = function () {
        var tutorial = new ImageView({
            image: 'resources/images/instructions-play-1.png'
        });

        this.push(tutorial); 
        tutorial.addSubview(this.gestureView);

        this.gestureView.on('Swipe', function (angle, direction, numFingers) {
            console.log(direction);
        });
    };

    this.craftTutorial = function () {
        this.push(new ImageView({
            image: 'resources/images/instructions-craft-1.png'
        }));
    };
});
