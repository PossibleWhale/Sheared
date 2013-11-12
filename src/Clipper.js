import src.util as util;
import src.constants as constants;
import src.Blade as Blade;
import ui.ImageView as ImageView;
import ui.View as View;
import ui.ViewPool as ViewPool;


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 128,
            height: 46,
            image: constants.clipperRegularImage
        });

        supr(this, 'init', [opts]);

        this.infiniteDiamond = opts.infiniteDiamond || false;
        this.build();
    };

    this.build = function () {
        this.checkGold();

        this.isDiamond = false;
        this.bladeOut = false;
        this.blades = [];

        this.bladePool = new ViewPool({
            ctor: Blade,
            initCount: 3,
        });

    };

    this.checkGold = function () {
        if (GC.app.player.hasAllUpgrades() &&
            !this.getSuperview().isTutorial) {

            this.isGold = true;
            this.setImage(constants.clipperGoldImage);
        }
    };

    this.becomeDiamond = function (infinite) {
        var superview = this.getSuperview();
        this.countdown = 5;

        this.isDiamond = true;
        if (this.isGold) {
            this.setImage(constants.clipperGoldDiamondImage);
        } else {
            this.setImage(constants.clipperDiamondImage);
        }

        superview.diamondIndicator.show();

        if (!infinite) {
            this.startCountdown();
        }
    };

    this.becomeRegular = function () {
        var superview = this.getSuperview();
        clearInterval(this.interval);
        this.isDiamond = false;
        if (this.isGold) {
            this.setImage(constants.clipperGoldImage);
        } else {
            this.setImage(constants.clipperRegularImage);
        }
        if (superview) {
            superview.diamondIndicator.hide();
        }
    };

    this.startCountdown = function () {
        if (this.infiniteDiamond) {
            return;
        }
        this.interval = setInterval(bind(this, function () {
            if (this.countdown <= 0) {
                this.becomeRegular();
            }
            this.countdown--;
        }), 1000);
    };

    this.pauseCountdown = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };

    this.launchBlade = function () {
        var superview = this.getSuperview(), newBlade;
        if (!superview) {
            return;
        }
        if (this.bladeOut) {
            return;
        }
        newBlade = this.bladePool.obtainView();
        newBlade.updateOpts({
            superview: superview,
            x: this.style.x + this.style.width,
            y: this.style.y + 3,
            visible: true
        });
        this.blades.push(newBlade);
        this.bladeOut = true;
        if (this.isGold) {
            this.setImage(constants.clipperGoldNoneImage);
        } else {
            this.setImage(constants.clipperNoneImage);
        }
        newBlade.run();
    };

    this.reloadBlade = function () {
        if (this.isDiamond) {
            if (this.isGold) {
                this.setImage(constants.clipperGoldDiamondImage);
            } else {
                this.setImage(constants.clipperDiamondImage);
            }
        } else {
            if (this.isGold) {
                this.setImage(constants.clipperGoldImage);
            } else {
                this.setImage(constants.clipperRegularImage);
            }
        }
    };

    this.emitDiamonds = function () {
        var superview = this.getSuperview();
        if (!this.isDiamond || !superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(1), i, pObj;
        for (i = 0; i < particleObjects.length; i++) {
            pObj = particleObjects[i];
            pObj.x = this.style.x + this.style.width/2;
            pObj.y = this.style.y + this.style.height/2;
            pObj.dx = Math.random() * 100;
            pObj.dy = Math.random() * 100;
            if (Math.random() > 0.5) {
                pObj.dx *= -1;
            }
            if (Math.random() > 0.5) {
                pObj.dy *= -1;
            }
            pObj.dr = Math.random() * Math.PI/2;
            pObj.width = 60;
            pObj.height = 60;
            pObj.scale = 0.1;
            pObj.dscale = 0.4;
            pObj.opacity = 1;
            pObj.dopacity = -1;
            pObj.image = 'resources/images/diamond.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };

    this.emitSparks = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(30), i, pObj;
        for (i = 0; i < particleObjects.length; i++) {
            pObj = particleObjects[i];
            pObj.x = this.style.x + this.style.width/2;
            pObj.y = this.style.y + this.style.height/2;
            pObj.dx = Math.random() * 300;
            pObj.dy = Math.random() * 200;
            if (Math.random() > 0.5) {
                pObj.dx *= -1;
            } else {
                pObj.dy *= -1;
            }
            pObj.r = Math.random() * 2 * Math.PI;
            pObj.width = 31;
            pObj.height = 52;
            pObj.scale = 1;
            pObj.dscale = -1;
            pObj.ttl = 300;
            pObj.opacity = 0.5;
            pObj.dopacity = -0.5;
            pObj.image = 'resources/images/bolt.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };

    this.emitWool = function (color, numParticles) {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(numParticles), i, pObj;
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
            pObj.image = 'resources/images/particle-' + color.label + '.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };
});
