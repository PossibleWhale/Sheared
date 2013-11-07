import ui.View as View;
import src.constants as constants;
import plugins.ouya.ouya as ouya;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            zIndex: 9999,
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        this.leftSide = new View({
            superview: this,
            x: 0,
            y: 0,
            zIndex: 1,
            width: 1024/2,
            height: 576,
            backgroundColor: '#FFFFFF',
            opacity: 0
        });
        this.rightSide = new View({
            superview: this,
            x: 1024/2,
            y: 0,
            zIndex: 1,
            width: 1024/2,
            height: 576,
            backgroundColor: '#FFFFFF',
            opacity: 0
        });

        this.rightSide.on('InputSelect', bind(this, function (evt) {
            bind(this, launchBlade)();
        }));

        // set up dragging events for clipper
        this.leftSide.on('InputStart', bind(this, function (evt) {
            this.leftSide.startDrag({
                inputStartEvt: evt
            });
        }));

        this.leftSide.on('DragStart', bind(this, function (dragEvt) {
            var superview = this.getSuperview();
            this.dragOffset = {
                x: dragEvt.srcPt.x - superview.clipper.style.x,
                y: dragEvt.srcPt.y - superview.clipper.style.y
            };
        }));

        this.leftSide.on('Drag', bind(this, function (startEvt, dragEvt, delta) {
            bind(this, clipperDrag)(dragEvt);
        }));

        this.leftSide.on("DragStop", bind(this, function (startEvt, dragEvt) {
            bind(this, clipperDrag)(dragEvt);
        }));

        // events for ouya controller
        ouya.onDigitalInput = bind(this, function (evt) {
            bind(this, launchBlade)();
        });

        ouya.onAnalogInput = bind(this, function (evt) {
            if (evt.lsx === 0 && evt.lsy === 0) {
                return;
            }
            var superview = this.getSuperview();

            if (!superview || !superview.clipper) {
                return;
            }

            var x = superview.clipper.style.x + evt.lsx,
                y = superview.clipper.style.y + evt.lsy;

            // confine x-movement to 0-1024
            if (x < 0) {
                superview.clipper.style.x = 0;
            } else if (x > 1024/2 - superview.clipper.style.width) {
                superview.clipper.style.x = 1024/2 - superview.clipper.style.width;
            } else {
                superview.clipper.style.x = x;
            }

            // confine y-movement to within fence
            if (y < constants.fenceSize) {
                superview.clipper.style.y = constants.fenceSize;
            } else if (y > 576 - constants.fenceSize - superview.clipper.style.height) {
                superview.clipper.style.y = 576 - constants.fenceSize - superview.clipper.style.height;
            } else {
                superview.clipper.style.y = y;
            }
        });
    };
});

function launchBlade() {
    var superview = this.getSuperview();
    if (!superview || (superview.timer && superview.timer.time === 0) || !superview.clipper) {
        return;
    }
    superview.clipper.launchBlade();
    GC.app.player.bladeFired(superview.clipper.isDiamond);
}

function clipperDrag(dragEvt) {
    var x = dragEvt.srcPt.x - this.dragOffset.x,
        y = dragEvt.srcPt.y - this.dragOffset.y,
        superview = this.getSuperview();

    if (!superview || !superview.clipper) {
        return;
    }

    // confine x-movement to 0-1024
    if (x < 0) {
        superview.clipper.style.x = 0;
    } else if (x > 1024/2 - superview.clipper.style.width) {
        superview.clipper.style.x = 1024/2 - superview.clipper.style.width;
    } else {
        superview.clipper.style.x = x;
    }

    // confine y-movement to within fence
    if (y < constants.fenceSize) {
        superview.clipper.style.y = constants.fenceSize;
    } else if (y > 576 - constants.fenceSize - superview.clipper.style.height) {
        superview.clipper.style.y = 576 - constants.fenceSize - superview.clipper.style.height;
    } else {
        superview.clipper.style.y = y;
    }
}

