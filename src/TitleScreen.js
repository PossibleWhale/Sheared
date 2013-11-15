/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.ImageView as ImageView;
import device;
import animate;

import plugins.backbutton.backbutton as backbutton;

import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.CreditsScreen as CreditsScreen;
import src.TutorialPlayScreen as TutorialPlayScreen;
import src.TutorialCraftScreen as TutorialCraftScreen;
import src.StoreScreen as StoreScreen;
import src.StatScreen as StatScreen;
import src.AwardScreen as AwardScreen;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.adtimer as adtimer;
import src.AwardAlert as AwardAlert;
import src.constants as c;
import src.spinner as spinner;


/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */
exports = Class(ui.View, function (supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);

        this.build();
    };

    /*
     * pop the stackview stack, unless we are on the title screen already
     */
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
            credOpts, tutorialScreen, tutorialCraftScreen, storeScreen, statScreen, awardsScreen;

        craftScreen = new CraftScreen();
        creditsScreen = new CreditsScreen();
        tutorialScreen = new TutorialPlayScreen();
        tutorialCraftScreen = new TutorialCraftScreen();
        playScreen = new PlayScreen();
        storeScreen = new StoreScreen();
        statScreen = new StatScreen();
        awardsScreen = new AwardScreen();

        stackView = this.stackView = this.getSuperview();

        this.giantClipper = new ImageView({
            superview: this,
            x: -535,
            y: 149,
            width:  535,
            height: 190,
            image: 'resources/images/clipper-title.png'
        });

        this.shearedLogo = new ImageView({
            superview: this,
            x: 92,
            y: 146,
            width:  816,
            height: 190,
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

        if (backbutton) {
            this.exitButton = new Button({
                superview: this.marqueeTop,
                x: 8,
                y: 8,
                width: 64,
                height: 64,
                click: true,
                image: 'resources/images/button-exit.png'
            });
            this.exitButton.on('InputSelect', bind(this, function () {
                backbutton.back();
            }));
        }

        this.websiteButton = new Button({
            superview: this.marqueeBottom,
            x: 952,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-website.png'
        });
        this.websiteButton.on('InputSelect', function () {
            window.open('http://possiblewhale.com');
        });

        this.statsButton = new Button({
            superview: this.marqueeBottom,
            x: 8,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-stats.png'
        });
        this.statsButton.on('InputSelect', function () {
            _goToView(statScreen);
        });

        this.awardsButton = new Button({
            superview: this.marqueeBottom,
            x: 224,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-awards.png'
        });
        this.awardsButton.on('InputSelect', function () {
            _goToView(awardsScreen);
        });

        this.storeButton = new Button({
            superview: this.marqueeBottom,
            x: 420,
            y: 10,
            width: 184,
            height: 60,
            click: true,
            image: 'resources/images/button-general-store.png'
        });
        this.storeButton.on('InputSelect', function () {
            _goToView(storeScreen);
        });

        this.creditsButton = new Button({
            superview: this.marqueeBottom,
            x: 736,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-credits.png'
        });
        this.creditsButton.on('InputSelect', function () {
            _goToView(creditsScreen);
        });

        this.playButton = new Button({
            superview: this,
            x: 400,
            y: 366,
            width: 234,
            height: 64,
            anchorX: 234/2,
            anchorY: 64/2,
            opacity: 0,
            click: true,
            image: 'resources/images/button-play.png'
        });
        this.playButton.on('InputSelect', function () {
            if (!GC.app.player.stats.get('seen.playTutorial').value) {
                _goToView(tutorialScreen);
            } else {
                _goToView(playScreen);
            }
        });

        tutorialScreen.on('tutorial:end', function () { 
            GC.app.player.stats.setSeen('playTutorial', true);
            _goToView(playScreen);
        });

        GC.app.engine.on('Tick', bind(this, function (dt) {
            if (playScreen.clipper && playScreen.clipper.style.visible && playScreen.clipper.isDiamond) {
                playScreen.clipper.emitDiamonds();
            }

            if (GC.app.particleEngine) {
                GC.app.particleEngine.runTick(dt);
            }
            playScreen.runTick();

            this.emitWool();
        }));

        muteOpts = {
            superview: this.marqueeTop,
            x: 952,
            y: 8,
            width: 64,
            height: 64
        };
        this.muteButton = new MuteButton(muteOpts);

        tutorialScreen.on('tutorial:back', bind(this, this.back));
        storeScreen.on('store:back', bind(this, this.back));
        craftScreen.on('craft:back', bind(this, this.back));
        creditsScreen.on('credits:back', bind(this, this.back));
        statScreen.on('stats:back', bind(this, this.back));
        awardsScreen.on('awards:back', bind(this, this.back));

        // kinda dumb but basically this just makes it so the craft tutorial
        // doesn't screw up if you leave it and then come back.
        var backEvent = bind(this, function () {
            tutorialCraftScreen.on('craft:back', bind(this, function () {
                this.back();
                tutorialCraftScreen = new TutorialCraftScreen();
                bind(this, backEvent)();
            }));
        });
        backEvent();

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
                GC.app.audio.stopMusic();
                GC.app.startSpinner(c.SPIN_DELAY);
                stackView.push(toView);
                toView.once('ViewDidAppear', bind(this, function _a_viewAppearedFromTitleScreen() {
                    GC.app.stopSpinner();
                }));
            }
        }

        function _startCrafting() {
            adtimer.interrupt(function () {
                if (!GC.app.player.stats.get('seen.craftTutorial').value) {
                    _goToView(tutorialCraftScreen);
                    tutorialCraftScreen.tutor();
                    tutorialCraftScreen.on('tutorial:end', function () { 
                        GC.app.player.stats.setSeen('craftTutorial', true);
                        GC.app.titleScreen.back();
                        _goToView(craftScreen);
                        craftScreen.emit('craft:start');
                    });
                } else {
                    _goToView(craftScreen);
                    craftScreen.emit('craft:start');
                }
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
            _goToView(this);
        }));

        GC.app.player.on('player:purchased', function () {
            GC.app.player.setUpgrades();
        });

        GC.app.player.on('player:purchasedPower', function () {
            playScreen.healthBar.maxHealth = GC.app.player.maxClipperHealth;
            playScreen.healthBar.health = playScreen.healthBar.maxHealth;
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
            this.muteButton.setMuted(undefined, undefined, {silent: true});
            GC.app.audio.playTitle();
        }));

        this.once('ViewDidAppear', bind(this, function () {
            this.animateIntro();
        }));
    };

    this.animateIntro = function () {
        animate(this.giantClipper).wait(500).then({x: 1024}, 750, animate.easeOut).then(bind(this, function () {
            this.giantClipper.removeFromSuperview();
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
                }));
            }));
        }));
    };

    this.emitWool = function () {
        if (this.giantClipper.style.x + this.giantClipper.style.width <= 0 || this.giantClipper.style.x >= 1024) {
            return;
        }

        var particleObjects = GC.app.particleEngine.obtainParticleArray(3), i, pObj;
        for (i = 0; i < particleObjects.length; i++) {
            pObj = particleObjects[i];
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
            pObj.image = 'resources/images/particle-' + c.colors[0].label +'.png';
        }
        GC.app.particleEngine.emitParticles(particleObjects);
    };
});
