/* An "abstract class" of sorts for pickups.
 * Don't instantiate this ;)
 */
import animate;
import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;

var timeOnScreen = 3000;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.onTick = function () {
        if (this.animator && this.animator.hasFrames()) {
            var superview = this.getSuperview();
            if (intersect.rectAndRect(this.style, superview.clipper.style)) {
                this.apply();
                this.die();
            }
        }
    };

    this.run = function () {
        this.animator = animate(this).now({x: 0 - this.style.width}, timeOnScreen, animate.linear).then(bind(this, function () {
            this.emit('pickup:offscreen');
            this.die();
        }));
    };

    this.die = function () {
        this.hide();
        this.animator.clear();
    };
});

