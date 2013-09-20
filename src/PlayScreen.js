import device;
import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.ViewPool as ViewPool;

import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Clipper as Clipper;
import src.Diamond as Diamond;
import src.Battery as Battery;
import src.WoolStorage as WoolStorage;
import src.constants as constants;
import src.Timer as Timer;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.InputBuffer as InputBuffer;
import src.HealthBar as HealthBar;
import src.WoolCounter as WoolCounter;

import src.adtimer as adtimer;
import src.util as util;


exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);
        this.day = 0;
        this.firstPlay = true; // set to false when at least 1 day has been played in this session
        this.noBackButton = true; // set to true so the android back button does nothing

        this.build();
    };

    this.build = function () {
        this.paused = false;

        this.on('play:start', bind(this, playGame));

        this.sheep = [];

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

        // wool counter
        this.woolCounts = new WoolCounter({
            superview: this,
            x: 300,
            y: 8,
            storage: GC.app.player.wool.copy({persist: false}) // we don't commit our wool until the end of the day
        });

        this.sheepPool = new ViewPool({
            ctor: Sheep,
            initCount: 20,
            initOpts: {
                superview: this
            }
        });
        this.ramPool = new ViewPool({
            ctor: Ram,
            initCount: 10,
            initOpts: {
                superview: this
            }
        });

        // anything that must happen when the screen appears goes here.
        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
            this.woolCounts.matchStorage();
        }));

        muteOpts = {
            superview: this,
            x: 952,
            y: 8,
            width: 64,
            height: 64,
            zIndex: 99999 // this must position above the clickable area of the screen
        };
        this.muteButton = new MuteButton(muteOpts);

        this.diamondIndicator = new ImageView({
            superview: this,
            visible: false,
            x: 159,
            y: 13,
            width: 54,
            height: 54,
            image: 'resources/images/diamond.png'
        });

        this.pauseText = new Button({
            x: 1024,
            y: 576/2 - 100,
            width: 500,
            height: 200,
            text: 'Paused'
        });

        this.dayIntro = new View({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576
        });
        this.dayIntro.addSubview(new ImageView({
            x: 192,
            y: 113,
            width: 628,
            height: 108,
            image: 'resources/images/ribbon.png'
        }));
        this.dayText = new Button({
            superview: this.dayIntro,
            x: 270,
            y: 140,
            width: 484,
            height: 54,
            size: 128,
            text: 'Day  ' + (this.day+1)
        });

        var continueButton = new Button({
            x: 412,
            y: 344,
            width: 200,
            height: 64,
            click: true,
            image: 'resources/images/button-continue.png'
        });

        this.dayIntro.addSubview(continueButton);

        this.dayIntro.on('InputSelect', bind(this, function(evt) {
            evt.cancel();
            animate(this.dayIntro).now({x: -1024}).then(bind(this, function () {
                this.dayIntro.removeFromSuperview();
                this.emit('play:start');
            }));
        }));

        // results
        this.resultsScreen = new View({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576
        });
        this.resultsScreen.addSubview(new ImageView({
            x: 198,
            y: 113,
            width: 628,
            height: 108,
            image: 'resources/images/ribbon.png'
        }));
        this.resultsScreen.addSubview(new Button({
            x: 270,
            y: 140,
            width: 484,
            height: 54,
            size: 128,
            text: 'Results'
        }));
        continueButton = new Button({
            superview: this.resultsScreen,
            x: 412,
            y: 344,
            width: 200,
            height: 64,
            click: true,
            image: 'resources/images/button-continue.png'
        });
        this.resultsScreen.storeButton = new Button({
            superview: this.resultsScreen,
            x: 59,
            y: 252,
            width: 184,
            height: 60,
            click: true,
            image: 'resources/images/button-general-store.png'
        });
        this.resultsScreen.craftButton = new Button({
            superview: this.resultsScreen,
            x: 781,
            y: 252,
            width: 184,
            height: 60,
            click: true,
            image: 'resources/images/button-crafts-catalog.png'
        });
        this.resultsScreen.homeButton = new Button({
            x: 8,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-home.png'
        });

        continueButton.on('InputSelect', bind(this, function (evt) {
            animate(this.resultsScreen).now({x: -1024}).then(bind(this, function() {
                this.resultsScreen.removeFromSuperview();
                this.day += 1;
                this.beginDay();
            }));
        }));

        // game over
        this.gameOverScreen = new View({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576
        });
        this.gameOverScreen.addSubview(new ImageView({
            x: 198,
            y: 113,
            width: 628,
            height: 108,
            image: 'resources/images/ribbon.png'
        }));
        this.gameOverScreen.addSubview(new Button({
            x: 270,
            y: 140,
            width: 484,
            height: 54,
            size: 128,
            text: 'Game Over'
        }));
        this.gameOverScreen.storeButton = new Button({
            superview: this.gameOverScreen,
            x: 59,
            y: 252,
            width: 184,
            height: 60,
            click: true,
            image: 'resources/images/button-general-store.png'
        });
        this.gameOverScreen.restartButton = new Button({
            superview: this.gameOverScreen,
            x: 412,
            y: 250,
            width: 200,
            height: 64,
            click: true,
            image: 'resources/images/button-restart.png'
        });
        this.gameOverScreen.homeButton = new Button({
            superview: this.gameOverScreen,
            x: 412,
            y: 344,
            width: 200,
            height: 64,
            click: true,
            image: 'resources/images/button-mainmenu.png'
        });
        this.gameOverScreen.craftButton = new Button({
            superview: this.gameOverScreen,
            x: 781,
            y: 252,
            width: 184,
            height: 60,
            click: true,
            image: 'resources/images/button-crafts-catalog.png'
        });

        this.gameOverScreen.restartButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:restart');
            this.gameOverScreen.removeFromSuperview();
        }));

        this.resultsScreen.storeButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:store');
        }));
        this.gameOverScreen.storeButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:store');
        }));
        this.resultsScreen.craftButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:craft');
        }));
        this.gameOverScreen.craftButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:craft');
        }));
        this.resultsScreen.homeButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:home');
        }));
        this.gameOverScreen.homeButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:home');
        }));

        // for playtesting purposes..
        if (device.name === 'browser') {
            if (!this.onKey) {
                this.onKey = bind(this, function () {
                    if (this.clipper && !this.paused) {
                        this.clipper.launchBlade();
                    }
                });
                document.addEventListener('keydown', this.onKey, false);
            }
        }

        this.beginDay();
    };

    this.togglePaused = function () {
        this.paused = !this.paused;
        if (this.paused) {
            this.pauseText.style.x = 1024;
            this.addSubview(this.pauseText);
            this.timer.stop();
            this.clipper.pauseCountdown();
            if (this.interval) {
                clearInterval(this.interval);
            }
            var i = this.sheep.length;
            while (i--) {
                this.sheep[i].animator.pause();
            }
            if (this.battery) {
                this.battery.animator.pause();
            }
            if (this.diamond) {
                this.diamond.animator.pause();
            }
            this.removeSubview(this.inputBuffer);
            animate(this.pauseText).now({x: 1024/2 - 250}, 400);
        } else {
            animate(this.pauseText).now({x: 0 - 500}, 400).then(bind(this, function () {
                this.timer.run();
                this.clipper.startCountdown();
                this.interval = setInterval(spawnSheep.bind(this), sheepFrequency(this.day));
                var i = this.sheep.length;
                while (i--) {
                    this.sheep[i].animator.resume();
                }
                if (this.battery) {
                    this.battery.animator.resume();
                }
                if (this.diamond) {
                    this.diamond.animator.resume();
                }
                this.addSubview(this.inputBuffer);
                this.removeSubview(this.pauseText);
            }));
        }
    };

    this.beginDay = function () {
        if (!this.firstPlay) {
            adtimer.interrupt(bind(this, this._beginDay));
        } else {
            this._beginDay();
            this.healthBar = new HealthBar({
                superview: this,
                x: 404,
                y: 518
            });
        }
        this.firstPlay = false;
    }

    this._beginDay = function () {
        this.dailyWool = new WoolStorage({persist: false});
        this.sheep = [];

        this.dayText.setText('Day  ' + (this.day+1));
        this.dayIntro.style.x = 1024;
        this.addSubview(this.dayIntro);
        animate(this.dayIntro).now({x: 0});
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

    this.removeSheep = function (sheep) {
        this.sheep.splice(this.sheep.indexOf(sheep), 1);
    };

    this.spawnDiamond = function () {
        this.diamond = new Diamond({
            x: 1024
        });
        this.diamond.style.y = util.randomY(this.diamond.style.height);

        this.addSubview(this.diamond);
        this.diamond.run();
    };

    this.spawnBattery = function () {
        this.battery = new Battery({
            x: 1024
        });
        this.battery.style.y = util.randomY(this.battery.style.height);

        this.addSubview(this.battery);
        this.battery.run();
    };

    this.endDay = function () {
        var i = this.sheep.length, j = this.clipper.blades.length;

        this.audio.stopMusic();
        this.clipper.bladeOut = false;
        this.clipper.reloadBlade();
        this.clipper.pauseCountdown();
        while (i--) {
            this.sheep[i].die();
        }
        this.sheepPool.releaseAllViews();
        this.ramPool.releaseAllViews();
        while (j--) {
            this.clipper.blades[j].die();
        }
        if (this.diamond) {
            this.diamond.animator.clear();
            this.removeSubview(this.diamond);
        }
        if (this.battery) {
            this.battery.animator.clear();
            this.removeSubview(this.battery);
        }
        clearInterval(this.interval);
        this.removeSubview(this.timer);
        this.clipper.bladePool.releaseAllViews();
        this.removeSubview(this.clipper);
        this.removeSubview(this.inputBuffer);
        this.removeSubview(this.pauseButton);

        this.player.mergeWoolCounts(this.dailyWool);
    };

    this.gameOver = function () {
        this.endDay();
        this._showResults(false);
    };

    this.timeOver = function () {
        this.endDay();
        this._showResults(true);
    };

    this._showResults = function (finishedDay) {
        var i, resultsScreen, continueButton;
        if (finishedDay) {
            var counts = [];
            for (i = 0; i < constants.colors.length; i++) {
                var count = this.dailyWool.get(constants.colors[i]).count,
                    numParticles = Math.min(10, count);
                counts.push(numParticles);
            }
            if (this.dailyCounter) {
                this.dailyCounter.removeFromSuperview()
                delete this.dailyCounter;
            }
            this.dailyCounter = new WoolCounter({
                x: 300,
                y: 250,
                width: 424,
                height: 64,
                storage: this.dailyWool
            });
            this.resultsScreen.addSubview(this.dailyCounter);
            resultsScreen = this.resultsScreen;
        } else {
            resultsScreen = this.gameOverScreen;
        }

        this.addSubview(resultsScreen);
        animate(resultsScreen).now({x: 0}).then(bind(this, function () {
            if (finishedDay) {
                var i, startX = 333, gap = 90;
                resultsScreen.addSubview(resultsScreen.homeButton);
                for (i = 0; i < constants.colors.length; i++) {
                    emitWool(startX + i*gap,
                             294, counts[i], constants.colors[i].label);
                }
            }
        }));

    }
});

