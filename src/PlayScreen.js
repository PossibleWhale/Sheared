import device;
import ui.ImageView as ImageView;
import src.Sheep as Sheep;
import src.Clipper as Clipper;
import src.Blade as Blade;
import src.Inventory as Inventory;
import ui.TextView as TextView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play-dev.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);

        this.inventory = new Inventory();

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

    this.gameOver = function () {
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
            text: 'You lost',
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
});

function play_game () {
    this.interval = setInterval(spawnSheep.bind(this), 1000);
}

function spawnSheep () {
    var sheep = new Sheep({
        x: 1024,
        y: randomLaneCoord()
    });
    this.addSubview(sheep);
    this.sheep.push(sheep);
    sheep.run();
}

function launchBlade () {
    var blade = new Blade({
        x: this.clipper.style.x + this.clipper.style.width,
        y: this.clipper.style.y + 3
    });
    this.addSubview(blade);
    blade.run();
};

// return a random y-coordinate for the lane
function randomLaneCoord () {
    return laneCoord(Math.floor(Math.random()*8));
}

function laneCoord (index) {
    // 80px fence
    // 52px lane
    return (index * 52) + 80;
}
