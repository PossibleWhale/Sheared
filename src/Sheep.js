import ui.ImageView as ImageView;

var stepSize = 13,
    stepFrequency = 50; // step every x milliseconds

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/ewe-white.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        setInterval(bind(this, function () {
            this.style.x = this.style.x - stepSize;
            if (this.style.x < -1*this.style.width) {
                this.removeFromSuperview();
            }
        }), stepFrequency)
    };
});
