import src.Pickup as Pickup;

exports = Class(Pickup, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/diamond.png'
        });

        supr(this, 'init', [opts]);
    };

    this.apply = function () {
        var superview = this.getSuperview();
        superview.clipper.becomeDiamond();
        superview.player.collectedDiamond();
        superview.audio.playDiamond();
    };
});
