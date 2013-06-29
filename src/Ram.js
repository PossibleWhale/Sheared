import src.Sheep as Sheep;
import ui.View as View;

exports = Class(Sheep, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 143,
            height: 134
        });
        supr(this, 'init', [opts]);
        this.setImage(this.color.ramImage);
        this.bolts = 5
        this.isRam = true;
    };
});
