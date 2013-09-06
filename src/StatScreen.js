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
            x: 192,
            y: 0,
            width: 640,
            height: 80,
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
        this.tabs.ewes.addSubview(new ImageView({
            x: 190,
            y: 40,
            width: 780,
            height: 325,
            image: 'resources/images/statistics-ewes.png'
        }));

        // labels for number of ewes sheared
        var i = 0, startX = 195, gap = 130, total = 0, current,
            colors = constants.colors.concat([constants.COLOR_GOLD]);
        for (i; i < colors.length; i++) {
            current = GC.app.player.stats.get('ewesSheared.' + colors[i].label).value;
            this.tabs.ewes.addSubview(new TextView({
                x: startX + i*gap,
                y: 194,
                width: 120,
                height: 28,
                color: '#333333',
                fontFamily: 'delius',
                text: '' + current
            }));
            total += current;
        }
        this.tabs.ewes.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-1.png'
        }));
        this.tabs.ewes.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + total
        }));
        this.tabs.rams.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-2.png'
        }));
        this.tabs.rams.addSubview(new ImageView({
            x: 190,
            y: 40,
            width: 780,
            height: 325,
            image: 'resources/images/statistics-rams.png'
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
                color: '#333333',
                fontFamily: 'delius',
                text: '' + current
            }));
            total += current;
        }
        this.tabs.rams.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + total
        }));
        this.tabs.wool.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-3.png'
        }));
        this.tabs.wool.addSubview(new ImageView({
            x: 190,
            y: 40,
            width: 780,
            height: 325,
            image: 'resources/images/statistics-wool.png'
        }));

        // labels for number of bolt collected
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
                color: '#333333',
                fontFamily: 'delius',
                text: '' + current
            }));
            total += current;
        }
        this.tabs.wool.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + total
        }));
        this.tabs.crafts.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-4.png'
        }));
        this.tabs.crafts.addSubview(new ImageView({
            x: 190,
            y: 40,
            width: 780,
            height: 325,
            image: 'resources/images/statistics-crafts.png'
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
                color: '#333333',
                fontFamily: 'delius',
                text: '' + current
            }));
            total += current;
        }
        this.tabs.crafts.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + total
        }));
        this.tabs.misc.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-5.png'
        }));
        this.tabs.misc.addSubview(new ImageView({
            x: 370,
            y: 40,
            width: 420,
            height: 325,
            image: 'resources/images/statistics-misc.png'
        }));

        // labels for misc stats
        this.tabs.misc.addSubview(new TextView({
            x: 435,
            y: 194,
            width: 120,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + GC.app.player.stats.get('diamonds').value
        }));
        this.tabs.misc.addSubview(new TextView({
            x: 605,
            y: 194,
            width: 120,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + GC.app.player.stats.get('batteries').value
        }));
        this.tabs.misc.addSubview(new TextView({
            x: 400,
            y: 320,
            width: 360,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            text: '' + GC.app.player.stats.get('coinsEarned').value
        }));

    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});
