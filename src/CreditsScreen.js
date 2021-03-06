import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.util as util;
import src.Button as Button
import src.MuteButton as MuteButton;

exports = Class(View, function (supr) {
    this.init = function (opts) {

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        // header
        this.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        }));

        // footer
        this.addSubview(new ImageView({
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        }));

        // title
        this.addSubview(new ImageView({
            x: 200,
            y: 8,
            width:  624,
            height:  64,
            image: 'resources/images/header-credits.png'
        }));

        // background
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/background-wood.png'
        }));

        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/tab-0.png'
        }));

        // nathan
        this.addSubview(new TextView({
            x: 402,
            y: 135,
            width: 220,
            height: 28,
            color: '#0083ca',
            strokeWidth: 2,
            strokeColor: '#000000',
            fontFamily: 'delius',
            size: 24,
            horizontalAlign: 'center',
            text: 'Nathan Cooper'
        }));

        // nathan title
        this.addSubview(new TextView({
            x: 402,
            y: 163,
            width: 220,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            horizontalAlign: 'center',
            text: 'Shepherd'
        }));

        // ashley
        this.addSubview(new TextView({
            x: 402,
            y: 205,
            width: 220,
            height: 28,
            color: '#eb2b3b',
            strokeWidth: 2,
            strokeColor: '#000000',
            fontFamily: 'delius',
            size: 24,
            horizontalAlign: 'center',
            text: 'Ashley Fisher'
        }));

        // ashley title
        this.addSubview(new TextView({
            x: 402,
            y: 233,
            width: 220,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            horizontalAlign: 'center',
            text: 'Sheep Engineering'
        }));

        // cory
        this.addSubview(new TextView({
            x: 402,
            y: 275,
            width: 220,
            height: 28,
            color: '#fff200',
            strokeWidth: 2,
            strokeColor: '#000000',
            fontFamily: 'delius',
            size: 24,
            horizontalAlign: 'center',
            text: 'Cory Dodt'
        }));

        // cory title
        this.addSubview(new TextView({
            x: 402,
            y: 307,
            width: 220,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            horizontalAlign: 'center',
            text: 'Sous Sheep'
        }));

        // music credit
        this.addSubview(new TextView({
            x: 172,
            y: 339,
            width: 680,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            wrap: true,
            horizontalAlign: 'center',
            text: 'Music: "River Valley Breakdown" by Kevin MacLeod (incompetech.com)'
        }));

        // music credit cont.
        this.addSubview(new TextView({
            x: 172,
            y: 367,
            width: 680,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            wrap: true,
            horizontalAlign: 'center',
            text: 'Licensed under Creative Commons: By Attribution 3.0'
        }));

        // special thanks
        this.addSubview(new TextView({
            x: 172,
            y: 400,
            width: 680,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            horizontalAlign: 'center',
            text: 'Special thanks to the knitters and crocheters who were the inspiration for this game.'
        }));

        // shrek
        this.addSubview(new TextView({
            x: 352,
            y: 425,
            width: 320,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 18,
            horizontalAlign: 'center',
            text: 'In memory of Shrek the sheep.'
        }));

        this.muteButton = new MuteButton({
            superview: this,
            x: 952,
            y: 8,
            zIndex: 9999,
            width: 64,
            height: 64
        });

        var backButton = new Button({
            superview: this,
            x: 8,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-return.png'
        });

        util.reissue(backButton, 'InputSelect', this, 'credits:back');

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
        }));
    };
});

