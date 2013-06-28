import src.constants as constants;
import ui.ImageView as ImageView;

var maxHealth = 5;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/clipper-5-regular.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {
        this.health = maxHealth;
        this.isDiamond = false;
        this.on('InputStart', bind(this, function (evt) {
            this.startDrag({
                inputStartEvt: evt
            });
        }));

        this.on('DragStart', function (dragEvt) {
            this.dragOffset = {
                x: dragEvt.srcPt.x - this.style.x,
                y: dragEvt.srcPt.y - this.style.y
            };
        });

        this.on('Drag', bind(this, function (startEvt, dragEvt, delta) {
            var y = dragEvt.srcPt.y - this.dragOffset.y;

            this.style.x = dragEvt.srcPt.x - this.dragOffset.x;

            if (y > constants.fenceSize && y < 576 - constants.fenceSize - this.style.height) { 
                this.style.y = y;
            }
        }));
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
});
