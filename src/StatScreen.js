import ui.ImageView as ImageView;
import src.Button as Button;
import src.util as util;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: "resources/images/statistics.png"
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        var backButton = new Button({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80
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