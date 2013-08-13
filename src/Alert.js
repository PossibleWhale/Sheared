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
            zIndex: 99,
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
        this.addSubview(new TextView({
            x: 40,
            y: 40,
            width: 340,
            height: 195,
            color: '#333333',
            fontFamily: 'delius',
            size: 128,
            horizontalAlign: 'left',
            wrap: true,
            text: this.text
        }));

        this.confirmButton = new Button({
            superview: this,
            x: 10,
            y: 248,
            zIndex: 99,
            width: 400,
            height: 40
        });
        this.confirmButton.on('InputSelect', bind(this, this.confirmFn));

        this.addSubview(new TextView({
            x: 37,
            y: 253,
            width: 310,
            height: 30,
            color: '#333333',
            fontFamily: 'delius',
            text: this.confirmText,
            horizontalAlign: 'right'
        }));

        this.cancelButton = new Button({
            superview: this,
            x: 375,
            y: 0,
            zIndex: 99,
            width: 50,
            height: 40
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
