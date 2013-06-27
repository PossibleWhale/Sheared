import ui.TextView as TextView;

exports = Class(TextView, function (supr) {
    this.init = function (opts) {
        var initialTime = 30;

        opts = merge(opts, {
            color: '#FFFFFF',
            size: 128,
            autoFontSize: true,
            text: initialTime,
            horizontalAlign: 'center',
            strokeWidth: 4,
            strokeColor: '#000000'
        });

        supr(this, 'init', [opts]);

        this.time = initialTime;
    };

    this.run = function () {
        this.interval = setInterval(bind(this, function () {
            var superview = this.getSuperview();
            if (!superview) {
                this.stop();
                return;
            }
            this.time -= 1;
            this.setText(this.time);
            if (this.time <= 0) {
                this.stop();
                superview.timeOver();
            }
        }), 1000);
    };

    this.stop = function () {
        clearInterval(this.interval);
    }
});
