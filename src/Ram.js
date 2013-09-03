import src.Sheep as Sheep;
import ui.View as View;

exports = Class(Sheep, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 117,
            height: 108
        });
        supr(this, 'init', [opts]);
        this.setImage(this.color.ramImage);
        if (opts.fromTutorial) {
            this.bolts = 5;
        } else {
            this.bolts = 5 * GC.app.player.boltMultiplier;
        }
        this.isRam = true;
    };
});
