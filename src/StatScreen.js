import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.util as util;
import src.constants as constants;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 1024,
            height: 576
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        // header image
        this.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 1024,
            height: 80,
            image: 'resources/images/background-header-wood.png'
        }));

        // footer image
        this.addSubview(new ImageView({
            x: 0,
            y: 496,
            width: 1024,
            height: 80,
            image: 'resources/images/background-footer-wood.png'
        }));

        // header title
        this.addSubview(new ImageView({
            x: 200,
            y: 8,
            width:  624,
            height:  64,
            image: 'resources/images/header-statistics.png'
        }));

        // background image
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/background-wood.png'
        }));

        // tab background image
        this.addSubview(new ImageView({
            x: 0,
            y: 80,
            width: 1024,
            height: 416,
            image: 'resources/images/tab-0.png'
        }));

        var backButton = new Button({
            superview: this,
            x: 8,
            y: 8,
            width: 64,
            height: 64,
            click: true,
            image: 'resources/images/button-return.png'
        });
        util.reissue(backButton, 'InputSelect', this, 'stats:back');

        this.addSubview(new MuteButton({
            x: 952,
            y: 8,
            zIndex: 9999,
            width: 64,
            height: 64
        }));

        this.tabs = {
            ewes: new View({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416
            }),
            rams: new View({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416
            }),
            wool: new View({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416
            }),
            crafts: new View({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416
            }),
            misc: new View({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416
            })
        };

        this.currentTab = this.tabs.ewes;
        this.addSubview(this.currentTab);

        var ewesTab = new Button({
            superview: this,
            x: 33,
            y: 113,
            zIndex: 99,
            width: 135,
            height: 68,
            click: true,
            image: 'resources/images/tab-label-ewes.png'
        });
        ewesTab.on('InputSelect', bind(this, function () {
            this.switchTab('ewes');
        }));

        var ramsTab = new Button({
            superview: this,
            x: 33,
            y: 184,
            zIndex: 99,
            width: 135,
            height: 68,
            click: true,
            image: 'resources/images/tab-label-rams.png'
        });
        ramsTab.on('InputSelect', bind(this, function () {
            this.switchTab('rams');
        }));

        var woolTab = new Button({
            superview: this,
            x: 33,
            y: 254,
            zIndex: 99,
            width: 135,
            height: 68,
            click: true,
            image: 'resources/images/tab-label-wool.png'
        });
        woolTab.on('InputSelect', bind(this, function () {
            this.switchTab('wool');
        }));

        var craftsTab = new Button({
            superview: this,
            x: 33,
            y: 324,
            zIndex: 99,
            width: 135,
            height: 68,
            click: true,
            image: 'resources/images/tab-label-crafts.png'
        });
        craftsTab.on('InputSelect', bind(this, function () {
            this.switchTab('crafts');
        }));

        var miscTab = new Button({
            superview: this,
            x: 33,
            y: 395,
            zIndex: 99,
            width: 135,
            height: 68,
            click: true,
            image: 'resources/images/tab-label-misc.png' 
        });
        miscTab.on('InputSelect', bind(this, function () {
            this.switchTab('misc');
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this._buildTabs();
        }));

        this.on('ViewDidDisappear', bind(this, function () {
            var tab;
            for (tab in this.tabs) {
                if (this.tabs.hasOwnProperty(tab)) {
                    this.tabs[tab].removeAllSubviews();
                }
            }
        }));
    };

    this._buildTabs = function () {
        // labels for number of ewes sheared
        var i = 0, startX = 195, gap = 130, total = 0, current,
            colors = constants.colors.concat([constants.COLOR_GOLD]);
        for (i; i < colors.length; i++) {
            current = GC.app.player.stats.get('ewesSheared.' + colors[i].label).value;
            this.tabs.ewes.addSubview(new TextView({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 28,
                color: '#6b5e53',
                fontFamily: 'delius',
                size: 22,
                text: '' + current
            }));
            total += current;
        }
        
        // ewes tab
        this.tabs.ewes.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-1.png'
        }));
        
        // ewes by color title
        this.tabs.ewes.addSubview(new TextView({
            x: 370,
            y: 54,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Ewes sheared by color'
        }));

        // ewe white
        this.tabs.ewes.addSubview(new ImageView({
            x: 216,
            y: 127,
            width: 82,
            height: 56,
            image: 'resources/images/ewe-white.png'
        }));

        // ewe red
        this.tabs.ewes.addSubview(new ImageView({
            x: 347,
            y: 127,
            width: 82,
            height: 56,
            image: 'resources/images/ewe-red.png'
        }));

        // ewe blue
        this.tabs.ewes.addSubview(new ImageView({
            x: 474,
            y: 127,
            width: 82,
            height: 56,
            image: 'resources/images/ewe-blue.png'
        }));

        // ewe yellow
        this.tabs.ewes.addSubview(new ImageView({
            x: 607,
            y: 127,
            width: 82,
            height: 56,
            image: 'resources/images/ewe-yellow.png'
        }));

        // ewe black
        this.tabs.ewes.addSubview(new ImageView({
            x: 737,
            y: 127,
            width: 82,
            height: 56,
            image: 'resources/images/ewe-black.png'
        }));

        // ewe gold
        this.tabs.ewes.addSubview(new ImageView({
            x: 867,
            y: 127,
            width: 82,
            height: 56,
            image: 'resources/images/ewe-gold.png'
        }));

        // ewes total title
        this.tabs.ewes.addSubview(new TextView({
            x: 370,
            y: 272,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Total ewes sheared'
        }));

        this.tabs.ewes.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + total
        }));

        this.tabs.rams.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-2.png'
        }));

        // rams by color title
        this.tabs.rams.addSubview(new TextView({
            x: 370,
            y: 54,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Rams sheared by color'
        }));

        // ram white
        this.tabs.rams.addSubview(new ImageView({
            x: 198,
            y: 101,
            width: 117,
            height: 108,
            image: 'resources/images/ram-white.png'
        }));

        // ram red
        this.tabs.rams.addSubview(new ImageView({
            x: 329,
            y: 101,
            width: 117,
            height: 108,
            image: 'resources/images/ram-red.png'
        }));

        // ram blue
        this.tabs.rams.addSubview(new ImageView({
            x: 456,
            y: 101,
            width: 117,
            height: 108,
            image: 'resources/images/ram-blue.png'
        }));

        // ram yellow
        this.tabs.rams.addSubview(new ImageView({
            x: 589,
            y: 101,
            width: 117,
            height: 108,
            image: 'resources/images/ram-yellow.png'
        }));

        // ram black
        this.tabs.rams.addSubview(new ImageView({
            x: 719,
            y: 101,
            width: 117,
            height: 108,
            image: 'resources/images/ram-black.png'
        }));

        // ram gold
        this.tabs.rams.addSubview(new ImageView({
            x: 850,
            y: 101,
            width: 117,
            height: 108,
            image: 'resources/images/ram-gold.png'
        }));

        // rams total title
        this.tabs.rams.addSubview(new TextView({
            x: 370,
            y: 272,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Total rams sheared'
        }));

        // labels for number of rams sheared
        i = 0;
        startX = 195;
        gap = 130;
        total = 0;
        for (i; i < colors.length; i++) {
            current = GC.app.player.stats.get('ramsSheared.' + colors[i].label).value;
            this.tabs.rams.addSubview(new TextView({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 28,
                color: '#6b5e53',
                fontFamily: 'delius',
                size: 22,
                text: '' + current
            }));
            total += current;
        }
        this.tabs.rams.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + total
        }));

        this.tabs.wool.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-3.png'
        }));

        // wool by color title
        this.tabs.wool.addSubview(new TextView({
            x: 370,
            y: 54,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Wool collected by color'
        }));

        // wool white
        this.tabs.wool.addSubview(new ImageView({
            x: 223,
            y: 123,
            width: 64,
            height: 64,
            image: 'resources/images/wool-white.png'
        }));

        // wool red
        this.tabs.wool.addSubview(new ImageView({
            x: 386,
            y: 123,
            width: 64,
            height: 64,
            image: 'resources/images/wool-red.png'
        }));

        // wool blue
        this.tabs.wool.addSubview(new ImageView({
            x: 549,
            y: 123,
            width: 64,
            height: 64,
            image: 'resources/images/wool-blue.png'
        }));

        // wool yellow
        this.tabs.wool.addSubview(new ImageView({
            x: 711,
            y: 123,
            width: 64,
            height: 64,
            image: 'resources/images/wool-yellow.png'
        }));

        // wool black
        this.tabs.wool.addSubview(new ImageView({
            x: 874,
            y: 123,
            width: 64,
            height: 64,
            image: 'resources/images/wool-black.png'
        }));

        // wool total title
        this.tabs.wool.addSubview(new TextView({
            x: 370,
            y: 272,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Total wool collected'
        }));

        // labels for number of wool collected
        i = 0;
        startX = 195;
        gap = 162;
        total = 0;
        for (i; i < constants.colors.length; i++) {
            current = GC.app.player.stats.get('wool.' + constants.colors[i].label).value;
            this.tabs.wool.addSubview(new TextView({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 28,
                color: '#6b5e53',
                fontFamily: 'delius',
                size: 22,
                text: '' + current
            }));
            total += current;
        }

        this.tabs.wool.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + total
        }));
        
        // tab crafts
        this.tabs.crafts.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-4.png'
        }));
        
        // crafts by type title
        this.tabs.crafts.addSubview(new TextView({
            x: 370,
            y: 54,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Crafts completed by type'
        }));

        // crafts hats
        this.tabs.crafts.addSubview(new ImageView({
            x: 215,
            y: 115,
            width: 80,
            height: 80,
            image: 'resources/images/hat-disabled.png'
        }));

        // crafts mittens
        this.tabs.crafts.addSubview(new ImageView({
            x: 378,
            y: 113,
            width: 80,
            height: 80,
            image: 'resources/images/mitten-disabled.png'
        }));

        // crafts socks
        this.tabs.crafts.addSubview(new ImageView({
            x: 541,
            y: 115,
            width: 80,
            height: 80,
            image: 'resources/images/sock-disabled.png'
        }));

        // crafts scarves
        this.tabs.crafts.addSubview(new ImageView({
            x: 703,
            y: 115,
            width: 80,
            height: 80,
            image: 'resources/images/scarf-disabled.png'
        }));

        // crafts sweaters
        this.tabs.crafts.addSubview(new ImageView({
            x: 866,
            y: 115,
            width: 80,
            height: 80,
            image: 'resources/images/sweater-disabled.png'
        }));

        // crafts total title
        this.tabs.crafts.addSubview(new TextView({
            x: 370,
            y: 272,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Total crafts completed'
        }));

        // labels for craft counts
        i = 0;
        total = 0;
        current = 0;
        for (i; i < constants.garments.length; i++) {
            GC.app.player.crafts.loopGarment(constants.garments[i].label,
                function (i, j, data) {
                    current += data.count;
                });
            this.tabs.crafts.addSubview(new TextView({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 28,
                color: '#6b5e53',
                fontFamily: 'delius',
                size: 22,
                text: '' + current
            }));
            total += current;
        }
        
        this.tabs.crafts.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + total
        }));
        
        this.tabs.misc.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-5.png'
        }));

        // pickups by type title
        this.tabs.misc.addSubview(new TextView({
            x: 370,
            y: 54,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Pickups collected by type'
        }));

        // misc diamonds
        this.tabs.misc.addSubview(new ImageView({
            x: 469,
            y: 128,
            width:  54,
            height: 54,
            image: 'resources/images/diamond.png'
        }));

        // misc battery
        this.tabs.misc.addSubview(new ImageView({
            x: 649,
            y: 128,
            width:  34,
            height: 54,
            image: 'resources/images/battery.png'
        }));

        // eweros total title
        this.tabs.misc.addSubview(new TextView({
            x: 370,
            y: 272,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Total eweros earned'
        }));

        // labels for misc stats
        this.tabs.misc.addSubview(new TextView({
            x: 435,
            y: 194,
            width: 120,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + GC.app.player.stats.get('diamonds').value
        }));

        this.tabs.misc.addSubview(new TextView({
            x: 605,
            y: 220,
            width: 120,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + GC.app.player.stats.get('batteries').value
        }));

        this.tabs.misc.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 22,
            text: '' + GC.app.player.stats.get('coinsEarned').value
        }));

    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});