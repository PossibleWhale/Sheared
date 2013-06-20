import device;
import ui.ImageView as ImageView;
import src.Sheep as Sheep;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/play-dev.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {
        this.on('play:start', bind(this, play_game));
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
    sheep.run();
}

// return a random y-coordinate for the lane
function randomLaneCoord () {
    // 80px fence
    // 52px lane
    return ((Math.floor(Math.random()*8)) * 52) + 80;
};
