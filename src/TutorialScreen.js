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
    };

    this.build = function() {
        this.page = 1;

        this.gestureView = new GestureView({
            x: 0,
            y: 0,
            width: this.style.width,
            height: this.style.height
        });

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
            this.craftTutorial();
        }));

        this.backButton.on('InputSelect', bind(this, function () {
            this.emit('tutorial:back');
            this.popAll();
        }));
    };

    this.playTutorial = function () {
        this.imagePath = 'instructions-play-';
        bind(this, instruct)(7);
    };

    this.craftTutorial = function () {
        this.imagePath = 'instructions-craft-';
        bind(this, instruct)(4);
    };
});

function instruct (numPages) {
    var tutorial = new ImageView({
        image: 'resources/images/' + this.imagePath + '1.png',
        autoSize: true
    });

    tutorial.addSubview(this.gestureView);
    tutorial.addSubview(this.backButton);
    this.push(tutorial);

    this.gestureView.on('Swipe', bind(this, function (angle, direction, numFingers) {
        var reverse = false;
        if (direction === 'right' && this.page > 1) {
            this.page -= 1;
            reverse = true;
        } else if (direction === 'left' && this.page < numPages) {
            this.page += 1;
        }

        if (this.page >= 1 && this.page <= numPages) {
            var next = new ImageView({
                image: 'resources/images/' + this.imagePath + this.page + '.png',
                autoSize: true
            });
            next.addSubview(this.gestureView);
            next.addSubview(this.backButton);
            if (reverse) {
                this.pop();
            }
            this.push(next, false, reverse);
        }
    }));
}
