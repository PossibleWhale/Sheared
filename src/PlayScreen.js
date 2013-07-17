import device;
import animate;
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


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
        this.day = 0;
        this.build();
    };

    this.build = function () {
        // anything that must happen when the screen appears goes here.
        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted();
        }));

        this.on('play:start', bind(this, playGame));

        this.healthBar = new HealthBar({
            superview: this,
            x: 387,
            y: 576-80,
        });

        this.sheep = [];

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 367,
            y: 52,
            fromLocal: true
        });

        muteOpts = {
            superview: this,
            x: 936,
            y: 16,
            width: 48,
            height: 48,
            zIndex: 1000 // this must position above the clickable area of the screen
        };
        this.muteButton = new MuteButton(muteOpts);

        // for playtesting purposes..
        if (device.name === 'browser') {
            if (!this.onKey) {
                this.onKey = bind(this, function () {
                    if (this.clipper) {
                        this.clipper.launchBlade();
                    }
                });
                document.addEventListener('keydown', this.onKey, false);
            }
        }

        this.beginDay();
    };

    this.beginDay = function () {
        this.dailyWool = new WoolStorage({persist: false});
        this.sheep = [];

        var dayIntro = new TextView(merge({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576,
            size: 128,
            strokeWidth: 8,
            text: 'Day  ' + (this.day+1),
        }, constants.TEXT_OPTIONS)),
        continueButton = new Button(merge({
            x: 392,
            y: 418,
            width: 240,
            height: 54,
            text: 'Continue',
        }, constants.TEXT_OPTIONS));

        dayIntro.addSubview(continueButton);
        this.addSubview(dayIntro);
        animate(dayIntro).now({x: 0});

        continueButton.on('InputSelect', bind(this, function(evt) {
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
        clearInterval(this.interval);
        this.removeSubview(this.timer);
        this.removeSubview(this.clipper);
        this.removeSubview(this.inputBuffer);

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
        var i, resultsScreen, continueButton, woolCounts = [];
        if (finishedDay) {
            resultsScreen = new ImageView({
                x: 1024,
                y: 0,
                width: 1024,
                height: 576,
                image: 'resources/images/results.png'
            });
            continueButton = new Button({
                x: 392,
                y: 418,
                width: 240,
                height: 54
            });
            for (i = 0; i < constants.colors.length; i++) {
                woolCounts.push(new TextView(merge({
                    x: 72 + 196*i,
                    y: 337,
                    width: 96,
                    height: 48,
                    text: '0',
                    size: 128,
                    autoFontSize: true,
                }, constants.TEXT_OPTIONS)));
                resultsScreen.addSubview(woolCounts[i]);
            }
            for (i = 0; i < woolCounts.length; i++) {
                woolCounts[i].maxCount = this.dailyWool.get(constants.colors[i]).count;
                woolCounts[i].woolColor = constants.colors[i].label;
                woolCounts[i].interval = setInterval(bind(woolCounts[i], function () {
                    var count = parseInt(this.getText(), 10);
                    // if we're finished counting up, clear interval and show a burst of wool
                    if (count === this.maxCount) {
                        clearInterval(this.interval);
                        emitWool(this.style.x+this.style.width/2, this.style.y+this.style.height/2, this.maxCount, this.woolColor);
                        return;
                    }
                    this.setText('' + (count + 1));
                }), 100);
            }
        } else {
            resultsScreen = new TextView(merge({
                x: 1024,
                y: 0,
                width: 1024,
                height: 576,
                opacity: 1,
                size: 72,
                strokeWidth: 8,
                text: 'Clipper out of power!'
            }, constants.TEXT_OPTIONS));
            continueButton = new TextView(merge({
                x: 392,
                y: 418,
                width: 240,
                height: 54,
                opacity: 1,
                text: 'Let\'s craft!'
            }, constants.TEXT_OPTIONS));
        }

        resultsScreen.addSubview(continueButton);
        this.addSubview(resultsScreen);
        animate(resultsScreen).now({x: 0});

        continueButton.on('InputSelect', bind(this, function (evt) {
            animate(resultsScreen).now({x: -1024}).then(bind(this, function() {
                resultsScreen.removeFromSuperview();
                this.day += 1;
                if (!finishedDay) {
                    GC.app.titleScreen.emit('playscreen:end');
                } else if (finishedDay) {
                    this.beginDay();
                }
            }));
        }));
    }
});

function playGame () {
    if (!this.clipper) {
        this.clipper = new Clipper({
            x: 0,
            y: laneCoord(4) + 5 // start in middle lane
        });
    } else {
        this.clipper.style.x = 0;
        this.clipper.style.y = laneCoord(4) + 5;
    }
    this.addSubview(this.clipper);

    this.player = GC.app.player;
    this.audio = GC.app.audio;
    this.interval = setInterval(spawnSheep.bind(this), sheepFrequency(this.day));

    this.timer = new Timer({
        x: 0,
        y: 14,
        width: 1024,
        height: 40
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
