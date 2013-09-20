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
            width: 32,
            height: 40
        });

        supr(this, 'init', [opts]);
    };

    this.run = function () {
        this.sheepSheared = 0;
        if (this.getSuperview().isTutorial) {
            this.maxSheep = 1;
        } else {
            this.maxSheep = GC.app.player.upgrades.get('blade').value;
        }

        if (this.getSuperview().clipper.isDiamond) {
            this.setImage(constants.diamondBladeImage);
            this.isDiamond = true;
        } else {
            this.setImage(constants.regularBladeImage);
            this.isDiamond = false;
        }

        this.animator = animate(this).now({x: 1024}, timeOnScreen, animate.linear).then(bind(this, this.die));
    };

    this.die = function () {
        this.animator.clear();
        var superview = this.getSuperview();
        superview.clipper.blades.splice(superview.clipper.blades.indexOf(this), 1);
        superview.clipper.bladeOut = false;
        superview.clipper.reloadBlade();
        superview.clipper.bladePool.releaseView(this);
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

        this.die();
    };
});
