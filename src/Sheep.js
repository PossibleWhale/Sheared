import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;

var stepFrequency = 50; // step every x milliseconds

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        var color = randomColor();

        opts = merge(opts, {
            image: color.eweImage,
            autoSize: true
        });

        supr(this, 'init', [opts]);

        this.stepSize = (Math.random() * 20) + 10;
        this.color = color;
        this.bolts = 1;
        this.isRam = false;
    };

    this.run = function () {
        this.interval = setInterval(bind(this, function () {
            var superview = this.getSuperview();

            this.style.x = this.style.x - this.stepSize;
            if (this.style.x < -1*this.style.width) {
                this.die()
            } else if (intersect.rectAndRect(this.style, superview.clipper.style)) {
                superview.clipper.decreaseHealth();
                this.die();
            }
        }), stepFrequency)
    };

    this.die = function () {
        clearInterval(this.interval);
        if (this.getSuperview()) {
            this.getSuperview().removeSheep(this);
        }
    };
});

// return a random color taking into account rarity
function randomColor () {
    var rarityTotal = 0, i = constants.colors.length,
        r, currentTotal = 0;
    while (i--) {
        rarityTotal += constants.colors[i].rarity;
    }
    r = Math.random()*rarityTotal;
    for (i = 0; i < constants.colors.length; i++) {
        currentTotal += constants.colors[i].rarity;
        if (r < currentTotal) {
            return constants.colors[i];
        }
    }
}
