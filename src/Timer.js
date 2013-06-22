import ui.TextView as TextView;

exports = Class(TextView, function (supr) {
    this.init = function (opts) {
        var initialTime = 60;

        opts = merge(opts, {
            color: '#FFFFFF',
            autoFontSize: true,
            text: initialTime,
            horizontalAlign: 'center'
        });

        supr(this, 'init', [opts]);

        this.time = initialTime;
    };

    this.run = function () {
        this.interval = setInterval(bind(this, function () {
            this.time -= 1;
            this.setText(this.time);
            if (this.time <= 0) {
                this.stop();
                this.getSuperview().timeOver();
            }
        }), 1000);
    };

    this.stop = function () {
        clearInterval(this.interval);
    }
});
