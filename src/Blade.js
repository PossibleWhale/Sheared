import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;
import src.Player as Player;

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
            var superview = this.getSuperview();

            if (!superview) {
                clearInterval(interval);
                return;
            }
            var sheep = superview.sheep,
                i = sheep.length,
                inventory = superview.dailyInventory;
            this.style.x = this.style.x + stepSize;
            if (this.style.x > 1024) {
                clearInterval(interval);
                this.removeFromSuperview();
                superview.bladeOut = false;
                superview.clipper.reloadBlade();
            } else {
                while (i--) {
                    var rect = new Rect({
                        x: sheep[i].style.x + 5,
                        y: sheep[i].style.y + 5,
                        width: sheep[i].style.width - 10,
                        height: sheep[i].style.height - 10
                    });
                    if (intersect.rectAndRect(rect, this.style)) {
                        if (!sheep[i].isRam || this.isDiamond) {
                            inventory.addWool(sheep[i].color.label, sheep[i].bolts);
                            superview.player.shearedSheep(sheep[i]);
                            superview.player.hitWithBlade(this.isDiamond);
                            sheep[i].emitWool();
                            sheep[i].die();
                        }
                        clearInterval(interval);
                        this.removeFromSuperview();
                        superview.bladeOut = false;
                        superview.clipper.reloadBlade();
                        break;
                    }
                }
            }
        }), stepFrequency)
    };
});
