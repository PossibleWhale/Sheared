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
        this.isTutorial = true;
        this.build();
    };

    this.build = function() {
        this.runner = new PlayTutorialRunner(this);

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
            x: 100
        });
        this.clipper.style.y = 576/2 - this.clipper.style.height/2;

        this.healthBar = new HealthBar({
            superview: this,
            x: 404,
            y: 518,
            health: 5
        });

        this.diamondIndicator = new ImageView({
            superview: this,
            visible: false,
            x: 159,
            y: 13,
            width: 54,
            height: 54,
            image: 'resources/images/diamond.png'
        });

        this.woolCounts = new WoolCounter({
            storage: new WoolStorage({persist: false}),
            superview: this,
            x: 300,
            y: 8,
        });

        this.inputBuffer = new InputBuffer({superview: this});
        this.nextButton = new Button({
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
            x: 8,
            y: 8,
            zIndex: 999999,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-return.png'
        });
        this.backButton.on('InputSelect', bind(this, function () {
            this.emit('tutorial:back');
        }));

        this.muteButton = new MuteButton({
            superview: this,
            x: 952,
            y: 8,
            zIndex: 99999,
            width: 64,
            height: 64
        });

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
        }));

        this.clipperTutorial();
    };

    this.clipperTutorial = function () {
        this.nextButton.removeAllListeners();
        var holdImage = new ImageView({
            superview: this,
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
        tryText = new ThoughtBubble({
            superview: this,
            text: 'Try it out.'
        }),
        activateNext = new Button({
            superview: this,
            x: 412,
            y: 256,
            zIndex: 99999,
            width: 200,
            height: 64,
            click: true
        }),
        animateTime = 500;

        this.inputBuffer.removeFromSuperview();

        _a = [
        bind(this, function () {
            var next = this.runner.waitPlain();
            activateNext.on('InputSelect', function () {
                activateNext.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', moveImage, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            activateNext.on('InputSelect', function () {
                activateNext.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', tapImage, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            activateNext.on('InputSelect', function () {
                activateNext.removeAllListeners();
                holdImage.removeFromSuperview();
                moveImage.removeFromSuperview();
                next();
            });
        }),
        _sx(['disappear', tapImage, {duration: animateTime}]),
        bind(this, function () { this.addSubview(this.inputBuffer); }),
        _sx(['appear', tryText, {duration: animateTime}]),
        _sx(['disappear', tryText, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(this.nextButton);
            this.nextButton.on('InputSelect', bind(this, function () {
                this.nextButton.removeFromSuperview();
                this.inputBuffer.removeFromSuperview();
                this.nextButton.removeAllListeners();
                next();
            }));
        }),
        bind(this, function () { this.overviewTutorial(); })
        ];
        this.runner.run(_a);
    };

    this.overviewTutorial = function () {
        this.nextButton.removeAllListeners();
        var overview1 = new ImageView({
            superview: this,
            opacity: 0,
            x: 0,
            y: 102,
            width: 1024,
            height: 292,
            image: 'resources/images/play-overview-01.png'
        }),
        overview2 = new ImageView({
            superview: this,
            opacity: 0,
            x: 0,
            y: 102,
            width: 1024,
            height: 292,
            image: 'resources/images/play-overview-02.png'
        }),
        overview3 = new ImageView({
            superview: this,
            opacity: 0,
            x: 0,
            y: 102,
            width: 1024,
            height: 292,
            image: 'resources/images/play-overview-03.png'
        }),
        animateTime = 500;

        this.nextButton.style.y = 410; 

        this.inputBuffer.removeFromSuperview();

        _a = [
        _sx(['appear', overview1, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(this.nextButton);
            this.nextButton.on('InputSelect', bind(this, function () {
                this.nextButton.removeAllListeners();
                this.nextButton.removeFromSuperview();
                next();
            }));
        }),
        _sx(['appear', overview2, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(this.nextButton);
            this.nextButton.on('InputSelect', bind(this, function () {
                this.nextButton.removeAllListeners();
                this.nextButton.removeFromSuperview();
                next();
            }));
        }),
        _sx(['appear', overview3, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(this.nextButton);
            this.nextButton.on('InputSelect', bind(this, function () {
                this.nextButton.removeAllListeners();
                this.emit('tutorial:end');
            }));
        })
        ];
        this.runner.run(_a);
    };
});
