import src.constants as constants;
import src.Sheep as Sheep;
import ui.View as View;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;

exports = Class(Sheep, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 91,
            height: 57
        });
        supr(this, 'init', [opts]);

        this.image.style.width = 91;
        this.image.style.height = 57;
        this.image.style.anchorX = 45;
        this.image.style.anchorY = 28;
    };

    this.onObtain = function () {
        supr(this, 'onObtain');
        this.bolts = 0;
        this.woolToLose = 5;
        this.setImage(constants.pigImage);
    };

    this.run = function () {
        supr(this, 'run', [2000]);
    };

    this.onTick = function () {
        if (this.animator && this.animator.hasFrames()) {
            var superview = this.getSuperview(), i, blade, wool, lostWool, color;
            if (!superview) {
                this.die();
                return;
            }

            i = superview.clipper.blades.length;
            wool = superview.dailyWool;
            while (i--) {
                blade = superview.clipper.blades[i];
                if (blade.getSuperview() && intersect.rectAndRect(this.style, blade.style)) {
                    blade.ricochet();
                    this.emitBacon();
                }
            }

            if (intersect.rectAndRect(this.style, superview.clipper.style)) {
                i = Math.floor(Math.random()*5);
                color = constants.colors[i];
                lostWool = Math.min(this.woolToLose, wool.get(color).count);
                superview.woolCounts.wool.addWool(color, -1 * lostWool);
                superview.woolCounts.update(color);
                if (wool) {
                    wool.addWool(color, -1 * lostWool);
                }
                superview.clipper.emitWool(constants.colors[i], lostWool);
                GC.app.audio.playCollisionPig();
                this.die();
            }
        }
    };

    this.die = function () {
        if (this.getSuperview()) {
            this.getSuperview().pigPool.releaseView(this);
        }
        supr(this, 'die');
    };

    this.emitBacon = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(5), i, pObj;
        for (i = 0; i < particleObjects.length; i++) {
            pObj = particleObjects[i];
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
            pObj.dr = Math.random() * Math.PI / 2;
            pObj.ax = 30;
            pObj.ay = 30;
            pObj.width = 60;
            pObj.height = 60;
            pObj.scale = 0.5;
            pObj.dscale = 0;
            pObj.opacity = 1;
            pObj.dopacity = -1;
            pObj.image = 'resources/images/particle-bacon.png' 
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };
});

