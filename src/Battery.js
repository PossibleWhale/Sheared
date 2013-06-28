import src.Pickup as Pickup;

exports = Class(Pickup, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            // TODO use real battery image
            image: 'resources/images/particle-red.png'
        });

        supr(this, 'init', [opts]);
    };

    this.apply = function () {
        var superview = this.getSuperview();
        superview.clipper.increaseHealth(1);
    };
});

