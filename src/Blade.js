import src.constants as constants;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;
import src.Player as Player;

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
                i = superview.sheep ? sheep.length : 0,
                inventory = superview.dailyInventory;
            this.style.x = this.style.x + stepSize;
            if (this.style.x > 1024) {
                clearInterval(interval);
                this.removeFromSuperview();
                superview.clipper.bladeOut = false;
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
                            GC.app.audio.playShear();
                            if (Math.random() < 0.25) {
                                GC.app.audio.playBaa();
                            }
                            if (inventory) {
                                inventory.addWool(sheep[i].color.label, sheep[i].bolts);
                            }
                            GC.app.player.shearedSheep(sheep[i]);
                            GC.app.player.hitWithBlade(this.isDiamond);
                            sheep[i].emit('sheep:sheared');
                            sheep[i].emitWool();
                            sheep[i].die();
                        } else {
                            this.ricochet();
                        }
                        clearInterval(interval);
                        this.removeFromSuperview();
                        superview.clipper.bladeOut = false;
                        superview.clipper.reloadBlade();
                        break;
                    }
                }
            }
        }), stepFrequency)
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
