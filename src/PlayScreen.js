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

        console.log(this.style.width);
        console.log(this.style.height);

        this.build();
    };

    this.build = function () {
        this.on('play:start', bind(this, play_game));
    };
});

function play_game () {
    this.interval = setInterval(spawnSheep.bind(this), 1000);
};

function spawnSheep () {
    var sheep = new Sheep({
        x: device.width - 98,
        y: Math.random()*(device.width-65) 
    });
    this.addSubview(sheep);
    sheep.run();
}
