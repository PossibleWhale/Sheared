import device;
import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Clipper as Clipper;
import src.Blade as Blade;
import src.Diamond as Diamond;
import src.Battery as Battery;
import src.Inventory as Inventory;
import src.constants as constants;
import src.Timer as Timer;
import src.InfiniteTimer as InfiniteTimer;
import ui.TextView as TextView;
import ui.ParticleEngine as ParticleEngine;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
        this.day = 0;
        this.infiniteMode = false;
        this.build();
    };

    this.build = function () {
        this.particleEngine = new ParticleEngine({
            superview: this,
            width: 1024,
            height: 576
        });

        this.sheep = [];
        this.dailyInventory = new Inventory();

        this.on('play:start', bind(this, playGame));

        var dayIntro = new ImageView({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/day-' + (this.day+1) + '.png'
        }),
        continueButton = new View({
            x: 392,
            y: 418,
            width: 240,
            height: 54
        });

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

        // for playtesting purposes..
        if (device.name === 'browser') {
            var onKey = function (e) {
                launchBlade();
            };
            document.addEventListener('keydown', bind(this, launchBlade), false);
        }
    };

    this.removeSheep = function (sheep) {
        this.sheep.splice(this.sheep.indexOf(sheep), 1);
        sheep.removeFromSuperview();
    };
    
    this.spawnDiamond = function () {
        this.diamond = new Diamond({
            x: 1024,
            y: randomLaneCoord(8)
        });

        this.addSubview(this.diamond);
        this.diamond.run();
    };

    this.spawnBattery = function () {
        this.battery = new Battery({
            x: 1024,
            y: randomLaneCoord(8)
        });

        this.addSubview(this.battery);
        this.battery.run();
    };

    this.endDay = function () {
        var i = this.sheep.length;

        this.bladeOut = false;
        this.clipper.reloadBlade();
        while (i--) {
            clearInterval(this.sheep[i].interval);
        }
        if (this.blade) {
            clearInterval(this.blade.interval);
        }
        if (this.diamond) {
            clearInterval(this.diamond.interval);
        }
        if (this.battery) {
            clearInterval(this.battery.interval);
        }
        clearInterval(this.interval);

        this.removeAllSubviews();
        this.removeAllListeners();

        this.player.addInventory(this.dailyInventory);
    };

    this.gameOver = function () {
        this.endDay();

        var gameOverScreen = new TextView({
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            text: 'You lost',
            size: 42,
            color: '#FFFFFF',
            backgroundColor: '#000000'
        });
        this.addSubview(gameOverScreen);
        gameOverScreen.on('InputSelect', bind(this, function () {
            this.getSuperview().emit('titleScreen:craft');
            this.getSuperview().emit('playscreen:end');
        }));
    };

    this.timeOver = function () {
        this.endDay();
        this._showResults();
    };

    /* TODO make this work for both a time over and a game over.
     * time over: show results, click continue to go to next day or craft if week is over (how it works now)
     * game over: show results, click finish to craft.
     */
    this._showResults = function () {
        var i, resultsScreen = new ImageView({
            x: 1024,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/results.png'
        }),
        continueButton = new View({
            x: 392,
            y: 418,
            width: 240,
            height: 54
        });
        var woolCounts = [];
        for (i = 0; i < constants.colors.length; i++) {
            woolCounts.push(new TextView({
                x: 72 + 196*i,
                y: 337,
                width: 96,
                height: 48,
                horizontalAlign: 'center',
                verticalAlign: 'middle',
                text: '0',
                size: 128,
                autoFontSize: true,
                color: '#FFFFFF',
                strokeWidth: 4,
                strokeColor: '#000000'
            }));
            resultsScreen.addSubview(woolCounts[i]);
        }
        // animate the counts up to however many of each color were collected
        this.particleEngine = new ParticleEngine({
            superview: this,
            width: 1024,
            height: 576
        });
        for (i = 0; i < woolCounts.length; i++) {
            woolCounts[i].maxCount = this.dailyInventory.wool.get(constants.colors[i].label).count;
            woolCounts[i].particleEngine = this.particleEngine;
            woolCounts[i].woolColor = constants.colors[i].label;
            woolCounts[i].interval = setInterval(bind(woolCounts[i], function () {
                var count = parseInt(this.getText());
                // if we're finished counting up, clear interval and show a burst of wool
                if (count === this.maxCount) {
                    clearInterval(this.interval);
                    emitWool(this.style.x+this.style.width/2, this.style.y+this.style.height/2, this.maxCount, this.woolColor, this.particleEngine);
                    return;
                }
                this.setText('' + (count + 1));
            }), 100);
        }

        resultsScreen.addSubview(continueButton);
        this.addSubview(resultsScreen);
        animate(resultsScreen).now({x: 0});

        continueButton.on('InputSelect', bind(this, function (evt) {
            evt.cancel(); // stop the event from propagating (so we don't shoot a blade)
            animate(resultsScreen).now({x: -1024}).then(bind(this, function() {
                for (i = 0; i < woolCounts.length; i++) {
                    woolCounts[i].particleEngine.removeFromSuperview();
                }
                resultsScreen.removeFromSuperview();
                this.day += 1;
                if (this.day >= constants.days.length ) {
                    this.getSuperview().emit('titleScreen:craft');
                    this.getSuperview().emit('playscreen:end');
                } else {
                    this.build();
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
    this.interval = setInterval(spawnSheep.bind(this), constants.days[this.day].sheepFrequency);

    if (this.infiniteMode) {
        this.timer = new InfiniteTimer();
    } else {
        this.timer = new Timer({
            x: 0,
            y: 0,
            width: 1024,
            height: constants.fenceSize
        });
    }
    this.addSubview(this.timer);
    this.timer.run();

    var leftSide = new View({
        superview: this,
        x: 0,
        y: 0,
        width: 1024/2,
        height: 576
    });

    var rightSide = new View({
        superview: this,
        x: 1024/2,
        y: 0,
        width: 1024/2,
        height: 576
    });

    rightSide.on('InputSelect', bind(this, function (evt) {
        bind(this, launchBlade)();
    }));

    // set up dragging events for clipper
    leftSide.on('InputStart', bind(this, function (evt) {
        leftSide.startDrag({
            inputStartEvt: evt
        });
    }));

    leftSide.on('DragStart', bind(this, function (dragEvt) {
        this.dragOffset = {
            x: dragEvt.srcPt.x - this.clipper.style.x,
            y: dragEvt.srcPt.y - this.clipper.style.y
        };
    }));

    leftSide.on('Drag', bind(this, function (startEvt, dragEvt, delta) {
        bind(this, clipperDrag)(dragEvt);
    }));

    leftSide.on("DragStop", bind(this, function (startEvt, dragEvt) {
        bind(this, clipperDrag)(dragEvt);
    }));
}

function clipperDrag(dragEvt) {
    var x = dragEvt.srcPt.x - this.dragOffset.x,
        y = dragEvt.srcPt.y - this.dragOffset.y;

    // confine x-movement to 0-1024
    if (x < 0) {
        this.clipper.style.x = 0;
    } else if (x > 1024/2 - this.clipper.style.width) {
        this.clipper.style.x = 1024/2 - this.clipper.style.width;
    } else {
        this.clipper.style.x = x;
    }

    // confine y-movement to within fence
    if (y < constants.fenceSize) {
        this.clipper.style.y = constants.fenceSize;
    } else if (y > 576 - constants.fenceSize - this.clipper.style.height) {
        this.clipper.style.y = 576 - constants.fenceSize - this.clipper.style.height;
    } else {
        this.clipper.style.y = y;
    }
}

function spawnSheep () {
    if (!this.infiniteMode && this.timer.time <= 2) {
        return;
    }
    var sheep, r = Math.random();
    if (r > constants.days[this.day].ramRarity) {
        sheep = new Sheep({
            x: 1024,
            y: randomLaneCoord(8) - 5
        });
    } else {
        sheep = new Ram({
            x: 1024,
            y: randomLaneCoord(7) - 5
        });
    }

    this.addSubview(sheep);
    this.sheep.push(sheep);
    sheep.run();
}

function launchBlade () {
    if (this.bladeOut || (this.timer && this.timer.time === 0)) {
        return;
    }
    var blade = new Blade({
        x: this.clipper.style.x + this.clipper.style.width,
        y: this.clipper.style.y + 3
    });
    this.addSubview(blade);
    this.bladeOut = true;
    this.clipper.setImage('resources/images/clipper-' + this.clipper.health + '-none.png');
    blade.run();
    this.player.bladeFired(blade.isDiamond);
}

// return a random y-coordinate for the lane
function randomLaneCoord (numLanes) {
    return laneCoord(Math.floor(Math.random()*numLanes));
}

function laneCoord (index) {
    return (index * constants.laneSize) + constants.fenceSize;
}

function emitWool (x, y, numBolts, color, particleEngine) {
    var particleObjects = particleEngine.obtainParticleArray(numBolts), i;
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
    particleEngine.emitParticles(particleObjects);
}
