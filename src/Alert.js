import animate;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import src.constants as constants;
import src.Button as Button;
import src.util as util;

var instances = [];

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 1024/2 - 210,
            y: 576,
            width: 420,
            height: 320
        });

        supr(this, 'init', [opts]);

        this.text = opts.text || 'Do you wish to continue?';
        if (opts.confirmText) {
            this.setImage('resources/images/modal-close-ok.png');
            this.confirmText = opts.confirmText;
        } else {
            this.setImage('resources/images/modal-close-title.png');
        }
        this.confirmFn = function () {
            if (opts.confirmFn) {
                opts.confirmFn();
            }
            animate(this).now({y: -320}, 400).then(bind(this, function () {
                instances.pop();
                this.removeFromSuperview();
            }));
        };
        this.cancelFn = function () {
            if (opts.cancelFn) {
                opts.cancelFn();
            }
            animate(this).now({y: 576}, 400).then(bind(this, function () {
                instances.pop();
                this.removeFromSuperview();
            }));
        };

        this.build();
        instances.push(this);
    };

    this.build = function () {
        this.addSubview(new TextView(merge({
            x: 40,
            y: 40,
            width: 340,
            height: 195,
            text: this.text
        }, constants.TEXT_OPTIONS)));

        this.confirmButton = new Button({
            superview: this,
            x: 352,
            y: 253,
            zIndex: 99,
            width: 30,
            height: 30
        });
        this.confirmButton.on('InputSelect', bind(this, this.confirmFn));

        this.addSubview(new Button({
            x: 37,
            y: 253,
            width: 310,
            height: 30,
            text: this.confirmText,
            horizontalAlign: 'right'
        }));

        this.cancelButton = new Button({
            superview: this,
            x: 385,
            y: 5,
            zIndex: 99,
            width: 30,
            height: 30
        });
        this.cancelButton.on('InputSelect', bind(this, this.cancelFn));
    };

    this.show = function () {
        if (instances.length > 1) {
            instances.pop();
            delete this;
            return;
        }
        animate(this).now({y: 576/2 - 160}, 400);
    };
});
