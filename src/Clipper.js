import src.util as util;
import src.constants as constants;
import src.Blade as Blade;
import ui.ImageView as ImageView;
import ui.View as View;

var diamondIndicator = new ImageView({
    x: 142,
    y: 0,
    width: 80,
    height: 80,
    image: 'resources/images/active-diamond.png'
});

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 128,
            height: 46,
            image: 'resources/images/clipper-regular.png'
        });

        supr(this, 'init', [opts]);

        this.infiniteDiamond = opts.infiniteDiamond || false;
        this.build();
    };

    this.build = function () {
        if (GC.app.player.upgrades.get('power').value === constants.UPGRADE_MAX.power &&
            GC.app.player.upgrades.get('mult').value === constants.UPGRADE_MAX.mult &&
            GC.app.player.upgrades.get('blade').value === constants.UPGRADE_MAX.blade &&
            GC.app.player.upgrades.get('diamond').value &&
            !this.getSuperview().isTutorial) {

            this.isGold = true;
            this.setImage('resources/images/clipper-gold-regular.png');
        }

        this.marginSize = 10;

        this.clipperBox = new View({
            x: this.marginSize,
            y: this.marginSize,
            width: this.style.width - 2*this.marginSize,
            height: this.style.height - 2*this.marginSize
        });
        this.addSubview(this.clipperBox);

        this.isDiamond = false;
        this.bladeOut = false;
        this.blades = [];

    };

    this.becomeDiamond = function (infinite) {
        this.countdown = 5;

        this.isDiamond = true;
        if (this.isGold) {
            this.setImage('resources/images/clipper-gold-diamond.png');
        } else {
            this.setImage('resources/images/clipper-diamond.png');
        }

        this.getSuperview().addSubview(diamondIndicator);

        if (!infinite) {
            this.startCountdown();
        }
    };

    this.becomeRegular = function () {
        clearInterval(this.interval);
        this.isDiamond = false;
        if (this.isGold) {
            this.setImage('resources/images/clipper-gold-regular.png');
        } else {
            this.setImage('resources/images/clipper-regular.png');
        }
        if (this.getSuperview()) {
            this.getSuperview().removeSubview(diamondIndicator);
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
        newBlade = new Blade({
            superview: superview,
            x: this.style.x + this.style.width,
            y: this.style.y + 3,
            fromTutorial: superview.isTutorial
        });
        this.blades.push(newBlade);
        this.bladeOut = true;
        if (this.isGold) {
            this.setImage('resources/images/clipper-gold-none.png');
        } else {
            this.setImage('resources/images/clipper-none.png');
        }
        newBlade.run();
    };

    this.reloadBlade = function () {
        if (this.isDiamond) {
            if (this.isGold) {
                this.setImage('resources/images/clipper-gold-diamond.png');
            } else {
                this.setImage('resources/images/clipper-diamond.png');
            }
        } else {
            if (this.isGold) {
                this.setImage('resources/images/clipper-gold-regular.png');
            } else {
                this.setImage('resources/images/clipper-regular.png');
            }
        }
    };

    this.emitDiamonds = function () {
        var superview = this.getSuperview();
        if (!this.isDiamond || !superview) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(1), i;
        for (i = 0; i < particleObjects.length; i++) {
            var pObj = particleObjects[i];
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

        var particleObjects = GC.app.particleEngine.obtainParticleArray(30), i;
        for (i = 0; i < particleObjects.length; i++) {
            var pObj = particleObjects[i];
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
            pObj.image = 'resources/images/particle-bolt.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };
});
