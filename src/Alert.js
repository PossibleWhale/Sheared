import animate;
import ui.TextView as TextView;
import ui.View as View;
import src.constants as constants;
import src.Button as Button;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 1024/2 - 250,
            y: 576,
            width: 500,
            height: 300,
            backgroundColor: '#333333',
        });

        supr(this, 'init', [opts]);

        this.text = opts.text || 'Do you wish to continue?';
        this.showCancelButton = opts.showCancelButton !== undefined ? opts.showCancelButton : true;
        this.cancelText = opts.cancelText || 'Cancel';
        this.confirmText = opts.confirmText || 'OK';
        this.confirmFn = function () {
            if (opts.confirmFn) {
                opts.confirmFn();
            }
            animate(this).now({y: -300}, 400).then(this.removeFromSuperview);
        };
        this.cancelFn = function () {
            if (opts.cancelFn) {
                opts.cancelFn();
            }
            animate(this).now({y: 576}, 400).then(this.removeFromSuperview);
        };

        this.build();
    };

    this.build = function () {
        this.addSubview(new TextView(merge({
            x: 0,
            y: 0,
            width: 500,
            height: 250,
            text: this.text
        }, constants.TEXT_OPTIONS)));

        this.confirmButton = new Button({
            superview: this,
            x: 250,
            y: 250,
            width: 250,
            height: 50,
            text: this.confirmText
        });
        this.confirmButton.on('InputSelect', bind(this, this.confirmFn));

        if (this.showCancelButton) {
            this.cancelButton = new Button({
                superview: this,
                x: 0,
                y: 250,
                width: 250,
                height: 50,
                text: this.cancelText
            });
            this.cancelButton.on('InputSelect', bind(this, this.cancelFn));
        }
    };

    this.show = function () {
        animate(this).now({y: 576/2 - 150}, 400);
    };
});
