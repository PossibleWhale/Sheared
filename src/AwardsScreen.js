import ui.View as View;
import ui.TextView as TextView;
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

        this._buildTab('ewes');
        this._buildTab('rams');
        this._buildTab('wool');
        this._buildTab('crafts');
        this._buildTab('misc');
    };

    this._buildTab = function (tab) {
        var view = new View({
            x: 0,
            y: 0,
            width: 640,
            height: 1500
        });
        var key, star, yIndex = 0, totalHeight = 0, prefix;
        for (key in constants.AWARDS) {
            prefix = key.split('.')[0];
            if (constants.AWARDS.hasOwnProperty(key) && (prefix === tab ||
                (tab === 'misc' && prefix !== 'ewes' && prefix !== 'rams' && prefix !== 'wool' && prefix !== 'crafts'))) {
                star = new ImageView({
                    superview: view,
                    x: 20,
                    y: yIndex,
                    width: 30,
                    height: 30
                });
                if (GC.app.player.awards.get(key).value) {
                    star.setImage('resources/images/gold-star-award.png');
                } else {
                    star.setImage('resources/images/gold-star-empty.png');
                }

                view.addSubview(new TextView({
                    x: 60,
                    y: yIndex,
                    width: 460,
                    height: 30,
                    horizontalAlign: 'left',
                    color: '#333333',
                    fontFamily: 'delius',
                    text: constants.AWARDS[key].text
                }));

                view.addSubview(new TextView({
                    x: 580,
                    y: yIndex,
                    width: 50,
                    height: 30,
                    horizontalAlign: 'right',
                    color: '#333333',
                    fontFamily: 'delius',
                    size: 20,
                    text: '' + constants.AWARDS[key].reward
                }));

                yIndex += 50;
                totalHeight += 50;
            }
        }
        var scrollView = new ScrollView({
            superview: this.tabs[tab],
            x: 183,
            y: 46,
            scrollX: false,
            width: 640,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: totalHeight
            }
        });
        scrollView.addSubview(view);
    };

    this.switchTab = function (key) {
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});
