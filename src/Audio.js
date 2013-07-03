import AudioManager;

exports = Class(function () {
    this.init = function () {
        this.audioPlayer = new AudioManager({
            path: 'resources/sounds',
            files: {
                'pickup-battery': {},
                'pickup-diamond': {},
                'shear-01': {},
                'shear-02': {},
                'shear-03': {},
                'collision-01': {},
                'collision-02': {},
                'collision-regularblade-ram': {},
                'baa-01': {},
                'baa-02': {},
                'baa-03': {},
                'button-01': {},
                'play-01': {background: true},
                'play-02': {background: true},
                'play-5-seconds-remaining': {}
            }
        });
    };

    this.playShear = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.audioPlayer.play('shear-0' + index);
    };

    this.playBattery = function () {
        this.audioPlayer.play('pickup-battery');
    };

    this.playDiamond = function () {
        this.audioPlayer.play('pickup-diamond');
    };

    this.playCollision = function () {
        var index = Math.random() > 0.5 ? 1 : 2;
        this.audioPlayer.play('collision-0' + index);
    };

    this.playRamHit = function () {
        this.audioPlayer.play('collision-regularblade-ram');
    };

    this.playBaa = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.audioPlayer.play('shear-0' + index);
    };

    this.playButton = function () {
        this.audioPlayer.play('button-01');
    };

    this.playMusic = function () {
        this.audioPlayer.play('play-01');
    };

    this.stopMusic = function () {
        this.audioPlayer.stop('play-01');
    };

    this.playCountdown = function () {
        this.audioPlayer.play('play-5-seconds-remaining');
    };
});
