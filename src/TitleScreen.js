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
import src.AwardsScreen as AwardsScreen;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.adtimer as adtimer;


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
        this.stackView.pop();
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
        awardsScreen = new AwardsScreen();

        stackView = this.stackView = this.getSuperview();

        // TODO animate the logo in some cutesy way
        this.shearedLogo = new ImageView({
            superview: this,
            x: 87,
            y: 133,
            width: 850,
            height: 210,
            image: 'resources/images/sheared.png'
        });

        var marqueeTop = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/marquee-top.png'
        });

        var marqueeBottom = new ImageView({
            superview: this,
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/marquee-bottom.png'
        });

        var exitButton = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-exit.png'
        });
        exitButton.on('InputSelect', function () {
            // TODO
            console.log('exit app');
        });

        var websiteButton = new ImageView({
            superview: this,
            x: 944,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-website.png'
        });
        websiteButton.on('InputSelect', function () {
            // TODO
            console.log('go to website');
        });

        var statsButton = new ImageView({
            superview: this,
            x: 0,
            y: 496,
            width: 80,
            height: 80,
            image: 'resources/images/button-stats.png'
        });
        statsButton.on('InputSelect', function () {
            _goToView(statScreen);
        });

        var awardsButton = new ImageView({
            superview: this,
            x: 216,
            y: 496,
            width: 80,
            height: 80,
            image: 'resources/images/button-awards.png'
        });
        awardsButton.on('InputSelect', function () {
            _goToView(awardsScreen);
        });

        var storeButton = new ImageView({
            superview: this,
            x: 412,
            y: 496,
            width: 200,
            height: 80,
            image: 'resources/images/button-general-store.png'
        });
        storeButton.on('InputSelect', function () {
            _goToView(storeScreen);
        });

        var creditsButton = new ImageView({
            superview: this,
            x: 728,
            y: 496,
            width: 80,
            height: 80,
            image: 'resources/images/button-credits.png'
        });
        creditsButton.on('InputSelect', function () {
            _goToView(creditsScreen);
        });

        var playButton = new ImageView({
            superview: this,
            x: 435,
            y: 346,
            width: 154,
            height: 82,
            anchorX: 154/2,
            anchorY: 82/2,
            image: 'resources/images/button-play.png'
        });
        playButton.on('InputSelect', function () {
            _goToView(playScreen);
        });
        var animateButton = function () {
            animate(playButton).clear().now({r: Math.PI/64, scale: 1.1}, 1500, animate.easeIn)
            .then({r: -1*Math.PI/64, scale: 1}, 1500, animate.easeOut)
            .then(animateButton.bind(this));
        };
        animateButton();

        var tutorialButton = new ImageView({
            superview: this,
            x: 412,
            y: 457,
            width: 210,
            height: 36,
            image: 'resources/images/button-instructions.png'
        });
        tutorialButton.on('InputSelect', function () {
            tutorialScreen.build();
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
        }));

        muteOpts = {
            superview: this,
            x: 944,
            y: 496,
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

        playScreen.on('playscreen:craft', bind(this, function () {
            _startCrafting();
        }));

        playScreen.on('playscreen:store', bind(this, function () {
            _goToView(storeScreen);
        }));

        playScreen.on('playscreen:home', bind(this, function () {
            this.back();
        }));

        playScreen.on('playscreen:gameover', function () {
            storeScreen.updateProgressBars();
            storeScreen.updatePriceDisplays();
        });

        GC.app.player.on('player:purchased', function () {
            GC.app.player.setUpgrades();
        });

        /* When the game screen has signalled that the game is over,
         * reset the play screen so we can play again
         */
        this.on('playscreen:end', bind(this, function () {
            delete playScreen;
            playScreen = new PlayScreen();
            _startCrafting();
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted(false, {silent: true});
        }));
    };
});
