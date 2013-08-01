import ui.ImageView as ImageView;
import ui.ScrollView as ScrollView; 
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

        this._buildEwesTab();
        this._buildRamsTab();
        this._buildWoolTab();
        this._buildCraftsTab();
        this._buildMiscTab();
    };

    this._buildEwesTab = function () {
        var scrollView = new ScrollView({
            superview: this.tabs.ewes,
            x: 183,
            y: 46,
            scrollX: false,
            width: 530,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: 1500
            }
        });
        scrollView.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 530,
            height: 1500,
            image: 'resources/images/awards-ewes-content.png'
        }));
    };

    this._buildRamsTab = function () {
        var scrollView = new ScrollView({
            superview: this.tabs.rams,
            x: 183,
            y: 46,
            scrollX: false,
            width: 530,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: 1500
            }
        });
        scrollView.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 530,
            height: 1500,
            image: 'resources/images/awards-rams-content.png'
        }));
    };

    this._buildWoolTab = function () {
        var scrollView = new ScrollView({
            superview: this.tabs.wool,
            x: 183,
            y: 46,
            scrollX: false,
            width: 530,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: 1500
            }
        });
        scrollView.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 530,
            height: 1500,
            image: 'resources/images/awards-wool-content.png'
        }));
    };

    this._buildCraftsTab = function () {
        var scrollView = new ScrollView({
            superview: this.tabs.crafts,
            x: 183,
            y: 46,
            scrollX: false,
            width: 530,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: 490
            }
        });
        scrollView.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 530,
            height: 490,
            image: 'resources/images/awards-crafts-content.png'
        }));
    };

    this._buildMiscTab = function () {
        var scrollView = new ScrollView({
            superview: this.tabs.misc,
            x: 183,
            y: 46,
            scrollX: false,
            width: 530,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: 1250
            }
        });
        scrollView.addSubview(new ImageView({
            x: 0,
            y: 0,
            width: 530,
            height: 1250,
            image: 'resources/images/awards-misc-content.png'
        }));
    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});
