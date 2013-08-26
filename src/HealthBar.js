import ui.ImageView as ImageView;
import src.util as util;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        if (!opts.health) {
            this.maxHealth = GC.app.player.maxClipperHealth;
        } else {
            this.maxHealth = opts.health;
        }
        this.health = this.maxHealth;

        opts = merge(opts, {
            autoSize: true
        });

        supr(this, 'init', [opts]);
        this.updateImage();
    };

    this.updateImage = function () {
        var imagePath = 'resources/images/power-' +
            util.zeroPad(this.maxHealth, 2) + '-' +
            util.zeroPad(this.health, 2) + '.png';
        this.setImage(imagePath);
    };

    this.decreaseHealth = function () {
        this.health -= 1;
        if (this.health <= 0) {
            this.getSuperview().gameOver();
        }
        this.updateImage();
    };

    this.increaseHealth = function (amt) {
        if (this.health === this.maxHealth) {
            return;
        }
        this.health += amt;
        this.health = Math.min(this.maxHealth, this.health);
        this.updateImage();
    };

    this.resetHealth = function () {
        this.increaseHealth(this.maxHealth);
    };
});
