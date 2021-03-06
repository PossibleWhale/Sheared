import AudioManager;
import src.constants as c;

exports = Class(AudioManager, function (supr) {
    this.init = function () {
        var opts = {
            path: 'resources/sounds',
            files: {
                'music-play-01': {volume: 0.8, background: true},
                'music-play-02': {volume: 0.8, background: true},
                'music-play-03': {volume: 0.8, background: true},
                'music-title': {volume: 0.8, background: true},
                'pickup-battery': {},
                'pickup-diamond': {},
                'shear-01': {},
                'shear-02': {},
                'shear-03': {},
                'shear-gold': {},
                'collision-01': {},
                'collision-02': {},
                'collision-regularblade-ram': {},
                'collision-pig': {},
                'baa-01': {volume: 0.25},
                'baa-02': {volume: 0.25},
                'baa-03': {volume: 0.25},
                'button-01': {},
                'play-5-seconds-remaining': {},
                'crafting-01': {},
                'crafting-02': {},
                'crafting-03': {},
                'crafting-04': {},
                'store-purchase': {},
                'tab': {},
                'pig-01': {},
                'pig-02': {}
            }
        };
        supr(this, 'init', [opts]);
    };

    this.setMutedFromFlag = function _a_setMutedFromFlag(flag) {
        if (flag === c.AUDIO_STATES.mute) {
            this.setMusicMuted(true);
            this.setEffectsMuted(true);
        } else if (flag === c.AUDIO_STATES.sfx) {
            this.setMusicMuted(true);
            this.setEffectsMuted(false);
        } else if (flag === c.AUDIO_STATES.sfxMusic) {
            this.setMusicMuted(false);
            this.setEffectsMuted(false);
        }
    };

    this.playMusic = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.music = 'music-play-0' + index;
        this.play(this.music);
    };

    this.playTitle = function () {
        this.music = 'music-title';
        this.play('music-title');
    };

    this.playShear = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.play('shear-0' + index);
    };

    this.playGoldShear = function () {
        this.play('shear-gold');
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

    this.playCollisionPig = function () {
        this.play('collision-pig');
    };

    this.playRamHit = function () {
        this.play('collision-regularblade-ram');
    };

    this.playBaa = function () {
        var index = Math.floor(Math.random() * 3) + 1;
        this.play('baa-0' + index);
    };

    this.playOink = function () {
        var index = Math.floor(Math.random() * 2) + 1;
        this.play('pig-0' + index);
    };

    this.playButton = function () {
        this.play('button-01');
    };


    this.stopMusic = function () {
        if (this.music) {
            this.stop(this.music);
        }
    };

    this.playCountdown = function () {
        this.play('play-5-seconds-remaining');
    };

    this.playBuyGarment = function () {
        var index = Math.floor(Math.random() * 4) + 1;
        this.play('crafting-0' + index);
        this.playGoldShear();
    };

    this.playPurchase = function () {
        this.play('store-purchase');
    };

    this.playTab = function () {
        this.play('tab');
    };
});
