import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;

var stepSize = 13,
    stepFrequency = 50; // step every x milliseconds

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: randomColor().image,
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        this.interval = setInterval(bind(this, function () {
            var superview = this.getSuperview();
            this.style.x = this.style.x - stepSize;
            if (this.style.x < -1*this.style.width) {
                this.die()
            } else if (intersect.rectAndRect(this.style, superview.clipper.style)) {
                // TODO decrease clipper health
                console.log("sheep hit clipper");
                this.die();
            }
        }), stepFrequency)
    };

    this.die = function () {
        clearInterval(this.interval);
        this.getSuperview().removeSheep(this);
    };
});

function randomColor () {
    var maxIdx = constants.colors.length;
    return constants.colors[Math.floor(Math.random() * maxIdx)];
}
