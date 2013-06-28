import src.constants as constants;
import ui.ImageView as ImageView;
import ui.View as View;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

var stepFrequency = 50; // step every x milliseconds

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        var color = randomColor();

        opts = merge(opts, {
            image: color.eweImage,
            width: 108,
            height: 82
        });

        supr(this, 'init', [opts]);

        this.stepSize = (Math.random() * 20) + 10;
        this.color = color;
        this.bolts = 1;
        this.isRam = false;
    };

    this.run = function () {

        this.interval = setInterval(bind(this, function () {
            var superview = this.getSuperview();

            this.style.x = this.style.x - this.stepSize;
            this.emitDust();

            if (this.style.x < -1*this.style.width) {
                this.die()
            } else if (intersect.rectAndRect(new Rect({
                x: this.style.x + 5,
                y: this.style.y + 5,
                width: this.style.width - 10,
                height: this.style.height - 10}), superview.clipper.style)) {

                superview.clipper.decreaseHealth();
                this.die();
            }
        }), stepFrequency);
    };

    this.die = function () {
        clearInterval(this.interval);
        if (this.getSuperview()) {
            this.getSuperview().removeSheep(this);
        }
    };

    this.emitWool = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = superview.particleEngine.obtainParticleArray(this.bolts), i;
        for (i = 0; i < particleObjects.length; i++) {
            var pObj = particleObjects[i];
            pObj.x = this.style.x;
            pObj.y = this.style.y;
            pObj.dx = Math.random() * 300;
            pObj.dy = Math.random() * 300;
            if (Math.random() > 0.5) {
                pObj.dx *= -1;
            }
            if (Math.random() > 0.5) {
                pObj.dy *= -1;
            }
            pObj.ddx = Math.random() * 200;
            pObj.ddy = Math.random() * 200;
            pObj.dr = Math.random() * Math.PI / 4;
            pObj.ax = 30;
            pObj.ay = 30;
            pObj.width = 60;
            pObj.height = 60;
            pObj.scale = 0.5;
            pObj.dscale = 0.5;
            pObj.opacity = 1;
            pObj.dopacity = -1;
            pObj.image = 'resources/images/particle-' + this.color.label + '.png';
        }
        superview.particleEngine.emitParticles(particleObjects);
    };

    this.emitDust = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = superview.particleEngine.obtainParticleArray(this.stepSize/10), i;
        for (i = 0; i < particleObjects.length; i++) {
            var pObj = particleObjects[i];
            pObj.x = this.style.x + 5;
            pObj.y = this.style.y + this.style.height/2;
            pObj.dx = Math.random() * 100;
            pObj.dy = Math.random() * -100;
            pObj.ddx = Math.random() * 200;
            pObj.ddy = Math.random() * 200;
            pObj.dr = Math.random() * Math.PI / 4;
            pObj.ax = 30;
            pObj.ay = 30;
            pObj.width = 60;
            pObj.height = 60;
            pObj.scale = 0.1;
            pObj.dscale = 0.4;
            pObj.opacity = 0.7;
            pObj.dopacity = -0.7;
            if (Math.random() > 0.5) {
                pObj.image = 'resources/images/particle-tan.png';
            } else {
                pObj.image = 'resources/images/particle-brown.png';
            }
        }
        superview.particleEngine.emitParticles(particleObjects);
    };
});

// return a random color taking into account rarity
function randomColor () {
    var rarityTotal = 0, i = constants.colors.length,
        r, currentTotal = 0;
    while (i--) {
        rarityTotal += constants.colors[i].rarity;
    }
    r = Math.random()*rarityTotal;
    for (i = 0; i < constants.colors.length; i++) {
        currentTotal += constants.colors[i].rarity;
        if (r < currentTotal) {
            return constants.colors[i];
        }
    }
}
