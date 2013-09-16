import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.ViewPool as ViewPool;
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
import src.WoolStorage as WoolStorage;
import src.MuteButton as MuteButton;
import src.ThoughtBubble as ThoughtBubble;
import src.Runner as Runner;

var _sx = function _a_sx(arr) {
    return {
        method: arr[0],
        factory: arr[1],
        methodArgs: arr[2],
        factoryArgs: arr[3]
    };
};

var PlayTutorialRunner = Class(Runner, function (supr) {
    // handle the continue click by hiding the button
    this.animation_ok = function _a_animation_ok(animation, _) {
        return animation.then({opacity: 1.0}, 600, animate.linear);
    };

    // create the 'Continue >' button
    this.factory_ok = function _a_factory_ok(obj) {
        var next = this.context.nextButton;
        next.removeAllListeners();
        next.on('InputSelect', bind(this, function () {
            next.updateOpts({opacity: 0.0});
        }));
        next.on('InputSelect', this.waitPlain());
        return next;
    };

    // fade in, and then fade out text in a thought bubble
    this.factory_thought = function _a_factory_thought(fargs) {
        return new ThoughtBubble({superview: this.context, text: fargs.text});
    };
});

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        this.runner = new PlayTutorialRunner(this);

        this.isTutorial = true;

        // header background
        this.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        }));

        // footer background
        this.addSubview(new ImageView({
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        }));

        // grass background
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/background-grass.png'
        }));

        this.clipper = new Clipper({
            superview: this,
            x: 0
        });
        this.clipper.style.y = 576/2 - this.clipper.style.height/2;

        this.healthBar = new HealthBar({
            superview: this,
            x: 404,
            y: 518,
            health: 5
        });

        this.woolCounts = new WoolCounter({
            storage: new WoolStorage({persist: false}),
            superview: this,
            x: 283,
            y: 0,
        });

        this.inputBuffer = new InputBuffer({superview: this});
        this.nextButton = new Button({
            superview: this,
            opacity: 0,
            x: 412,
            y: 344,
            zIndex: 99999,
            width: 200,
            height: 64,
            click: true,
            image: 'resources/images/button-continue.png'
        });
        this.sheep = [];

        this.backButton = new Button({
            superview: this,
            x: 0,
            y: 0,
            zIndex: 9999,
            width: 80,
            height: 80,
            click: true,
            image: 'resources/images/button-return.png'
        });
        this.backButton.on('InputSelect', function () {
            GC.app.titleScreen.back();
        });

        var muteButton = new MuteButton({
            superview: this,
            x: 944,
            y: 0,
            zIndex: 9999,
            width: 80,
            height: 80
        });

        this.sheepPool = new ViewPool({
            ctor: Sheep,
            initCount: 5,
            initOpts: {
                superview: this,
                fromTutorial: true
            }
        });
        this.ramPool = new ViewPool({
            ctor: Ram,
            initCount: 5,
            initOpts: {
                superview: this,
                fromTutorial: true
            }
        });
    };

    this.clipperTutorial = function () {
        this.nextButton.removeAllListeners();
        var holdImage = new ImageView({
            superview: this,
            opacity: 0,
            image: 'resources/images/tutorial-gesture-holding.png',
            autoSize: true
        }),
        moveImage = new ImageView({
            superview: this,
            opacity: 0,
            image: 'resources/images/tutorial-gesture-moving.png',
            autoSize: true
        }),
        tapImage = new ImageView({
            superview: this,
            opacity: 0,
            image: 'resources/images/tutorial-gesture-shearing.png',
            autoSize: true
        }),
        holdText = new ThoughtBubble({
            superview: this,
            text: 'Hold the device as shown.'
        }),
        moveText = new ThoughtBubble({
            superview: this,
            text: 'Drag on the left side of the screen to move the clipper.',
        }),
        tapText = new ThoughtBubble({
            superview: this,
            text: 'Tap on the right side of the screen to fire a blade.'
        }),
        tryText = new ThoughtBubble({
            superview: this,
            text: 'Try it out.'
        });

        this.inputBuffer.removeFromSuperview();

        _a = [
        function () {
            animate(holdImage).now({opacity: 1}, 1500).wait(5500).wait(3000).then({opacity: 0}, 0);
        },
        bind(this, function () {
            animate(holdText).wait(3000).then({opacity: 1}, 1000).wait(1500).then({opacity: 0}, 1000).wait(2000).then(this.runner.waitPlain());
        }),
        function () {
            animate(moveImage).now({opacity: 1}, 1500).wait(5500).then({opacity: 0}, 1500);
        },
        bind(this, function () {
            animate(moveText).wait(3000).then({opacity: 1}, 1000).wait(1500).then({opacity: 0}, 1000).wait(2000).then(this.runner.waitPlain());
        }),
        bind(this, function () { this.addSubview(this.inputBuffer); }),
        _sx(['appear', tryText, {duration: 1500}]),
        _sx(['disappear', tryText, {duration: 1500}]),
        bind(this, function () { animate(this.nextButton).wait(1500); }),
        _sx(['appear', this.nextButton, {duration: 500}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.nextButton.on('InputSelect', bind(this, function () {
                this.nextButton.style.opacity = 0;
                this.inputBuffer.removeFromSuperview();
                next();
            }));
        }),
        function () {
            animate(tapImage).now({opacity: 1}, 1500).wait(5500).then({opacity: 0}, 1500);
        },
        bind(this, function () {
            animate(tapText).wait(3000).then({opacity: 1}, 1000).wait(1500).then({opacity: 0}, 1000).wait(2000).then(this.runner.waitPlain());
        }),
        bind(this, function () { this.addSubview(this.inputBuffer); }),
        _sx(['appear', tryText, {duration: 1500}]),
        _sx(['disappear', tryText, {duration: 1500}]),
        bind(this, function () { animate(this.nextButton).wait(1500); }),
        _sx(['appear', this.nextButton, {duration: 500}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.nextButton.on('InputSelect', bind(this, function () {
                this.nextButton.style.opacity = 0;
                this.eweTutorial();
            }));
        })
        ];

        this.runner.run(_a);
    };

    this.eweTutorial = function () {
        this.addSubview(this.inputBuffer);
        this.nextButton.removeAllListeners();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new ThoughtBubble({
            superview: this,
            text: 'Your regular clipper blade shears ewes.',
        }),
        hintText = new ThoughtBubble({
            superview: this,
            text: 'Try to shear the ewe.'
        });
        this._animate(text).then(bind(this, function () {
            this._animate(hintText).then(bind(this, function () {
            var sheep = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.eweTutorial);

            sheep.on('sheep:sheared', bind(this, function() {
                text = new ThoughtBubble({
                    superview: this,
                    text: 'Each ewe sheared gives you one bolt of wool.',
                });
                this._animate(text).then(bind(this, function () {
                    var colorIdx = 1; // start with the second color because we already sent out white
                    this.interval = setInterval(bind(this, function () {
                        if (colorIdx >= 4) {
                            clearInterval(this.interval);
                        }

                        var sheep = this._spawnSheep(constants.colors[colorIdx], 576/2, this.eweTutorial);
                        if (colorIdx === 4) {
                            sheep.on('sheep:sheared', bind(this, function () {
                                text = new ThoughtBubble({
                                    superview: this,
                                    text: 'Ewes appear in five colors. Each ewe gives one bolt of that color.'
                                });
                                this._animate(text).then(bind(this, function () {
                                    this.nextButton.style.opacity = 1;
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
        }));
    };

    this.powerTutorial = function () {
        this.nextButton.removeAllListeners();
        this.inputBuffer.removeFromSuperview();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new ThoughtBubble({
            superview: this,
            text: 'Your clipper has five power cells. When a sheep collides with it, it loses one cell.'
        }),
        hintText = new ThoughtBubble({
            superview: this,
            text: 'Watch now.'
        });
        this._animate(text).then(bind(this, function () {
            this._animate(hintText).then(bind(this, function () {
            var sheep = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.powerTutorial, true);
            sheep.on('sheep:collision', bind(this, function () {
                text = new ThoughtBubble({
                    superview: this,
                    text: 'Battery pickups appear occasionally and restore one power cell.'
                });
                this._animate(text).then(bind(this, function () {
                    this.battery = new Battery({
                        superview: this,
                        x: 1024
                    });
                    this.battery.style.y = 576/2 - this.battery.style.height/2;
                    this.battery.run();
                    this.battery.on('battery:pickup', bind(this, function () {
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
        }));
    };

    this.ramTutorial = function () {
        this.nextButton.removeAllListeners();
        this.sheep.length = 0;
        this._resetClipper();

        var text = new ThoughtBubble({
            superview: this,
            text: 'Your regular clipper blade shears ewes, but rams deflect those with their horns.'
        }),
        hintText = new ThoughtBubble({
            superview: this,
            text: 'Try to shear the ram.'
        });
        this._animate(text).then(bind(this, function () {
            this._animate(hintText).then(bind(this, function () {
            var ram = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.ramTutorial, true, true),
                showText = function () {
                    text = new ThoughtBubble({
                        superview: this,
                        text: 'Your clipper will require a diamond blade to shear rams.'
                    });
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
                ram.removeAllListeners();
            }));

            ram.on('sheep:collision', bind(this, function () {
                bind(this, showText)();
                ram.removeAllListeners();
            }));
        }));
        }));
    };

    this.diamondTutorial = function () {
        var text;
        this.nextButton.removeAllListeners();
        this.sheep.length = 0;
        this._resetClipper();

        this.diamond = new Diamond({
            superview: this,
            x: 1024
        });
        this.diamond.style.y = 576/2 - this.diamond.style.height/2;
        this.diamond.infinite = true;
        this.diamond.run();
        this.diamond.on('pickup:offscreen', bind(this, function () {
            this.tryAgain(this.diamondTutorial);
        }));
        this.diamond.on('diamond:pickup', bind(this, function () {
            text = new ThoughtBubble({
                superview: this,
                text: 'Your clipper is equipped with diamond blades for five seconds. Notice the glitter effect.'
            });
            this._animate(text).then(bind(this, function () {
                var ram = this._spawnSheep(constants.COLOR_WHITE, 576/2, this.diamondTutorial, false, true);
                ram.on('sheep:sheared', bind(this, function () {
                    text = new ThoughtBubble({
                        superview: this,
                        text: 'Each ram sheared gives you five bolts of wool.'
                    });
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
                                    text = new ThoughtBubble({
                                        superview: this,
                                        text: 'Rams appear in five colors. Each ram gives five bolts of that color.'
                                    });
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
            this.sheep[i].die();
        }

        var text = new ThoughtBubble({
            superview: this,
            text: 'Oops, try again',
            opacity: 0
        });
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
            sheep = this.ramPool.obtainView();
            sheep.color = color;
            sheep.setImage(color.ramImage);
        } else {
            sheep = this.sheepPool.obtainView()
            sheep.color = color;
            sheep.setImage(color.eweImage);
        }
        sheep.startY = sheep.endY = sheep.style.y = y - sheep.style.height/2;
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
        if (this !== GC.app.titleScreen.stackView.getCurrentView()) {
            return;
        }
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
