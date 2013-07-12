import ui.ImageView as ImageView;

import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

import src.Player as Player;
import src.constants as constants;


var stepSize = 20,
    stepFrequency = 10;

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
        var interval;
        interval = setInterval(bind(this, function () {
            var superview = this.getSuperview();

            if (!superview) {
                clearInterval(interval);
                return;
            }
            var sheep = superview.sheep,
                i = sheep.length,
                wool = superview.dailyWool;
            this.style.x = this.style.x + stepSize;
            if (this.style.x > 1024) {
                clearInterval(interval);
                this.removeFromSuperview();
                superview.bladeOut = false;
                superview.clipper.reloadBlade();
            } else {
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
                            superview.audio.playShear();
                            if (Math.random() < 0.25) {
                                superview.audio.playBaa();
                            }
                            wool.addWool(sheep[i].color, sheep[i].bolts);
                            superview.player.shearedSheep(sheep[i]);
                            superview.player.hitWithBlade(this.isDiamond);
                            sheep[i].emitWool();
                            sheep[i].die();
                        } else {
                            var particleObjects = superview.particleEngine.obtainParticleArray(1);
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
                            superview.particleEngine.emitParticles(particleObjects);
                            superview.audio.playRamHit();
                        }
                        clearInterval(interval);
                        this.removeFromSuperview();
                        superview.bladeOut = false;
                        superview.clipper.reloadBlade();
                        break;
                    }
                }
            }
        }), stepFrequency)
    };
});
