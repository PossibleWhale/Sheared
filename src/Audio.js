import AudioManager;

exports = Class(function () {
    this.init = function () {
        this.audioPlayer = new AudioManager({
            path: 'resources/sounds',
            files: {
            }
        });

        var i;
        for (i = 1; i <= 6; i++) {
            this.audioPlayer.addSound('shear-0' + i);
        }
    };

    this.playShear = function () {
        var index = Math.floor(Math.random() * 6) + 1;
        this.audioPlayer.play('shear-0' + index);
    };
});
