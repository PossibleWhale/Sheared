import ui.ImageView as ImageView;
import src.util as util;
import src.MuteButton as MuteButton;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/credits.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        // header
        this.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        }));

        // footer
        this.addSubview(new ImageView({
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        }));

        // title
        this.addSubview(new ImageView({
            x: 192,
            y: 0,
            width: 640,
            height: 80,
            image: 'resources/images/header-credits.png'
        }));

        // background
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/background-wood.png'
        }));

        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/tab-0.png'
        }));

        this.addSubview(new ImageView({
            x: 172,
            y: 113,
            width: 680,
            height: 350,
            image: 'resources/images/credits.png'
        }));

        this.addSubview(new MuteButton({
            x: 944,
            y: 0,
            zIndex: 9999,
            width: 80,
            height: 80
        }));

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

