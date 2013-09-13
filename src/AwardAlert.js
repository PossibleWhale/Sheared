import animate;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import src.constants as constants;
import src.Button as Button;

var instances = [];

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 1024/2 - 312,
            y: -80,
            zIndex: 99,
            width: 624,
            height: 80,
            image: 'resources/images/award-alert.png'
        });

        supr(this, 'init', [opts]);

        this.award = opts.award;
        this.build();
        instances.push(this);
    };

    this.build = function () {
        this.addSubview(new TextView({
            x: 20,
            y: 20,
            width: 420,
            height: 28,
            size: 24,
            color: '#ffffff',
            fontFamily: 'delius',
            text: this.award.text,
            horizontalAlign: 'left'
        }));

        this.addSubview(new TextView({
            x: 490,
            y: 20,
            width: 130,
            height: 28,
            size: 24,
            color: '#ffffff',
            strokeWidth: 3,
            strokeColor: '#333333',
            shadowColor: '#000000',
            fontFamily: 'delius',
            text: '' + this.award.reward,
            horizontalAlign: 'left'
        }));
    };

    this.show = function () {
        if (this.award === instances[0].award) {
            animate(instances[0]).now({y: 0}, 1000).wait(1000).then({y: -80}, 1000).then(function () {
                instances.shift();
                if (instances.length > 0) {
                    instances[0].show();
                }
            });
        }
    };
});

