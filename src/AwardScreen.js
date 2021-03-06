import ui.resource.Image as Image;
import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import ui.ScrollView as ScrollView;

import src.constants as constants;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.util as util;

var filledStar = new Image({url: 'resources/images/gold-star-award.png'});
var emptyStar = new Image({url: 'resources/images/gold-star-empty.png'});
var ewero = new Image({url: 'resources/images/award-ewero.png'});

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
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
            width: 624,
            height: 64,
            image: 'resources/images/header-awards.png'
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

        // sound toggle button
        this.muteButton = new MuteButton({
            superview: this,
            x: 952,
            y: 8,
            zIndex: 9999,
            width: 64,
            height: 64
        });

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
            image: 'resources/images/tab-label-misc.png'
        });
        miscTab.on('InputSelect', bind(this, function () {
            this.switchTab('misc');
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
        backButton.on('InputSelect', bind(this, function () {
            this.emit('awards:back');
        }));

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
            this._buildTab('ewes');
            this._buildTab('rams');
            this._buildTab('wool');
            this._buildTab('crafts');
            this._buildTab('misc');
            this.tabs.ewes.addSubview(new ImageView({
                x: 33,
                y: 33,
                width: 137,
                height: 350,
                image: 'resources/images/tab-1.png'
            }));
            // rams
            this.tabs.rams.addSubview(new ImageView({
                x: 33,
                y: 33,
                width: 137,
                height: 350,
                image: 'resources/images/tab-2.png'
            }));
            // wool
            this.tabs.wool.addSubview(new ImageView({
                x: 33,
                y: 33,
                width: 137,
                height: 350,
                image: 'resources/images/tab-3.png'
            }));
            // crafts
            this.tabs.crafts.addSubview(new ImageView({
                x: 33,
                y: 33,
                width: 137,
                height: 350,
                image: 'resources/images/tab-4.png'
            }));
            // misc
            this.tabs.misc.addSubview(new ImageView({
                x: 33,
                y: 33,
                width: 137,
                height: 350,
                image: 'resources/images/tab-5.png'
            }));
        }));

        this.on('ViewDidDisappear', bind(this, function () {
            this.tabs.ewes.removeAllSubviews();
            this.tabs.rams.removeAllSubviews();
            this.tabs.wool.removeAllSubviews();
            this.tabs.crafts.removeAllSubviews();
            this.tabs.misc.removeAllSubviews();
        }));
    };

    this._buildTab = function (tab) {
        // ewes
        var view = new View({
            x: 0,
            y: 0,
            width: 795,
            height: 1500
        });
        var key, star, yIndex = 0, totalHeight = 0, split, prefix, lastCategory, heading;
        var isMisc = function (prefix) {
            return prefix !== 'ewes' && prefix !== 'rams' && prefix !== 'wool' && prefix !== 'crafts';
        };
        for (key in constants.AWARDS) {
            split = key.split('.');
            prefix = split[0];
            category = split[1];
            if (constants.AWARDS.hasOwnProperty(key) && (prefix === tab ||
                (tab === 'misc' && isMisc(prefix)))) {

                if (!isNaN(parseInt(category)) && !isMisc(prefix)) {
                    category = 'general';
                } else if (prefix === 'crafts' || isMisc(prefix)) {
                    /* special cases -- make these look better */
                    if (prefix === 'bladepower') {
                        prefix = 'Blade Power';
                    } else if (prefix === 'power') {
                        prefix = 'Clipper Power';
                    }
                    category = prefix;
                }
                if (lastCategory !== category) {
                    heading = new TextView({
                        superview: view,
                        x: 20,
                        y: yIndex,
                        width: 460,
                        height: 30,
                        horizontalAlign: 'left',
                        color: '#352e29',
                        fontFamily: 'delius',
                        size: 24,
                    });
                    if (category === prefix) {
                        heading.setText(util.capitalize(prefix));
                    } else {
                        heading.setText(util.capitalize(prefix) +
                              ' (' + util.capitalize(category) + ')');
                    }
                    lastCategory = category;
                    yIndex += 50;
                    totalHeight += 50;
                }

                if (GC.app.player.awards.get(key).value) {
                    star = new ImageView({
                        superview: view,
                        x: 20,
                        y: yIndex,
                        width: 30,
                        height: 30,
                        image: filledStar
                    });
                } else {
                    star = new ImageView({
                        superview: view,
                        x: 20,
                        y: yIndex,
                        width: 30,
                        height: 30,
                        image: emptyStar
                    });
                }

                view.addSubview(new TextView({
                    x: 60,
                    y: yIndex,
                    width: 460,
                    height: 28,
                    horizontalAlign: 'left',
                    color: '#6b5e53',
                    fontFamily: 'delius',
                    size: 22,
                    text: constants.AWARDS[key].text
                }));

                view.addSubview(new TextView({
                    x: 690,
                    y: yIndex,
                    width: 50,
                    height: 28,
                    horizontalAlign: 'right',
                    color: '#6b5e53',
                    fontFamily: 'delius',
                    size: 22,
                    text: '' + constants.AWARDS[key].reward
                }));

                view.addSubview(new ImageView({
                    x: 750,
                    y: yIndex,
                    width: 30,
                    height: 30,
                    image: ewero
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
            width: 795,
            height: 324,
            scrollBounds: {
                minY: 0,
                maxY: totalHeight
            }
        });
        scrollView.addSubview(view);
    };

    this.switchTab = function (key) {
        GC.app.audio.playTab();
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };
});
