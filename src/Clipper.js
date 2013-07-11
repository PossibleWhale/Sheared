import src.constants as constants;
import src.Blade as Blade;
import ui.ImageView as ImageView;
import ui.View as View;

var maxHealth = 5;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/clipper-regular.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function () {
        this.marginSize = 10;

        this.clipperBox = new View({
            x: this.marginSize,
            y: this.marginSize,
            width: this.style.width - 2*this.marginSize,
            height: this.style.height - 2*this.marginSize
        });
        this.addSubview(this.clipperBox);

        this.health = maxHealth;
        this.isDiamond = false;
        this.bladeOut = false;
    };

    this.decreaseHealth = function () {
        this.health -= 1;
        if (this.health <= 0) {
            this.getSuperview().gameOver();
        }
    };

    this.increaseHealth = function (amt) {
        if (this.health === maxHealth) {
            return;
        }
        this.health += amt;
        this.health = Math.min(maxHealth, this.health);
    };

    this.becomeDiamond = function (infinite) {
        this.isDiamond = true;
        this.setImage('resources/images/clipper-diamond.png');
        if (!infinite) {
            setTimeout(bind(this, this.becomeRegular), 5000);
        }
    };

    this.becomeRegular = function () {
        this.isDiamond = false;
        this.setImage('resources/images/clipper-regular.png');
    };

    this.launchBlade = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }
        if (this.bladeOut) {
            return;
        }
        this.blade = new Blade({
            x: this.style.x + this.style.width,
            y: this.style.y + 3
        });
        superview.addSubview(this.blade);
        this.bladeOut = true;
        this.setImage('resources/images/clipper-none.png');
        this.blade.run();
    };

    this.reloadBlade = function () {
        if (this.health <= 0) {
            return;
        }
        if (this.isDiamond) {
            this.setImage('resources/images/clipper-diamond.png');
        } else {
            this.setImage('resources/images/clipper-regular.png');
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

    this.resetHealth = function () {
        this.increaseHealth(maxHealth);
    };
});
