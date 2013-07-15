import animate;
import ui.ImageView as ImageView;

import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

import src.Player as Player;
import src.constants as constants;

var timeOnScreen = 1500;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        if (this.getSuperview().clipper.isDiamond) {
            this.setImage('resources/images/blade-diamond.png');
            this.isDiamond = true;
        } else {
            this.setImage('resources/images/blade-regular.png');
            this.isDiamond = false;
        }

        var animator = animate(this).now({x: 1024}, timeOnScreen, animate.linear, bind(this, function () {
            var superview = this.getSuperview();

            if (!superview) {
                animator.clear();
                return;
            }
            var sheep = superview.sheep,
                i = superview.sheep ? sheep.length : 0,
                wool = superview.dailyWool;
            while (i--) {
                var rect = new Rect({
                    x: sheep[i].style.x + 5,
                    y: sheep[i].style.y + 5,
                    width: sheep[i].style.width - 10,
                    height: sheep[i].style.height - 10,
                    r: sheep[i].style.r
                });
                if (intersect.rectAndRect(rect, this.style)) {
                    if (!sheep[i].isRam || this.isDiamond) {
                        GC.app.audio.playShear();
                        if (Math.random() < 0.25) {
                            GC.app.audio.playBaa();
                        }
                        if (wool) {
                            wool.addWool(sheep[i].color, sheep[i].bolts);
                        }
                        GC.app.player.shearedSheep(sheep[i]);
                        GC.app.player.hitWithBlade(this.isDiamond);
                        sheep[i].emit('sheep:sheared');
                        sheep[i].emitWool();
                        sheep[i].die();
                        superview.woolCounts.update();
                    } else {
                        this.ricochet();
                    }
                    animator.clear();
                    this.removeFromSuperview();
                    superview.clipper.bladeOut = false;
                    superview.clipper.reloadBlade();
                    break;
                }
            }
        })).then(bind(this, function () {
            var superview = this.getSuperview();
            this.removeFromSuperview();
            superview.clipper.bladeOut = false;
            superview.clipper.reloadBlade();
        }));
    };

    this.ricochet = function () {
        var particleObjects = GC.app.particleEngine.obtainParticleArray(1);
        var pObj = particleObjects[0];
        pObj.x = this.style.x;
        pObj.y = this.style.y;
        pObj.dx = -400;
        pObj.dy = 400;
        pObj.ddx = 400;
        pObj.ddy = 400;
        pObj.dr = -1 * Math.PI;
        pObj.ax = 30;
        pObj.ay = 30;
        pObj.width = 60;
        pObj.height = 60;
        pObj.scale = 1;
        pObj.dscale = 3;
        pObj.opacity = 0.7;
        pObj.dopacity = -0.7;
        pObj.image = 'resources/images/particle-blade.png';
        GC.app.particleEngine.emitParticles(particleObjects);
        GC.app.audio.playRamHit();
    };
});
