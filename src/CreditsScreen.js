import ui.ImageView;

import src.Button as Button;
import src.util as util;

exports = Class(ui.ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/credits.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var backButton = new Button({
            superview: this,
            x: 0,
            y: 496,
            width: 1024,
            height: 80
        });

        util.reissue(backButton, 'InputSelect', this, 'credits:back');
    };
});

