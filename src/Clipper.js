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
            this.style.x = dragEvt.srcPt.x - this.dragOffset.x;
            this.style.y = dragEvt.srcPt.y - this.dragOffset.y;
        }));

        this.on('DragStop', function (startEvt, dragEvt) {
            this.style.x = dragEvt.srcPt.x - this.dragOffset.x;
            this.style.y = dragEvt.srcPt.y - this.dragOffset.y;
        });
    };
});
