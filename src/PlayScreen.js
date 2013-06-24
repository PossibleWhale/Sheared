import device;
import ui.ImageView as ImageView;
import src.Sheep as Sheep;
import src.Ram as Ram;
import src.Clipper as Clipper;
import src.Blade as Blade;
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

        this.day = 6;
        this.sheep = [];
        this.build();
    };

    this.build = function () {
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

    this.gameOver = function (text) {
        var gameOverScreen, i = this.sheep.length;

        while (i--) {
            clearInterval(this.sheep[i].interval);
        }
        if (this.blade) {
            clearInterval(this.blade.interval);
        }
        clearInterval(this.interval);

        this.removeAllSubviews();
        gameOverScreen = new TextView({
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            text: text || 'You lost',
            size: 42,
            color: '#FFFFFF',
            backgroundColor: '#000000'
        });
        this.addSubview(gameOverScreen);
        this.removeAllListeners();
        gameOverScreen.on('InputSelect', bind(this, function () {
            this.getSuperview().emit('titleScreen:craft');
        }));
    };

    this.timeOver = function () {
        // TODO show results and go to next "day"
        this.gameOver('You beat the level!');
    };
});

function play_game () {
    this.interval = setInterval(spawnSheep.bind(this), constants.days[this.day].sheepFrequency);

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
    if (r > 0.5) {
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
