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
        if (this.infinite) {
            superview.clipper.becomeDiamond(true);
        } else {
            superview.clipper.becomeDiamond();
        }
        GC.app.player.collectedDiamond();
        GC.app.audio.playDiamond();
        this.emit('diamond:pickup');
    };
});
