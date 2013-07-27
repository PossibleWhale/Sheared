/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.ImageView as ImageView;

import src.CraftScreen as CraftScreen;
import src.PlayScreen as PlayScreen;
import src.CreditsScreen as CreditsScreen;
import src.TutorialSelectScreen as TutorialSelectScreen;
import src.StoreScreen as StoreScreen;
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

    this.build = function() {
        var pbOpts, playButton, cbOpts, craftButton, craftScreen,
            playScreen, modeScreen, stackView, creditsScreen, credOpts, tutorialScreen, storeScreen;

        craftScreen = new CraftScreen();
        creditsScreen = new CreditsScreen();
        tutorialScreen = new TutorialSelectScreen();
        playScreen = new PlayScreen();
        storeScreen = new StoreScreen();

        stackView = this.getSuperview();

        // TODO animate the logo in some cutesy way
        var shearedLogo = new ImageView({
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
            // TODO
            console.log('show stats screen');
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
            // TODO
            console.log('show awards screen');
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
            stackView.push(storeScreen);
        });

        var tutorialButton = new ImageView({
            superview: this,
            x: 728,
            y: 496,
            width: 80,
            height: 80,
            image: 'resources/images/button-tutorials.png'
        });
        tutorialButton.on('InputSelect', function () {
            tutorialScreen.build();
            stackView.push(tutorialScreen);
        });

        var playButton = new ImageView({
            superview: this,
            x: 435,
            y: 346,
            width: 154,
            height: 82,
            image: 'resources/images/button-play.png'
        });
        playButton.on('InputSelect', function () {
            stackView.push(playScreen);
        });

        var creditsButton = new ImageView({
            superview: this,
            x: 453,
            y: 439,
            width: 118,
            height: 36,
            image: 'resources/images/button-credits.png'
        });
        creditsButton.on('InputSelect', function () {
            stackView.push(creditsScreen);
        });
        creditsScreen.on('credits:back', function () {
            stackView.pop();
        });

        GC.app.engine.on('Tick', bind(this, function (dt) {
            if (playScreen.clipper) {
                playScreen.clipper.emitDiamonds();
            }
            if (tutorialScreen.tutorialScreen) {
                tutorialScreen.tutorialScreen.runTick();
                if (tutorialScreen.tutorialScreen.clipper) {
                    tutorialScreen.tutorialScreen.clipper.emitDiamonds();
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

        tutorialScreen.on('tutorial:back', bind(this, function () {
            stackView.pop();
        }));

        storeScreen.on('store:back', bind(this, function () {
            stackView.pop();
        }));

        playScreen.on('playscreen:craft', bind(this, function () {
            adtimer.interrupt(function () {
                stackView.push(craftScreen);
                craftScreen.emit('craft:start');
            });
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
            adtimer.interrupt(function () {
                delete playScreen;
                playScreen = new PlayScreen();
                stackView.push(craftScreen);
                craftScreen.emit('craft:start');
            });
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted(false, {silent: true});
        }));
    };
});
