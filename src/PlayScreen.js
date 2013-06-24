import device;
import ui.ImageView as ImageView;
import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Clipper as Clipper;
import src.Blade as Blade;
import src.Diamond as Diamond;
import src.Inventory as Inventory;
import src.constants as constants;
import src.Timer as Timer;
import ui.TextView as TextView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play-dev.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);

        this.inventory = new Inventory();

        this.day = 0;
        this.build();
    };

    this.build = function () {
        this.sheep = [];
        this.clipper = new Clipper({
            x: 0,
            y: laneCoord(4) + 5 // start in middle lane
        });
        this.addSubview(this.clipper);

        this.on('play:start', bind(this, play_game));
        this.on('InputSelect', bind(this, launchBlade));
    };

    this.removeSheep = function (sheep) {
        this.sheep.splice(this.sheep.indexOf(sheep), 1);
        sheep.removeFromSuperview();
    };

    this.endDay = function () {
        var i = this.sheep.length;

        while (i--) {
            clearInterval(this.sheep[i].interval);
        }
        if (this.blade) {
            clearInterval(this.blade.interval);
        }
        if (this.diamond) {
            clearInterval(this.diamond.interval);
        }
        clearInterval(this.interval);
        clearInterval(this.diamondInterval);

        this.removeAllSubviews();
        this.removeAllListeners();
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
        }));
    };

    this.timeOver = function () {
        this.endDay();

        // TODO show actual results
        var resultsScreen = new TextView({
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            text: 'Day ' + (this.day + 1) + ' complete!',
            size: 42,
            color: '#FFFFFF',
            backgroundColor: '#000000'
        });
        this.addSubview(resultsScreen);
        resultsScreen.on('InputSelect', bind(this, function (evt) {
            evt.cancel(); // stop the event from propagating (so we don't shoot a blade)
            resultsScreen.removeFromSuperview();
            this.day += 1;
            if (this.day > 6) {
                this.getSuperview().emit('titleScreen:craft');
            } else {
                this.build();
                this.emit('play:start');
            }
        }));
    };
});

function play_game () {
    this.interval = setInterval(spawnSheep.bind(this), constants.days[this.day].sheepFrequency);
    this.diamondInterval = setInterval(spawnDiamond.bind(this), 10000);

    this.timer = new Timer({
        x: 0,
        y: 0,
        width: 1024,
        height: constants.fenceSize
    });
    this.addSubview(this.timer);
    this.timer.run();
}

function spawnSheep () {
    var sheep, r = Math.random();
    if (r > constants.days[this.day].ramRarity) {
        sheep = new Sheep({
            x: 1024,
            y: randomLaneCoord(8)
        });
    } else {
        sheep = new Ram({
            x: 1024,
            y: randomLaneCoord(7)
        });
    }

    this.addSubview(sheep);
    this.sheep.push(sheep);
    sheep.run();
}

function spawnDiamond () {
    this.diamond = new Diamond({
        x: 1024,
        y: randomLaneCoord(8)
    });

    this.addSubview(this.diamond);
    this.diamond.run();
}

function launchBlade () {
    if (this.bladeOut) {
        return;
    }
    var blade = new Blade({
        x: this.clipper.style.x + this.clipper.style.width,
        y: this.clipper.style.y + 3
    });
    this.addSubview(blade);
    this.bladeOut = true;
    blade.run();
};

// return a random y-coordinate for the lane
function randomLaneCoord (numLanes) {
    return laneCoord(Math.floor(Math.random()*numLanes));
}

function laneCoord (index) {
    return (index * constants.laneSize) + constants.fenceSize;
}
