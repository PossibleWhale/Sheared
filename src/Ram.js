import src.Sheep as Sheep;

exports = Class(Sheep, function (supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.setImage(this.color.ramImage);
        this.bolts = 5
        this.isRam = true;
    };
});
