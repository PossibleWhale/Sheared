import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;
import src.Inventory as Inventory;

var stepSize = 20,
    stepFrequency = 10;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        if (this.getSuperview().clipper.isDiamond) {
            this.setImage('resources/images/blade-diamond.png');
            this.isDiamond = true;
        } else {
            this.setImage('resources/images/blade-regular.png');
            this.isDiamond = false;
        }
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
                        if (!sheep[i].isRam || this.isDiamond) {
                            inventory.addWool(sheep[i].color.label);
                            sheep[i].die();
                        }
                        clearInterval(interval);
                        this.removeFromSuperview();
                        superview.bladeOut = false;
                        break;
                    }
                }
            }
        }), stepFrequency)
    };
});
