import ui.ImageView;
import src.Button as Button;

exports = Class(ui.ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/menu-play.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var normalButton = new Button({
            superview: this,
            x: 117,
            y: 88,
            width: 320,
            height: 320
        });

        var infiniteButton = new Button({
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

        normalButton.on('InputSelect', bind(this, function () {
            this.emit('play:normal');
        }));

        infiniteButton.on('InputSelect', bind(this, function () {
            this.emit('play:infinite');
        }));

        backButton.on('InputSelect', bind(this, function () {
            this.emit('play:back');
        }));
    };
});
