import src.constants as constants;
import ui.ImageView as ImageView;
import ui.View as View;

var maxHealth = 5;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 229,
            height: 82
        });

        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function () {
        this.marginSize = 20;

        this.clipperBox = new ImageView({
            image: 'resources/images/clipper-5-regular.png',
            x: this.marginSize,
            y: this.marginSize,
            autoSize: true
        });
        this.addSubview(this.clipperBox);

        this.health = maxHealth;
        this.isDiamond = false;
        this.on('InputStart', bind(this, function (evt) {
            this.startDrag({
                inputStartEvt: evt
            });
        }));

        this.on('DragStart', bind(this, function (dragEvt) {
            this.dragOffset = {
                x: dragEvt.srcPt.x - this.style.x,
                y: dragEvt.srcPt.y - this.style.y
            };
        }));

        this.on('Drag', bind(this, function (startEvt, dragEvt, delta) {
            var y = dragEvt.srcPt.y - this.dragOffset.y;

            this.style.x = dragEvt.srcPt.x - this.dragOffset.x;

            if (y+this.marginSize > constants.fenceSize &&
                y-this.marginSize < 576 - constants.fenceSize - this.style.height) {

                this.style.y = y;
            }
        }));
    };

    this.setImage = function (img) {
        this.clipperBox.setImage(img);
    };

    this.decreaseHealth = function () {
        this.health -= 1;
        if (this.health > 0) {
            if (this.isDiamond) {
                this.setImage('resources/images/clipper-' + this.health + '-diamond.png');
            } else {
                this.setImage('resources/images/clipper-' + this.health + '-regular.png');
            }
        } else {
            this.getSuperview().gameOver();
        }
    };

    this.increaseHealth = function (amt) {
        if (this.health === maxHealth) {
            return;
        }
        this.health += amt;
        if (this.isDiamond) {
            this.setImage('resources/images/clipper-' + this.health + '-diamond.png');
        } else {
            this.setImage('resources/images/clipper-' + this.health + '-regular.png');
        }
    };

    this.becomeDiamond = function () {
        this.isDiamond = true;
        this.setImage('resources/images/clipper-' + this.health + '-diamond.png');
        setTimeout(bind(this, this.becomeRegular), 5000);
    };

    this.becomeRegular = function () {
        this.isDiamond = false;
        this.setImage('resources/images/clipper-' + this.health + '-regular.png');
    };

    this.reloadBlade = function () {
        if (this.health <= 0) {
            return;
        }
        if (this.isDiamond) {
            this.setImage('resources/images/clipper-' + this.health + '-diamond.png');
        } else {
            this.setImage('resources/images/clipper-' + this.health + '-regular.png');
        }
    };

    this.emitDiamonds = function () {
        var superview = this.getSuperview();
        if (!this.isDiamond || !superview) {
            return;
        }

        var particleObjects = superview.particleEngine.obtainParticleArray(1), i;
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
            pObj.image = 'resources/images/particle-diamond.png';
        }
        superview.particleEngine.emitParticles(particleObjects);
    };

    this.emitSparks = function () {
        var superview = this.getSuperview();
        if (!superview) {
            return;
        }

        var particleObjects = superview.particleEngine.obtainParticleArray(30), i;
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
        superview.particleEngine.emitParticles(particleObjects);
    };
});
