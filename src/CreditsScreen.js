import ui.ImageView as ImageView;
import src.util as util;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/credits.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var backButton = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-return.png'
        });

        util.reissue(backButton, 'InputSelect', this, 'credits:back');
    };
});

