import animate;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.Clipper as Clipper;
import src.HealthBar as HealthBar;
import src.constants as constants;
import src.Button as Button;
import src.InputBuffer as InputBuffer;
import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Battery as Battery;
import src.Diamond as Diamond;
import src.WoolCounter as WoolCounter;

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
            x: 0
        });
        this.clipper.style.y = 576/2 - this.clipper.style.width/2;

        this.healthBar = new HealthBar({
            superview: this,
            x: 387,
            y: 576-80,
        });

        this.woolCounts = new WoolCounter({
            superview: this,
            persist: false,
            x: 367,
            y: 52
        });

        this.inputBuffer = new InputBuffer({superview: this});
        this.nextButton = new Button({
            x: 1024 - 160,
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

        var backButton = new Button({
            superview: this,
            x: 0,
            y: 0,
            backgroundColor: '#FF00FF',
            color: '#000000',
            fontFamily: 'delius',
            text: 'Back',
            width: 140,
            height: 60,
            size: 128,
            autoFontSize: true,
            zIndex: 999
        });
        backButton.on('InputSelect', bind(this, function () {
            this.getSuperview().pop();
        }));
    };

    this.clipperTutorial = function () {
        this.nextButton.removeAllListeners();
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
        this.nextButton.removeAllListeners();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new TextView(merge({
            superview: this,
            text: 'Your regular clipper blade shears ewes.',
        }, textOpts));
        animate(text).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {
            var sheep = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.eweTutorial);

            sheep.on('sheep:sheared', bind(this, function() {
                text = new TextView(merge({
                    superview: this,
                    text: 'Each ewe sheared gives you one bolt of wool.',
                }, textOpts));
                this._animate(text).then(bind(this, function () {
                    var colorIdx = 1; // start with the second color because we already sent out white
                    this.interval = setInterval(bind(this, function () {
                        if (colorIdx >= 4) {
                            clearInterval(this.interval);
                        }

                        var sheep = this._spawnSheep(constants.colors[colorIdx], 576/2, this.eweTutorial);
                        if (colorIdx === 4) {
                            sheep.on('sheep:sheared', bind(this, function () {
                                text = new TextView(merge({
                                    superview: this,
                                    text: 'Ewes appear in five colors. Each ewe gives one bolt of that color.'
                                }, textOpts));
                                this._animate(text).then(bind(this, function () {
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
        this.nextButton.removeAllListeners();
        this.inputBuffer.removeFromSuperview();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new TextView(merge({
            superview: this,
            text: 'Your clipper has five power cells. When a sheep collides with it, it loses one cell.'
        }, textOpts));
        this._animate(text).then(bind(this, function () {
            var sheep = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.powerTutorial, true);
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
                    battery.style.y = 576/2 - battery.style.height/2;
                    battery.run();
                    battery.on('battery:pickup', bind(this, function () {
                        this.addSubview(this.nextButton);
                        this.nextButton.on('InputSelect', bind(this, function () {
                            this.nextButton.removeFromSuperview();
                            this.addSubview(this.inputBuffer);
                            this.ramTutorial();
                        }));
                    }));
                }));
            }));
        }));
    };

    this.ramTutorial = function () {
        this.nextButton.removeAllListeners();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new TextView(merge({
            superview: this,
            text: 'Your regular clipper blade shears ewes, but rams deflect those with their horns.'
        }, textOpts));
        this._animate(text).then(bind(this, function () {
            var ram = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.ramTutorial, true, true),
                showText = function () {
                    text = new TextView(merge({
                        superview: this,
                        text: 'Your clipper will require a diamond blade to shear rams.'
                    }, textOpts));
                    this._animate(text).then(bind(this, function () {
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
        this.nextButton.removeAllListeners();
        this.sheep.length = 0;
        this._resetClipper();

        var diamond = new Diamond({
            superview: this,
            x: 1024
        }), text;
        diamond.style.y = 576/2 - diamond.style.height/2;
        diamond.infinite = true;
        diamond.run();
        diamond.on('pickup:offscreen', bind(this, function () {
            this.tryAgain(this.diamondTutorial);
        }));
        diamond.on('diamond:pickup', bind(this, function () {
            text = new TextView(merge({
                superview: this,
                text: 'Your clipper is equipped with diamond blades for five seconds. Notice the glitter effect.'
            }, textOpts));
            this._animate(text).then(bind(this, function () {
                var ram = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.diamondTutorial, false, true);
                ram.on('sheep:sheared', bind(this, function () {
                    text = new TextView(merge({
                        superview: this,
                        text: 'Each ram sheared gives you five bolts of wool.'
                    }, textOpts));
                    this._animate(text).then(bind(this, function () {
                        var colorIdx = 1; // start with the second color because we already sent out white
                        this.interval = setInterval(bind(this, function () {
                            if (colorIdx >= 4) {
                                clearInterval(this.interval);
                            }

                            ram = this._spawnSheep(constants.colors[colorIdx], 576/2, this.diamondTutorial, false, true);
                            if (colorIdx === 4) {
                                ram.on('sheep:sheared', bind(this, function () {
                                    this.clipper.becomeRegular();
                                    text = new TextView(merge({
                                        superview: this,
                                        text: 'Rams appear in five colors. Each ram gives five bolts of that color.'
                                    }, textOpts));
                                    this._animate(text).then(bind(this, function () {
                                        this.addSubview(this.nextButton);
                                        this.nextButton.on('InputSelect', bind(this, function () {
                                            this.getSuperview().pop();
                                        }));
                                    }));
                                }));
                            }
                            colorIdx++;

                        }), 1500);
                    }));
                }));
            }));
        }));
    };

    this._animate = function (view) {
        return animate(view).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000);
    };

    this.tryAgain = function (fn) {
        if (this.interval) {
            clearInterval(this.interval);
        }
        var i = this.sheep.length;
        while (i--) {
            this.removeSheep(this.sheep[i]);
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
        this.healthBar.resetHealth();
        this.clipper.becomeRegular();
        this.clipper.style.x = 0;
        this.clipper.style.y = 576/2 - this.clipper.style.height/2;
    };

    this._spawnSheep = function (color, y, fn, allowCollision, isRam) {
        var sheep;
        if (isRam) {
            sheep = new Ram({
                x: 1024,
                color: color
            });
        } else {
            sheep = new Sheep({
                x: 1024,
                color: color
            });
        }
        sheep.startY = sheep.endY = sheep.style.y = y - sheep.style.width/2;
        this.addSubview(sheep);
        this.sheep.push(sheep);
        sheep.run();

        if (!allowCollision) {
            sheep.on('sheep:offscreen', bind(this, function () {
                this.tryAgain(fn);
            }));

            sheep.on('sheep:collision', bind(this, function () {
                this.tryAgain(fn);
            }));
        }
        return sheep;
    };

    this.runTick = function () {
        var i = this.sheep.length;
        while (i--) {
            this.sheep[i].onTick();
        }
        if (this.battery) {
            this.battery.onTick();
        }
        if (this.diamond) {
            this.diamond.onTick();
        }
    };
});
