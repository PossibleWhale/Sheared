import animate;
import src.constants as constants;
import ui.ImageView as ImageView;
import ui.View as View;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        var color = opts.color || randomColor();

        opts = merge(opts, {
            width: 108,
            height: 82,
            clip: false
        });

        supr(this, 'init', [opts]);

        this.image = new ImageView({
            superview: this,
            image: color.eweImage,
            width: this.style.width,
            height: this.style.height,
            anchorX: 108/2,
            anchorY: 82/2
        });

        this.color = color;
        if (opts.fromTutorial) {
            this.bolts = 1;
        } else {
            this.bolts = GC.app.player.boltMultiplier;
        }
        this.isRam = false;
    };

    this._calcTrajectory = function () {
        var ydist = this.startY - this.endY;
        this.style.r = Math.atan(ydist/1024),
        this.timeToLive = (Math.random() * 3000) + 2000;
    };

    // stuff we need to do every tick
    this.onTick = function () {
        if (this.animator && this.animator.hasFrames()) {
            var superview = this.getSuperview(), i, blade;
            if (!superview) {
                this.animator.clear();
                return;
            }
            //this.emitDust()

            var hitBox = new Rect({
                x: this.style.x + 5,
                y: this.style.y + 5,
                width: this.style.width - 10,
                height: this.style.height - 10,
                r: this.style.r
            });

            i = superview.clipper.blades.length;
            while (i--) {
                blade = superview.clipper.blades[i];
                if (blade.getSuperview() && intersect.rectAndRect(hitBox, blade.style)) {

                    var wool = superview.dailyWool;

                    if (!this.isRam || blade.isDiamond) {
                        blade.sheepSheared++;
                        if (blade.sheepSheared >= blade.maxSheep) {
                            blade.die();
                        }
                        if (blade.sheepSheared === 1) {
                            superview.clipper.reloadBlade();
                            superview.clipper.bladeOut = false;
                            superview.clipper.reloadBlade();
                        }

                        GC.app.audio.playShear();
                        if (Math.random() < 0.25) {
                            GC.app.audio.playBaa();
                        }
                        if (wool) {
                            wool.addWool(this.color, this.bolts);
                        }
                        GC.app.player.shearedSheep(this);
                        GC.app.player.hitWithBlade(blade.isDiamond);
                        this.emit('sheep:sheared');
                        this.emitWool();
                        superview.woolCounts.wool.addWool(this.color, this.bolts);
                        superview.woolCounts.update(this.color);
                        this.die();
                    } else {
                        blade.ricochet();
                    }

                    return;
                }
            }
            if (intersect.rectAndRect(hitBox,
                new Rect({
                    x: superview.clipper.style.x + superview.clipper.marginSize,
                    y: superview.clipper.style.y + superview.clipper.marginSize,
                    width: superview.clipper.clipperBox.style.width,
                    height: superview.clipper.clipperBox.style.height
                }))) {

                this.emit('sheep:collision');
                superview.clipper.emitSparks();
                superview.healthBar.decreaseHealth();
                GC.app.audio.playCollision();
                this.die();
            }
        }
    };

    this.setImage = function (image) {
        this.image.setImage(image);
    };

    this.continuousAnimate = function () {
        animate(this.image).clear().now({r: -1*constants.WIGGLE_RADIANS}, this.timeToLive/10, animate.easeIn)
            .then({r: constants.WIGGLE_RADIANS}, this.timeToLive/10, animate.easeIn)
            .then(this.continuousAnimate.bind(this));
    };

    this.run = function () {
        this._calcTrajectory();
        this.continuousAnimate();
        this.animator = animate(this).now({x: 0 - this.style.width, y: this.endY}, this.timeToLive, animate.linear)
            .then(bind(this, function () {
            this.emit('sheep:offscreen');
            this.die();
        }));
    };

    this.die = function () {
        this.animator.clear();
        if (this.getSuperview()) {
            this.getSuperview().removeSheep(this);
        }
        this.removeAllListeners();
    };

    this.emitWool = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(this.bolts), i;
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
        GC.app.particleEngine.emitParticles(particleObjects);
    };

    this.emitDust = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(3), i;
        for (i = 0; i < particleObjects.length; i++) {
            var pObj = particleObjects[i];
            pObj.x = this.style.x + this.style.width;
            pObj.y = this.style.y + this.style.height/2;
            pObj.dx = Math.random() * 50;
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
            pObj.opacity = 1;
            pObj.dopacity = -1;
            if (Math.random() > 0.5) {
                pObj.image = 'resources/images/particle-grass-1.png';
            } else {
                pObj.image = 'resources/images/particle-grass-2.png';
            }
        }
        GC.app.particleEngine.emitParticles(particleObjects);
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
