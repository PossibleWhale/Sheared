import src.Sheep as Sheep;
import ui.View as View;
import ui.ImageView as ImageView;

exports = Class(Sheep, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 117,
            height: 108
        });
        supr(this, 'init', [opts]);
        if (opts.fromTutorial) {
            this.bolts = 5;
        } else {
            this.bolts = 5 * GC.app.player.boltMultiplier;
        }
        this.isRam = true;

        this.image.style.width = 117;
        this.image.style.height = 108;
        this.image.style.anchorX = 58;
        this.image.style.anchorY = 54;
    };

    this.onObtain = function () {
        supr(this, 'onObtain');
        this.setImage(this.color.ramImage);
    };

    this.die = function () {
        if (this.getSuperview()) {
            this.getSuperview().ramPool.releaseView(this);
        }
        supr(this, 'die');
    };
});