function playGame () {
    this.paused = false;
    if (this.pauseButton) {
        this.addSubview(this.pauseButton);
    } else {
        this.pauseButton = new Button({
            superview: this,
            x: 8,
            y: 8,
            zIndex: 999999,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-pause.png'
        });
        this.pauseButton.on('InputSelect', bind(this, function () {
            this.togglePaused();
        }));
    }

    if (!this.clipper) {
        this.clipper = new Clipper({
            superview: this,
            x: 0,
            y: laneCoord(4) + 5, // start in middle lane
            infiniteDiamond: GC.app.player.upgrades.get('diamond').value
        });
    } else {
        this.clipper.style.x = 0;
        this.clipper.style.y = laneCoord(4) + 5;
        this.clipper.infiniteDiamond = GC.app.player.upgrades.get('diamond').value;
        this.clipper.checkGold();
        this.addSubview(this.clipper);
    }
    if (this.clipper.infiniteDiamond) {
        this.clipper.becomeDiamond(true);
    }

    if (this.clipper.isDiamond && !this.clipper.infiniteDiamond) {
        this.clipper.startCountdown();
    }

    this.player = GC.app.player;
    this.audio = GC.app.audio;
    this.interval = setInterval(spawnSheep.bind(this), sheepFrequency(this.day));

    if (this.timer) {
        this.addSubview(this.timer);
        this.timer.reset();
    } else {
        this.timer = new Timer({
            x: 836,
            y: 505
        });
        this.addSubview(this.timer);
        this.timer.run();
    }

    this.audio.playMusic();

    this.inputBuffer = new InputBuffer({superview: this});
}

