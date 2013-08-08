import ui.TextView as TextView;
import ui.ImageView as ImageView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 232,
            y: 128,
            zIndex: 99,
            width: 560,
            height: 320,
            opacity: 0,
            image: 'resources/images/thought-bubble.png'
        });

        supr(this, 'init', [opts]);

        this.text = opts.text;
        this.build();
    };

    this.build = function () {
        this.addSubview(new TextView({
            x: 40,
            y: 40,
            width: 480,
            height: 240,
            color: '#333333',
            fontFamily: 'delius',
            wrap: true,
            text: this.text
        }));
    };
});

