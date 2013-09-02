import device;
import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;

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
            x: 292,
            y: 0,
            storage: GC.app.player.wool.copy({persist: false}) // we don't commit our wool until the end of the day
        });

        // anything that must happen when the screen appears goes here.
        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
            this.woolCounts.matchStorage();
        }));

        muteOpts = {
            superview: this,
            x: 944,
            y: 0,
            width: 80,
            height: 80,
            zIndex: 99999 // this must position above the clickable area of the screen
        };
        this.muteButton = new MuteButton(muteOpts);

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
            this.pauseText = new Button({
                superview: this,
                x: 1024,
                y: 576/2 - 100,
                width: 500,
                height: 200,
                text: 'Paused'
            });
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
                x: 387,
                y: 496
            });
        }
        this.firstPlay = false;
    }

    this._beginDay = function () {
        this.dailyWool = new WoolStorage({persist: false});
        this.sheep = [];

        var dayIntro = new View({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576
        });
        dayIntro.addSubview(new ImageView({
            x: 192,
            y: 103,
            width: 640,
            height: 120,
            image: 'resources/images/ribbon.png'
        }));
        dayIntro.addSubview(new Button({
            x: 267,
            y: 133,
            width: 490,
            height: 60,
            size: 128,
            text: 'Day  ' + (this.day+1)
        }));

        var continueButton = new Button({
            x: 404,
            y: 259,
            width: 215,
            height: 80,
            click: true,
            image: 'resources/images/button-continue.png'
        });

        dayIntro.addSubview(continueButton);
        this.addSubview(dayIntro);
        animate(dayIntro).now({x: 0});

        dayIntro.on('InputSelect', bind(this, function(evt) {
            evt.cancel();
            animate(dayIntro).now({x: -1024}).then(bind(this, function () {
                dayIntro.removeFromSuperview();
                this.emit('play:start');
            }));
        }));
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
        sheep.removeFromSuperview();
    };

    this.spawnDiamond = function () {
        this.diamond = new Diamond({
            x: 1024
        });
        this.diamond.style.y = randomY(this.diamond.style.height);

        this.addSubview(this.diamond);
        this.diamond.run();
    };

    this.spawnBattery = function () {
        this.battery = new Battery({
            x: 1024
        });
        this.battery.style.y = randomY(this.battery.style.height);

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
            this.sheep[i].animator.clear();
            this.removeSubview(this.sheep[i]);
        }
        while (j--) {
            this.clipper.blades[j].animator.clear();
            this.removeSubview(this.clipper.blades[j]);
        }
        this.clipper.blades = [];
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
        this.removeSubview(this.clipper);
        this.removeSubview(this.inputBuffer);
        this.removeSubview(this.pauseButton);

        this.player.mergeWoolCounts(this.dailyWool);
    };

    this.gameOver = function () {
        this.endDay();
        this._showResults(false);
        this.emit('playscreen:gameover');
    };

    this.timeOver = function () {
        this.endDay();
        this._showResults(true);
    };

    this._showResults = function (finishedDay) {
        var i, resultsScreen, continueButton;
        if (finishedDay) {
            resultsScreen = new ImageView({
                x: 1024,
                y: 0,
                width: 1024,
                height: 576,
                image: 'resources/images/results.png'
            });
            continueButton = new Button({
                x: 414,
                y: 413,
                width: 195,
                height: 60,
                click: true
            }),
            storeButton = new Button({
                superview: resultsScreen,
                x: 27,
                y: 248,
                width: 200,
                height: 80,
                click: true
            }),
            craftButton = new Button({
                superview: resultsScreen,
                x: 797,
                y: 248,
                width: 200,
                height: 80,
                click: true
            }),
            homeButton = new Button({
                x: 0,
                y: 0,
                width: 80,
                height: 80,
                click: true,
                image: 'resources/images/button-home.png'
            }),
            resultsLabel = new Button({
                superview: resultsScreen,
                x: 257,
                y: 113,
                width: 510,
                height: 80,
                text: 'Results'
            });

            var counts = [], countViews = [];
            for (i = 0; i < constants.colors.length; i++) {
                var count = this.dailyWool.get(constants.colors[i]).count,
                    numParticles = Math.min(10, count),
                    countView = new TextView(merge({
                        superview: resultsScreen,
                        x: 252 + 110*i,
                        y: 343,
                        width: 80,
                        height: 40,
                        text: '' + count,
                        size: 128,
                        autoFontSize: true,
                    }, constants.TEXT_OPTIONS));
                counts.push(numParticles);
                countViews.push(countView);
            }

            resultsScreen.addSubview(continueButton);
            continueButton.on('InputSelect', bind(this, function (evt) {
                animate(resultsScreen).now({x: -1024}).then(bind(this, function() {
                    resultsScreen.removeFromSuperview();
                    this.day += 1;
                    this.beginDay();
                }));
            }));
        } else {
            resultsScreen = new ImageView({
                x: 1024,
                y: 0,
                width: 1024,
                height: 576,
                image: 'resources/images/game-over.png'
            }),
            storeButton = new Button({
                superview: resultsScreen,
                x: 27,
                y: 248,
                width: 200,
                height: 80,
                click: true
            }),
            restartButton = new Button({
                superview: resultsScreen,
                x: 414,
                y: 258,
                width: 195,
                height: 60,
                click: true
            }),
            homeButton = new Button({
                superview: resultsScreen,
                x: 414,
                y: 360,
                width: 195,
                height: 60,
                click: true
            }),
            craftButton = new Button({
                superview: resultsScreen,
                x: 797,
                y: 248,
                width: 200,
                height: 80,
                click: true
            }),
            resultsLabel = new Button({
                superview: resultsScreen,
                x: 257,
                y: 113,
                width: 510,
                height: 80,
                text: 'Game Over'
            });

            restartButton.on('InputSelect', bind(this, function () {
                GC.app.titleScreen.emit('playscreen:restart');
            }));
        }

        storeButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:store');
        }));
        craftButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:craft');
        }));
        homeButton.on('InputSelect', bind(this, function () {
            GC.app.titleScreen.emit('playscreen:home');
        }));

        this.addSubview(resultsScreen);
        animate(resultsScreen).now({x: 0}).then(bind(this, function () {
            if (finishedDay) {
                var i;
                resultsScreen.addSubview(homeButton);
                for (i = 0; i < constants.colors.length; i++) {
                    emitWool(countViews[i].style.x + countViews[i].style.width/2,
                             countViews[i].style.y + countViews[i].style.height/2,
                             counts[i], constants.colors[i].label);
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
            x: 0,
            y: 0,
            zIndex: 999999,
            width: 80,
            height: 80,
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

    this.timer = new Timer({
        x: 813,
        y: 496,
        width: 50,
        height: 30
    });
    this.addSubview(this.timer);
    this.timer.run();

    this.audio.playMusic();

    this.inputBuffer = new InputBuffer({superview: this});
}

function spawnSheep () {
    if (this.timer.time <= 2) {
        return;
    }
    var sheep, r = Math.random();
    if (r > constants.ramRarity) {
        sheep = new Sheep({
            x: 1024
        });
    } else {
        sheep = new Ram({
            x: 1024
        });
    }

    sheep.style.y = randomY(sheep.style.height);
    sheep.startY = sheep.style.y;
    this.addSubview(sheep);
    this.sheep.push(sheep);

    var diagonalChance = Math.min(0.5, this.day*0.1);
    if (Math.random() < diagonalChance) {
        sheep.endY = randomY(sheep.style.height);
    } else {
        sheep.endY = sheep.startY;
    }
    sheep.run();
}

// return a random y-coordinate for the lane
function randomLaneCoord (numLanes) {
    return laneCoord(Math.floor(Math.random()*numLanes));
}

function laneCoord (index) {
    return (index * constants.laneSize) + constants.fenceSize;
}

function randomY (spriteHeight) {
    if (!spriteHeight) {
        spriteHeight = 0;
    }
    return Math.floor((Math.random() * (576 - 2*constants.fenceSize - spriteHeight)) + constants.fenceSize);
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
