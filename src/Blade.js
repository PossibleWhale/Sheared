import animate;
import ui.ImageView as ImageView;

import math.geom.intersect as intersect;
import math.geom.Rect as Rect;

import src.Player as Player;
import src.constants as constants;

var timeOnScreen = 1000;

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

        this.animator = animate(this).now({x: 1024}, timeOnScreen, animate.linear).then(bind(this, function () {
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

        this.removeFromSuperview();
        this.animator.clear();
    };
});
