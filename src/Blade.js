import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;
import src.Inventory as Inventory;

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
                i = sheep.length,
                inventory = this.getSuperview().inventory;
            this.style.x = this.style.x + stepSize;
            if (this.style.x > 1024) {
                this.removeFromSuperview();
            } else {
                while (i--) {
                    if (intersect.rectAndRect(sheep[i].style, this.style)) {
                        inventory.wool[sheep[i].color.label] += 1;
                        clearInterval(interval);
                        sheep[i].die();
                        this.removeFromSuperview();
                        break;
                    }
                }
            }
        }), stepFrequency)
    };
});
