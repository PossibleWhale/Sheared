import animate;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.Clipper as Clipper;
import src.constants as constants;
import src.Button as Button;
import src.InputBuffer as InputBuffer;
import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Battery as Battery;

var textOpts = {
    x: (1024-800)/2,
    y: (576-400)/2,
    width: 800,
    height: 400,
    color: '#FFFFFF',
    opacity: 0,
    fontFamily: 'delius',
    strokeWidth: 6,
    strokeColor: '#333333',
    wrap: true,
    size: 64,
    verticalAlign: 'middle',
    shadowColor: '#000000'
};

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/play.png'
        });

        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        this.clipper = new Clipper({
            superview: this,
            x: 0,
            y: 576/2 
        });
        this.inputBuffer = new InputBuffer({superview: this});
        this.nextButton = new Button({
            x: 1024/2 - 80,
            y: 576 - 80,
            backgroundColor: '#FF00FF',
            color: '#000000',
            fontFamily: 'delius',
            text: 'OK, got it!',
            width: 160,
            height: 80,
            size: 128,
            autoFontSize: true,
            zIndex: 999
        });
        this.sheep = [];
    };

    this.clipperTutorial = function () {
        var moveText = new TextView(merge({
            superview: this,
            text: 'Drag on the left side of the screen to move the clipper.',
        }, textOpts)),
        fireText = new TextView(merge({
            superview: this,
            text: 'Tap on the right side of the screen to fire a blade.',
        }, textOpts));

        animate(this.inputBuffer.leftSide).now({opacity: 0.1}, 1000).wait(2000).then({opacity: 0}, 1000);
        animate(moveText).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {

            animate(this.inputBuffer.rightSide).now({opacity: 0.1}, 1000).wait(2000).then({opacity: 0}, 1000);
            animate(fireText).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function (){

                this.addSubview(this.nextButton);
                this.nextButton.on('InputSelect', bind(this, function () {
                    this.nextButton.removeFromSuperview();
                    this.eweTutorial();
                }));
            }));
        }));
    };

    this.eweTutorial = function () {
        this.sheep.length = 0;
        this._resetClipper();

        var text = new TextView(merge({
            superview: this,
            text: 'Your regular clipper blade shears ewes.',
        }, textOpts));
        animate(text).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {
            var sheep = this._spawnSheep(constants.COLOR_WHITE, 576/2);

            sheep.on('sheep:sheared', bind(this, function() {
                text = new TextView(merge({
                    superview: this,
                    text: 'Each ewe sheared gives you one bolt of wool.',
                }, textOpts));
                animate(text).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {
                    var colorIdx = 1; // start with the second color because we already sent out white
                    this.interval = setInterval(bind(this, function () {
                        if (colorIdx > 4) {
                            clearInterval(this.interval);
                            return;
                        }

                        var sheep = this._spawnSheep(constants.colors[colorIdx], 576/2);
                        if (colorIdx === 4) {
                            sheep.on('sheep:sheared', bind(this, function () {
                                text = new TextView(merge({
                                    superview: this,
                                    text: 'Ewes appear in five colors. Each ewe gives one bolt of that color.'
                                }, textOpts));
                                animate(text).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {
                                    this.addSubview(this.nextButton);
                                    this.nextButton.on('InputSelect', bind(this, function () {
                                        this.nextButton.removeFromSuperview();
                                        this.powerTutorial();
                                    }));
                                }));
                            }));
                        }
                        colorIdx++;

                    }), 1500);
                }));
            }));
        }));
    };

    this.powerTutorial = function () {
        this.inputBuffer.removeFromSuperview();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new TextView(merge({
            superview: this,
            text: 'Your clipper has five power cells. When a sheep collides with it, it loses one cell.'
        }, textOpts));
        this._animate(text).then(bind(this, function () {
            var sheep = this._spawnSheep(constants.COLOR_WHITE, 576/2, true);
            sheep.on('sheep:collision', bind(this, function () {
                text = new TextView(merge({
                    superview: this,
                    text: 'Battery pickups appear occasionally and restore one power cell.'
                }, textOpts));
                this._animate(text).then(bind(this, function () {
                    var battery = new Battery({
                        superview: this,
                        x: 1024
                    });
                    battery.style.y = 576/2 - battery.style.height;
                    battery.run();
                    battery.on('battery:pickup', bind(this, function () {
                        this.addSubview(this.nextButton);
                        this.nextButton.on('InputSelect', bind(this, function () {
                            this.nextButton.removeFromSuperview();
                            this.ramTutorial();
                        }));
                    }));
                }));
            }));
        }));
    };

    this.ramTutorial = function () {
        this.sheep.length = 0;
        this._resetClipper();

        var text = new TextView(merge({
            superview: this,
            text: 'Your regular clipper blade shears ewes, but rams deflect those with their horns.'
        }, textOpts));
        this._animate(text).then(bind(this, function () {
            var ram = this._spawnSheep(constants.COLOR_WHITE, 576/2, true, true),
                showText = function () {
                    text = new TextView(merge({
                        superview: this,
                        text: 'Your clipper will require a diamond blade to shear rams.'
                    }, textOpts));
                    this.animate(text).then(bind(this, function () {
                        this.addSubview(this.nextButton);
                        this.nextButton.on('InputSelect', bind(this, function () {
                            this.nextButton.removeFromSuperview();
                            this.diamondTutorial();
                        }));
                    }));
                };

            ram.on('sheep:offscreen', bind(this, function () {
                bind(this, showText)();
            }));

            ram.on('sheep:collision', bind(this, function () {
                bind(this, showText)();
            }));
        }));
    };

    this.diamondTutorial = function () {
    };

    this._animate = function (view) {
        return animate(view).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000);
    };

    this.tryAgain = function (fn) {
        var i = this.sheep.length;
        while (i--) {
            this.removeSheep(this.sheep[i]);
        }
        if (this.interval) {
            clearInterval(this.interval);
        }

        var text = new TextView(merge({
            superview: this,
            text: 'Oops, try again',
            opacity: 0
        }, textOpts));
        animate(text).now({opacity: 1}, 500).wait(1500).then({opacity:0}).then(bind(this, fn));
    };

    this.removeSheep = function (sheep) {
        this.sheep.splice(this.sheep.indexOf(sheep), 1);
        sheep.removeFromSuperview();
    };

    this._resetClipper = function () {
        this.clipper.resetHealth();
        this.clipper.style.x = 0;
        this.clipper.style.y = 576/2 - this.clipper.style.height/2;
    };

    this._spawnSheep = function (color, y, allowCollision, isRam) {
        var sheep;
        if (isRam) {
            sheep = new Ram({
                x: 1024,
                color: color
            });
            console.log('made ram');
        } else {
            sheep = new Sheep({
                x: 1024,
                color: color
            });
        }
        sheep.startY = sheep.endY = sheep.style.y = y - sheep.style.width/2;
        console.log(sheep);
        this.addSubview(sheep);
        this.sheep.push(sheep);
        sheep.run();

        if (!allowCollision) {
            sheep.on('sheep:offscreen', bind(this, function () {
                this.tryAgain(this.eweTutorial);
            }));

            sheep.on('sheep:collision', bind(this, function () {
                this.tryAgain(this.eweTutorial);
            }));
        }
        return sheep;
    }
});
