import animate;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import src.constants as constants;

var instances = [];

exports = Class(TextView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 1024/2 - 210,
            y: -80,
            zIndex: 99,
            width: 420,
            height: 80,
            color: '#FFFFFF',
            backgroundColor: '#333333'
        });

        supr(this, 'init', [opts]);

        this.award = opts.award;
        this.build();
        instances.push(this);
    };

    this.build = function () {
        this.setText(this.award.text + '  +' + this.award.reward);
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

