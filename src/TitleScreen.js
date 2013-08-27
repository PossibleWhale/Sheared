/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.ImageView as ImageView;
import animate;

import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.CreditsScreen as CreditsScreen;
import src.TutorialSelectScreen as TutorialSelectScreen;
import src.StoreScreen as StoreScreen;
import src.StatScreen as StatScreen;
import src.AwardScreen as AwardScreen;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.adtimer as adtimer;
import src.AwardAlert as AwardAlert;
import src.constants as constants;


/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */
exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/title.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.back = function _a_back() {
        if (this.stackView.getCurrentView() === this) {
            return false;
        } else {
            this.stackView.pop();
        }
    };

    this.build = function() {
        var pbOpts, playButton, cbOpts, craftScreen,
            playScreen, modeScreen, stackView, creditsScreen,
            credOpts, tutorialScreen, storeScreen, statScreen, awardsScreen;

        craftScreen = new CraftScreen();
        creditsScreen = new CreditsScreen();
        tutorialScreen = new TutorialSelectScreen();
        playScreen = new PlayScreen();
        storeScreen = new StoreScreen();
        statScreen = new StatScreen();
        awardsScreen = new AwardScreen();

        stackView = this.stackView = this.getSuperview();

        this.giantClipper = new ImageView({
            superview: this,
            x: -545,
            y: 133,
            width: 545,
            height: 210,
            image: 'resources/images/clipper-title.png'
        });

        this.shearedLogo = new ImageView({
            superview: this,
            x: 87,
            y: 133,
            width: 850,
            height: 210,
            opacity: 0,
            image: 'resources/images/sheared.png'
        });

        this.marqueeTop = new ImageView({
            superview: this,
            x: 0,
            y: -80,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        });

        this.marqueeBottom = new ImageView({
            superview: this,
            x: 0,
            y: 576,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        });

        this.exitButton = new ImageView({
            superview: this.marqueeTop,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-exit.png'
        });
        this.exitButton.on('InputSelect', bind(this, function () {
            this.back();
        }));

        this.websiteButton = new ImageView({
            superview: this.marqueeBottom,
            x: 944,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-website.png'
        });
        this.websiteButton.on('InputSelect', function () {
            window.open('http://possiblewhale.com');
        });

        this.statsButton = new ImageView({
            superview: this.marqueeBottom,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-stats.png'
        });
        this.statsButton.on('InputSelect', function () {
            _goToView(statScreen);
        });

        this.awardsButton = new ImageView({
            superview: this.marqueeBottom,
            x: 216,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-awards.png'
        });
        this.awardsButton.on('InputSelect', function () {
            _goToView(awardsScreen);
        });

        this.storeButton = new ImageView({
            superview: this.marqueeBottom,
            x: 412,
            y: 0,
            width: 200,
            height: 80,
            image: 'resources/images/button-general-store.png'
        });
        this.storeButton.on('InputSelect', function () {
            _goToView(storeScreen);
        });

        this.creditsButton = new ImageView({
            superview: this.marqueeBottom,
            x: 728,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-credits.png'
        });
        this.creditsButton.on('InputSelect', function () {
            _goToView(creditsScreen);
        });

        this.playButton = new ImageView({
            superview: this,
            x: 435,
            y: 346,
            width: 154,
            height: 82,
            anchorX: 154/2,
            anchorY: 82/2,
            opacity: 0,
            image: 'resources/images/button-play.png'
        });
        this.playButton.on('InputSelect', function () {
            _goToView(playScreen);
        });

        this.tutorialButton = new ImageView({
            superview: this,
            x: 407,
            y: 439,
            width: 210,
            height: 36,
            opacity: 0,
            image: 'resources/images/button-tutorials.png'
        });
        this.tutorialButton.on('InputSelect', function () {
            _goToView(tutorialScreen);
        });

        GC.app.engine.on('Tick', bind(this, function (dt) {
            var ticker, tut;

            if (playScreen.clipper) {
                playScreen.clipper.emitDiamonds();
            }

            tut = tutorialScreen.tutorialScreen;
            if (tut && tut.runTick) {
                tut.runTick();
                if (tut.clipper) {
                    tut.clipper.emitDiamonds();
                }
            }
            if (GC.app.particleEngine) {
                GC.app.particleEngine.runTick(dt);
            }
            playScreen.runTick();

            this.emitWool();
        }));

        muteOpts = {
            superview: this.marqueeTop,
            x: 944,
            y: 0,
            width: 80,
            height: 80
        };
        this.muteButton = new MuteButton(muteOpts);

        tutorialScreen.on('tutorial:back', bind(this, this.back));
        storeScreen.on('store:back', bind(this, this.back));
        craftScreen.on('craft:back', bind(this, this.back));
        creditsScreen.on('credits:back', bind(this, this.back));
        statScreen.on('stats:back', bind(this, this.back));
        awardsScreen.on('awards:back', bind(this, this.back));

        craftScreen.on('craft:store', function () {
            _goToView(storeScreen);
        });

        // checks to see whether toView is in the stackView.
        function _goToView(toView) {
            var stack = stackView.getStack(), i = stack.length;
            if (stackView.hasView(toView)) {
                while (i--) {
                    if (toView === stack[i]) {
                        toView.emit('ViewWillAppear');
                        break;
                    } else {
                        stackView.pop();
                    }
                }
            } else {
                stackView.push(toView);
            }
        }

        function _startCrafting() {
            adtimer.interrupt(function () {
                _goToView(craftScreen);
                craftScreen.emit('craft:start');
            });
        };

        storeScreen.on('store:craft', bind(this, function () {
            _startCrafting();
        }));

        this.on('playscreen:craft', bind(this, function () {
            _startCrafting();
        }));

        this.on('playscreen:store', bind(this, function () {
            _goToView(storeScreen);
        }));

        this.on('playscreen:home', bind(this, function () {
            this.back();
        }));

        playScreen.on('playscreen:gameover', function () {
            storeScreen.updateProgressBars();
            storeScreen.updatePriceDisplays();
        });

        GC.app.player.on('player:purchased', function () {
            GC.app.player.setUpgrades();
        });

        GC.app.player.on('player:purchasedPower', function () {
            playScreen.healthBar.maxHealth = GC.app.player.maxClipperHealth;
            playScreen.healthBar.health++;
            playScreen.healthBar.updateImage();
        });

        GC.app.player.on('player:earnedAward', bind(this, function (award) {
            var awardAlert = new AwardAlert({
                superview: this.stackView.getCurrentView(),
                award: award
            });
            awardAlert.show();
        }));

        this.on('playscreen:restart', bind(this, function () {
            this.stackView.remove(playScreen);
            delete playScreen;
            playScreen = new PlayScreen();
            this.stackView.push(playScreen);
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted(undefined, {silent: true});
        }));
    };

    this.animateIntro = function () {
        animate(this.giantClipper).now({x: 1024}, 750, animate.easeOut).then(this.giantClipper.removeFromSuperview);
        animate(this.shearedLogo).now({opacity: 1}, 750).then(bind(this, function () {
            animate(this.marqueeTop).now({y: 0}, 250, animate.easeOut);
            animate(this.marqueeBottom).now({y: 496}, 250, animate.easeOut).then(bind(this, function () {
                animate(this.playButton).now({opacity: 1}, 250).then(bind(this, function () {
                    var animateButton = function () {
                        animate(this.playButton).clear().now({r: Math.PI/64, scale: 1.1}, 1500, animate.easeIn)
                        .then({r: -1*Math.PI/64, scale: 1}, 1500, animate.easeOut)
                        .then(animateButton.bind(this));
                    };
                    bind(this, animateButton)();
                }));
                animate(this.tutorialButton).now({opacity: 1}, 250);
            }));
        }));
    };

    this.emitWool = function () {
        if (this.giantClipper.style.x + this.giantClipper.style.width <= 0 || this.giantClipper.style.x >= 1024) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(3), i;
        for (i = 0; i < particleObjects.length; i++) {
            var pObj = particleObjects[i];
            pObj.x = this.giantClipper.style.x + this.giantClipper.style.width;
            pObj.y = this.giantClipper.style.y + this.giantClipper.style.height/2;
            pObj.dx = Math.random() * 100;
            pObj.dy = Math.random() * 200;
            if (Math.random() > 0.5) {
                pObj.dy *= -1;
            }
            pObj.dr = Math.random() * Math.PI/2;
            pObj.width = 60;
            pObj.height = 60;
            pObj.scale = Math.random() + 0.5;
            pObj.dscale = 0.5;
            pObj.opacity = 1;
            pObj.dopacity = -1;
            pObj.image = 'resources/images/particle-' + constants.colors[0].label +'.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };
});
