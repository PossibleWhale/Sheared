import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;
import src.Inventory as Inventory;

var stepSize = 20,
    stepFrequency = 10;

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
            var superview = this.getSuperview(),
                sheep = superview.sheep,
                i = sheep.length,
                inventory = superview.inventory;
            this.style.x = this.style.x + stepSize;
            if (this.style.x > 1024) {
                clearInterval(interval);
                this.removeFromSuperview();
                superview.bladeOut = false;
            } else {
                while (i--) {
                    if (intersect.rectAndRect(sheep[i].style, this.style)) {
                        inventory.addWool(sheep[i].color.label);
                        clearInterval(interval);
                        sheep[i].die();
                        this.removeFromSuperview();
                        superview.bladeOut = false;
                        break;
                    }
                }
            }
        }), stepFrequency)
    };
});
