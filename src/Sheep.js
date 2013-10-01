import animate;
import src.constants as constants;
import src.util as util
import ui.ImageView as ImageView;
import ui.View as View;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 82,
            height: 56,
            clip: false,
            blockEvents: true
        });

        supr(this, 'init', [opts]);

        this.image = new ImageView({
            superview: this,
            width: 82,
            height: 56,
            anchorX: 41,
            anchorY: 28
        });

        this.fromTutorial = opts.fromTutorial;
        this.isRam = false;
    };

    this.onObtain = function () {
        var color;
        if (!this.fromTutorial || !this.color) {
            color = randomColor();
        } else {
            color = this.color;
        }

        if (this.fromTutorial) {
            this.bolts = 1;
        } else {
            this.bolts = GC.app.player.boltMultiplier;
        }

        if (color.label === 'gold' && !this.fromTutorial) {
            this.isGold = true;
        } else if (color.label !== 'gold') {
            this.isGold = false;
        }

        this.setImage(color.eweImage);
        this.style.x = 1024;
        this.style.y = util.randomY(this.style.height);
        this.startY = this.style.y;
        this.style.visible = true;

        var diagonalChance;
        if (!this.fromTutorial) {
            diagonalChance = 0.5;//Math.min(0.5, this.getSuperview().day*0.1);
        } else {
            diagonalChance = 0;
        }
        if (Math.random() < diagonalChance) {
            this.endY = util.randomY(this.style.height);
        } else {
            this.endY = this.startY;
        }

        this.color = color;
    };

    this.setImage = function (image) {
        this.image.setImage(image);
    };

    this._calcTrajectory = function () {
        var ydist = this.startY - this.endY;
        this.style.r = Math.atan(ydist/1024),
        this.timeToLive = (Math.random() * 3000) + 2000;
    };

    // stuff we need to do every tick
    this.onTick = function () {
        if (this.animator && this.animator.hasFrames()) {
            var superview = this.getSuperview(), i, blade, wool;
            if (!superview) {
                this.die();
                return;
            }

            i = superview.clipper.blades.length;
            wool = superview.dailyWool;
            while (i--) {
                blade = superview.clipper.blades[i];
                if (blade.getSuperview() && intersect.rectAndRect(this.style, blade.style)) {

                    if (!this.isRam || blade.isDiamond) {
                        blade.sheepSheared++;
                        if (blade.sheepSheared >= blade.maxSheep) {
                            blade.die();
                        } else if (blade.sheepSheared === 1) {
                            superview.clipper.bladeOut = false;
                            superview.clipper.reloadBlade();
                        }

                        if (!this.isGold) {
                            GC.app.audio.playShear();
                        } else {
                            GC.app.audio.playGoldShear();
                        }
                        GC.app.player.shearedSheep(this);
                        GC.app.player.hitWithBlade(blade.isDiamond);
                        this.emit('sheep:sheared');
                        this.emitWool();
                        if (!this.isGold) {
                            superview.woolCounts.wool.addWool(this.color, this.bolts);
                            superview.woolCounts.update(this.color);
                            if (wool) {
                                wool.addWool(this.color, this.bolts);
                            }
                        } else {
                            GC.app.player.addCoins(this.bolts*10);
                        }
                        this.die();
                    } else {
                        blade.ricochet();
                    }

                    return;
                }
            }
            if (intersect.rectAndRect(this.style, superview.clipper.style)) {
                this.emit('sheep:collision');
                superview.clipper.emitSparks();
                superview.healthBar.decreaseHealth();
                GC.app.audio.playCollision();
                this.die();
            }
        }
    };

    this.continuousAnimate = function () {
        this.rotation = animate(this.image).clear().now({r: -1*constants.WIGGLE_RADIANS}, this.timeToLive/10, animate.easeIn)
            .then({r: constants.WIGGLE_RADIANS}, this.timeToLive/10, animate.easeIn)
            .then(this.continuousAnimate.bind(this));
    };

    this.run = function () {
        this._calcTrajectory();
        this.continuousAnimate();
        if (Math.random() < 0.1) {
            GC.app.audio.playBaa();
        }
        this.animator = animate(this).now({x: 0 - this.style.width, y: this.endY}, this.timeToLive, animate.linear)
            .then(bind(this, function () {
            this.emit('sheep:offscreen');
            this.die();
        }));
    };

    this.die = function () {
        if (this.animator) {
            this.animator.clear();
            delete this.animator;
        }
        if (this.rotation) {
            this.rotation.clear();
            delete this.rotation;
        }
        if (this.getSuperview()) {
            this.getSuperview().sheepPool.releaseView(this);
            this.getSuperview().removeSheep(this);
        }
        this.removeAllListeners();
    };

    this.emitWool = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(this.bolts), i, pObj;
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
            pObj.dr = Math.random() * Math.PI / 4;
            pObj.ax = 30;
            pObj.ay = 30;
            pObj.width = 60;
            pObj.height = 60;
            pObj.scale = 0.5;
            pObj.dscale = 0.5;
            pObj.opacity = 1;
            pObj.dopacity = -1;
            pObj.image = this.isGold ? 'resources/images/particle-ewero.png' :
                        'resources/images/particle-' + this.color.label + '.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };

    this.emitDust = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(3), i, pObj;
        for (i = 0; i < particleObjects.length; i++) {
            pObj = particleObjects[i];
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
    var rarityTotal = 0, colors = constants.colors.concat([constants.COLOR_GOLD]),
        i = colors.length, r, currentTotal = 0;
    while (i--) {
        rarityTotal += colors[i].rarity;
    }
    r = Math.random()*rarityTotal;
    for (i = 0; i < colors.length; i++) {
        currentTotal += colors[i].rarity;
        if (r < currentTotal) {
            return colors[i];
        }
    }
}
