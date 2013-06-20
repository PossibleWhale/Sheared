import ui.ImageView as ImageView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/ewe-white.png'
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

// return a random integer between 0 and 7, inclusive
function randomLane () {
    return Math.floor(Math.random()*8);
};