function spawnSheep () {
    if (this.timer.time <= 2) {
        return;
    }
    var sheep, r = Math.random();
    if (r > constants.ramRarity) {
        sheep = this.sheepPool.obtainView();
    } else {
        sheep = this.ramPool.obtainView();
    }
    this.sheep.push(sheep);
    sheep.run();
}

// return a random y-coordinate for the lane
function randomLaneCoord (numLanes) {
    return laneCoord(Math.floor(Math.random()*numLanes));
}

function laneCoord (index) {
    return (index * constants.laneSize) + constants.fenceSize;
}

function emitWool (x, y, numBolts, color) {
    var particleObjects = GC.app.particleEngine.obtainParticleArray(numBolts), i;
    for (i = 0; i < particleObjects.length; i++) {
        var pObj = particleObjects[i];
        pObj.x = x-30;
        pObj.y = y-30;
        pObj.dx = Math.random() * 300;
        pObj.dy = Math.random() * 300;
        if (Math.random() > 0.5) {
            pObj.dx *= -1;
        }
        if (Math.random() > 0.5) {
            pObj.dy *= -1;
        }
        pObj.dr = Math.random() * Math.PI / 4;
        pObj.ax = 30;
        pObj.ay = 30;
        pObj.width = 60;
        pObj.height = 60;
        pObj.scale = 1;
        pObj.dscale = 0.5;
        pObj.opacity = 1;
        pObj.dopacity = -1;
        pObj.image = 'resources/images/particle-' + color + '.png';
    }
    GC.app.particleEngine.emitParticles(particleObjects);
}

function sheepFrequency (day) {
    return Math.max(3 - (day * 1/6), 1)*200;
}
