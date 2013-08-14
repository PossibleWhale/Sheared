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


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
        this.day = 0;
        this.firstPlay = true; // set to false when at least 1 day has been played in this session

        this.build();
    };

    this.build = function () {
        this.paused = false;

        this.on('play:start', bind(this, playGame));

        this.sheep = [];

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 283,
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
            x: 1024-80,
            y: 0,
            width: 80,
            height: 80,
            zIndex: 1000 // this must position above the clickable area of the screen
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
                y: 576-80,
            });
        }
        this.firstPlay = false;
    }

    this._beginDay = function () {
        this.dailyWool = new WoolStorage({persist: false});
        this.sheep = [];

        var dayIntro = new ImageView({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/day.png'
        });
        dayIntro.addSubview(new Button({
            x: 257,
            y: 123,
            width: 510,
            height: 80,
            size: 128,
            text: 'Day  ' + (this.day+1)
        }));

        var continueButton = new Button({
            x: 414,
            y: 259,
            width: 195,
            height: 60,
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
        var i = this.sheep.length;

        this.audio.stopMusic();
        this.clipper.bladeOut = false;
        this.clipper.reloadBlade();
        this.clipper.pauseCountdown();
        while (i--) {
            this.sheep[i].animator.clear();
            this.removeSubview(this.sheep[i]);
        }
        if (this.clipper.blade) {
            this.clipper.blade.animator.clear();
            this.removeSubview(this.clipper.blade);
        }
        if (this.diamond) {
            this.diamond.animator.clear();
            this.removeSubview(this.diamond);
        }
        if (this.battery) {
            this.battery.animator.clear();
            this.removeSubview(this.battery);
        }
        if (this.multIndicator) {
            this.removeSubview(this.multIndicator);
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
                height: 60
            }),
            storeButton = new Button({
                superview: resultsScreen,
                x: 27,
                y: 248,
                width: 200,
                height: 80
            }),
            craftButton = new Button({
                superview: resultsScreen,
                x: 797,
                y: 248,
                width: 200,
                height: 80
            }),
            homeButton = new ImageView({
                x: 0,
                y: 0,
                width: 80,
                height: 80,
                image: 'resources/images/button-home.png'
            }),
            resultsLabel = new Button({
                superview: resultsScreen,
                x: 257,
                y: 123,
                width: 510,
                height: 80,
                text: 'Results'
            });

            var counts = [], countViews = [];
            for (i = 0; i < constants.colors.length; i++) {
                var count = this.dailyWool.get(constants.colors[i]).count,
                    numParticles = Math.min(25, count),
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
                height: 80
            }),
            restartButton = new Button({
                superview: resultsScreen,
                x: 414,
                y: 258,
                width: 195,
                height: 60
            }),
            homeButton = new Button({
                superview: resultsScreen,
                x: 414,
                y: 360,
                width: 195,
                height: 60
            }),
            craftButton = new Button({
                superview: resultsScreen,
                x: 797,
                y: 248,
                width: 200,
                height: 80
            }),
            resultsLabel = new Button({
                superview: resultsScreen,
                x: 257,
                y: 123,
                width: 510,
                height: 80,
                text: 'Game Over'
            });

            restartButton.on('InputSelect', bind(this, function () {
                GC.app.titleScreen.emit('playscreen:restart');
            }));

            delete this.multIndicator;
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
        this.pauseButton = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            zIndex: 999999,
            width: 80,
            height: 80,
            image: 'resources/images/button-pause.png'
        });
        this.pauseButton.on('InputSelect', bind(this, function () {
            this.togglePaused();
        }));
    }

    if (this.multIndicator) {
        this.addSubview(this.multIndicator);
    } else {
        var mult = GC.app.player.upgrades.get('temp_mult').value;
        if (mult >= 5 || mult === 'max') {
            mult = 5;
        }
        if (mult > 1) {
            this.multIndicator = new ImageView({
                superview: this,
                x: 751,
                y: 0,
                width: 80,
                height: 80,
                image: 'resources/images/active-multiplier-' + mult + '.png'
            });
        }
    }

    if (!this.clipper) {
        this.clipper = new Clipper({
            x: 0,
            y: laneCoord(4) + 5, // start in middle lane
            infiniteDiamond: GC.app.player.upgrades.get('temp_diamond').value
        });
    } else {
        this.clipper.style.x = 0;
        this.clipper.style.y = laneCoord(4) + 5;
    }
    this.addSubview(this.clipper);
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
        x: 751,
        y: 576-80,
        width: 80,
        height: 60
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

    var diagonalChance = Math.min(0.2, this.day*0.05);
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
    return Math.max((1.5 - (day * 1/6))*500, 0.75);
}
