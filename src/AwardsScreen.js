import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.constants as constants;
import src.Button as Button;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            image: 'resources/images/awards.png'
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        this.tabs = {
            ewes: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/awards-ewes.png'
            }),
            rams: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/awards-rams.png'
            }),
            wool: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/awards-wool.png'
            }),
            crafts: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/awards-crafts.png'
            }),
            misc: new ImageView({
                x: 0,
                y: 80,
                width: 1024,
                height: 416,
                image: 'resources/images/awards-misc.png'
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
            y: 253,
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
            y: 323,
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
            y: 393,
            zIndex: 99,
            width: 137,
            height: 64
        });
        miscTab.on('InputSelect', bind(this, function () {
            this.switchTab('misc');
        }));

        var backButton = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 80,
            height: 80,
            image: 'resources/images/button-return.png'
        });
        backButton.on('InputSelect', bind(this, function () {
            this.emit('awards:back');
        }));
    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});
