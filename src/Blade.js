import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;

var stepSize = 13,
    stepFrequency = 30;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/blade-regular.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        var interval;
        interval = setInterval(bind(this, function () {
            var sheep = this.getSuperview().sheep,
                i = sheep.length;
            this.style.x = this.style.x + stepSize;
            if (this.style.x > 1024) {
                this.removeFromSuperview();
            } else {
                while (i--) {
                    if (intersect.rectAndRect(sheep[i].style, this.style)) {
                        // TODO score
                        console.log("blade hit sheep");
                        clearInterval(interval);
                        sheep[i].die();
                        //this.getSuperview().removeSheep(sheep[i]);
                        this.removeFromSuperview();
                        break;
                    }
                }
            }
        }), stepFrequency)
    };
});

