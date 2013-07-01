import ui.View as View;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.time = 0;
        this.diamondTime = Math.floor(Math.random() * 10) + 5;
        this.batteryTime = Math.floor(Math.random() * 20) + 10;
    };

    this.run = function () {
        this.interval = setInterval(bind(this, function () {
            var superview = this.getSuperview();
            if (!superview) {
                this.stop();
                return;
            }
            this.time += 1;
            if (this.time === this.diamondTime) {
                superview.spawnDiamond();
                this.diamondTime += Math.floor(Math.random() * 10) + 5;
            }
            if (this.time === this.batteryTime) {
                superview.spawnBattery();
                this.batteryTime += Math.floor(Math.random() * 20) + 10;
            }
            
        }), 1000);
    };

    this.stop = function () {
        clearInterval(this.interval);
    };
});
