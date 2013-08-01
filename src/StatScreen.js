import ui.ImageView as ImageView;
import src.Button as Button;
import src.util as util;
import src.constants as constants;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/statistics.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var backButton = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-return.png'
        });
        util.reissue(backButton, 'InputSelect', this, 'stats:back');

        this.tabs = {
            ewes:
                new ImageView({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416,
                    image: 'resources/images/statistics-ewes.png'
                }),
            rams:
                new ImageView({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416,
                    image: 'resources/images/statistics-rams.png'
                }),
            wool:
                new ImageView({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416,
                    image: 'resources/images/statistics-wool.png'
                }),
            crafts:
                new ImageView({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416,
                    image: 'resources/images/statistics-crafts.png'
                }),
            misc:
                new ImageView({
                    x: 0,
                    y: 80,
                    width: 1024,
                    height: 416,
                    image: 'resources/images/statistics-misc.png'
                })
        };

        // labels for number of ewes sheared
        var i = 0, startX = 195, gap = 162, total = 0, current;
        for (i; i < constants.colors.length; i++) {
            current = GC.app.player.stats.get('ewesSheared.' + constants.colors[i].label).value;
            this.tabs.ewes.addSubview(new Button({
                x: startX + i*gap,
                y: 194,
                width: 120,
                height: 40,
                text: '' + current
            }));
            total += current;
        }
        this.tabs.ewes.addSubview(new Button({
            x: 400,
            y: 320,
            width: 360,
            height: 40,
            text: '' + total
        }));

        // labels for number of rams sheared
        i = 0;
        startX = 195;
        gap = 162;
        total = 0;
        for (i; i < constants.colors.length; i++) {
            current = GC.app.player.stats.get('ramsSheared.' + constants.colors[i].label).value;
            this.tabs.rams.addSubview(new Button({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 40,
                text: '' + current
            }));
            total += current;
        }
        this.tabs.rams.addSubview(new Button({
            x: 400,
            y: 320,
            width: 360,
            height: 40,
            text: '' + total
        }));

        // labels for number of bolt collected
        i = 0;
        startX = 195;
        gap = 162;
        total = 0;
        for (i; i < constants.colors.length; i++) {
            current = GC.app.player.stats.get('wool.' + constants.colors[i].label).value;
            this.tabs.wool.addSubview(new Button({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 40,
                text: '' + current
            }));
            total += current;
        }
        this.tabs.wool.addSubview(new Button({
            x: 400,
            y: 320,
            width: 360,
            height: 40,
            text: '' + total
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
            this.tabs.crafts.addSubview(new Button({
                x: startX + i*gap,
                y: 220,
                width: 120,
                height: 40,
                text: '' + current
            }));
            total += current;
        }
        this.tabs.crafts.addSubview(new Button({
            x: 400,
            y: 320,
            width: 360,
            height: 40,
            text: '' + total
        }));

        // labels for misc stats
        this.tabs.misc.addSubview(new Button({
            x: 435,
            y: 194,
            width: 120,
            height: 40,
            text: '' + GC.app.player.stats.get('diamonds').value
        }));
        this.tabs.misc.addSubview(new Button({
            x: 605,
            y: 194,
            width: 120,
            height: 40,
            text: '' + GC.app.player.stats.get('batteries').value
        }));
        this.tabs.misc.addSubview(new Button({
            x: 400,
            y: 320,
            width: 360,
            height: 40,
            text: '' + GC.app.player.stats.get('coinsEarned').value
        }));

        this.currentTab = this.tabs.ewes;
        this.addSubview(this.currentTab);

        var ewesTab = new Button({
            superview: this,
            x: 33,
            y: 113,
            zIndex: 99,
            width: 137,
            height: 64
        });
        ewesTab.on('InputSelect', bind(this, function () {
            this.switchTab('ewes');
        }));

        var ramsTab = new Button({
            superview: this,
            x: 33,
            y: 183,
            zIndex: 99,
            width: 137,
            height: 64
        });
        ramsTab.on('InputSelect', bind(this, function () {
            this.switchTab('rams');
        }));

        var woolTab = new Button({
            superview: this,
            x: 33,
            y: 255,
            zIndex: 99,
            width: 137,
            height: 64
        });
        woolTab.on('InputSelect', bind(this, function () {
            this.switchTab('wool');
        }));

        var craftsTab = new Button({
            superview: this,
            x: 33,
            y: 327,
            zIndex: 99,
            width: 137,
            height: 64
        });
        craftsTab.on('InputSelect', bind(this, function () {
            this.switchTab('crafts');
        }));

        var miscTab = new Button({
            superview: this,
            x: 33,
            y: 399,
            zIndex: 99,
            width: 137,
            height: 64
        });
        miscTab.on('InputSelect', bind(this, function () {
            this.switchTab('misc');
        }));
    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});
