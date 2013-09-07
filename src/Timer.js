import ui.TextView as TextView;
import ui.ImageView as ImageView;

import src.debughack as dh;


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        var initialTime = 30;

        opts = merge(opts, {
             width: 54,
             height: 62,
             image: 'resources/images/timer.png'
        });

        supr(this, 'init', [opts]);

        this.text = new TextView({
            superview: this,
            x: 17,
            y: 24,
            width: 20,
            height: 20,
            color: '#333333',
            size: 20,
            autoFontSize: true,
            fontFamily: 'delius',
            text: initialTime,
            horizontalAlign: 'center',
            vertcalAlign: 'middle'
        });


        this.time = initialTime;
        this.setText(initialTime);

        this.diamondTime1 = Math.floor(Math.random() * 10) + 5;
        this.diamondTime2 = this.diamondTime1 + Math.floor(Math.random() * 5) + 10;
        this.diamondTime3 = this.diamondTime2 + Math.floor(Math.random() * 5) + 10;

        this.batteryTime1 = Math.floor(Math.random() * 20) + 10;
        this.batteryTime2 = this.batteryTime1 + Math.floor(Math.random() * 10) + 10;

        dh.post_initTimer(this);
    };

    this.setText = function (text) {
        this.text.setText(text);
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
            if (this.time === this.diamondTime1 ||
                this.time === this.diamondTime2 ||
                this.time === this.diamondTime3) {
                superview.spawnDiamond();
            }
            if (this.time === this.batteryTime1 ||
                this.time === this.batteryTime2) {
                superview.spawnBattery();
            }

            if (this.time === 5) {
                superview.audio.playCountdown();
            }

        }), 1000);
    };

    this.stop = function () {
        clearInterval(this.interval);
    };
});
