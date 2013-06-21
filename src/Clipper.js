import src.constants as constants;
import ui.ImageView as ImageView;

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
        this.health = 5;
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
            this.setImage('resources/images/clipper-' + this.health + '-regular.png');
        } else {
            this.getSuperview().gameOver();
        }
    };
});
