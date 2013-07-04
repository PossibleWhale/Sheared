import AudioManager;

exports = Class(AudioManager, function (supr) {
    this.init = function () {
        var opts = {
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
        };
        supr(this, 'init', [opts]);
    };

    this.playShear = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.play('shear-0' + index);
    };

    this.playBattery = function () {
        this.play('pickup-battery');
    };

    this.playDiamond = function () {
        this.play('pickup-diamond');
    };

    this.playCollision = function () {
        var index = Math.random() > 0.5 ? 1 : 2;
        this.play('collision-0' + index);
    };

    this.playRamHit = function () {
        this.play('collision-regularblade-ram');
    };

    this.playBaa = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.play('shear-0' + index);
    };

    this.playButton = function () {
        this.play('button-01');
    };

    this.playMusic = function () {
        this.play('play-01');
    };

    this.stopMusic = function () {
        this.stop('play-01');
    };

    this.playCountdown = function () {
        this.play('play-5-seconds-remaining');
    };

    this.playBuyGarment = function () {
        var index = Math.floor(Math.random() * 4) + 1;
        this.play('crafting-0' + index);
    };

    this.playRecycle = function () {
        this.play('play-recycle');
    };
});
