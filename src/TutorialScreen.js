import animate;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.Clipper as Clipper;
import src.constants as constants;
import src.Button as Button;
import src.InputBuffer as InputBuffer;

var textOpts = {
    x: (1024-800)/2,
    y: (576-400)/2,
    width: 800,
    height: 400,
    color: '#FFFFFF',
    opacity: 0,
    fontFamily: 'delius',
    strokeWidth: 6,
    strokeColor: '#333333',
    wrap: true,
    size: 64,
    verticalAlign: 'middle',
    shadowColor: '#000000'
};

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/play.png'
        });

        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        this.clipper = new Clipper({
            superview: this,
            x: 0,
            y: 576/2 
        });
    };

    this.showTutorial = function () {
        var inputBuffer = new InputBuffer({superview: this}),
        moveText = new TextView(merge({
            superview: this,
            text: 'Drag on the left side of the screen to move the clipper.',
        }, textOpts)),
        fireText = new TextView(merge({
            superview: this,
            text: 'Tap on the right side of the screen to fire a blade.',
        }, textOpts));

        animate(inputBuffer.leftSide).now({opacity: 0.1}, 1000).wait(2000).then({opacity: 0}, 1000);
        animate(moveText).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {

            animate(inputBuffer.rightSide).now({opacity: 0.1}, 1000).wait(2000).then({opacity: 0}, 1000);
            animate(fireText).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function (){

                var nextButton = new Button({
                    superview: this,
                    x: 1024/2 - 80,
                    y: 576 - 80,
                    backgroundColor: '#FF00FF',
                    color: '#000000',
                    fontFamily: 'delius',
                    text: 'OK, got it!',
                    width: 160,
                    height: 80,
                    size: 128,
                    autoFontSize: true,
                    zIndex: 999
                });
                nextButton.on('InputSelect', function () {
                    console.log('next tutorial');
                });
            }));
        }));
    };
});
