import src.Pickup as Pickup;

exports = Class(Pickup, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/battery.png'
        });

        supr(this, 'init', [opts]);
    };

    this.apply = function () {
        var superview = this.getSuperview();
        superview.healthBar.increaseHealth(1);
        GC.app.player.collectedBattery();
        GC.app.audio.playBattery();
        this.emit('battery:pickup');
    };
});

