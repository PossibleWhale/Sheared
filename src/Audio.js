import AudioManager;

var numShears = 6;

exports = Class(function () {
    this.init = function () {
        this.audioPlayer = new AudioManager({
            path: 'resources/sounds'
        });

        var i, name;
        for (i = 1; i <= numShears; i++) {
            name = 'shear-0' + i;
            this.audioPlayer.addSound(name, {
                path: name + '.mp3'
            });
        }
    };

    this.playShear = function () {
        var index = Math.floor(Math.random() * numShears) + 1;
        this.audioPlayer.play('shear-0' + index);
    };
});
