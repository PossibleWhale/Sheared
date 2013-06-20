import ui.ImageView as ImageView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/ewe-white.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        setInterval(bind(this, function () {
            this.style.x = this.style.x - 10;
            if (this.style.x < 0) {
                this.removeFromSuperview();
            }
        }), 100)
    };
});
