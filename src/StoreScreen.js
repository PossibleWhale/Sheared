import animate;
import plugins.billing.billing as billing;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View as View;
import src.constants as constants;
import src.Button as Button;
import src.MuteButton as MuteButton;
import src.WoolCounter as WoolCounter;
import src.Alert as Alert;
import src.CoinLabel as CoinLabel;

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
        billing.onPurchase = bind(this, function (item) {
            var name, index, split;
            split = item.split('_');
            name = split[0];
            index = parseInt(split[1]);

            if (name === 'coins') {
                GC.app.player.addCoins(constants.EWEROS_QUANTITIES[index]);
                this.coinsLabel.update();
            } else if (item === 'adFree') {
                GC.app.player.upgrades.addToUpgrade('adFree', true);
                this.adsTab.removeFromSuperview();
                this.switchTab('upgrades');
            } else if (item === 'all') {
                GC.app.player.purchased('all');
                this.updateProgressBars();
                this.updatePriceDisplays();
            }
        });

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

        this.coinsLabel = new CoinLabel({
            superview: this,
            x: 398,
            y: 504,
            stats: GC.app.player.stats
        });

        this.tabs = {
            upgrades: new View({
                x: 0,
                y: 80,
                width: 1024,
                height: 416
            }),
            wool: new View ({
                x: 0,
                y: 80,
                width: 1024,
                height: 416
            }),
            eweros: new View ({
                x: 0,
                y: 80,
                width: 1024,
                height: 416
            }),
            ads: new View ({
                x: 0,
                y: 80,
                width: 1024,
                height: 416
            })
        };
        this.currentTab = this.tabs.upgrades;
        this.addSubview(this.currentTab);

        this.woolCounts = new WoolCounter({
            superview: this,
            x: 300,
            y: 8,
            storage: GC.app.player.wool
        });

        this.muteButton = new MuteButton({
            superview: this,
            x: 952,
            y: 8,
            zIndex: 9999,
            width: 64,
            height: 64
        });

        this.on('ViewWillAppear', bind(this, function () {
            this.muteButton.setMuted({silent: true});
            this.woolCounts.matchStorage();
            this.coinsLabel.update();

            this._buildUpgradeTab();
            this._buildWoolTab();
            this._buildEwerosTab();
            this._buildAdsTab();
        }));

        this.on('ViewDidDisappear', bind(this, function () {
            var tab;
            for (tab in this.tabs) {
                if (this.tabs.hasOwnProperty(tab)) {
                    this.tabs[tab].removeAllSubviews();
                }
            }
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
            this.emit('store:back');
        }));

        craftButton = new Button({
            superview: this,
            x: 141,
            y: 506,
            width: 184,
            height: 60,
            click: true,
            image: 'resources/images/button-crafts-catalog.png'
        });
        craftButton.on('InputSelect', bind(this, function () {
            this.emit('store:craft');
        }));

        var upgradesTab = new Button({
            superview: this,
            x: 33,
            y: 113,
            zIndex: 99,
            width: 135,
            height: 68,
            image: 'resources/images/tab-label-upgrades.png'
        });
        upgradesTab.on('InputSelect', bind(this, function () {
            this.switchTab('upgrades');
        }));

        var woolTab = new Button({
            superview: this,
            x: 33,
            y: 184,
            zIndex: 99,
            width: 135,
            height: 68,
            image: 'resources/images/tab-label-wool.png'
        });
        woolTab.on('InputSelect', bind(this, function () {
            this.switchTab('wool');
        }));

        var ewerosTab = new Button({
            superview: this,
            x: 33,
            y: 254,
            zIndex: 99,
            width: 135,
            height: 68,
            image: 'resources/images/tab-label-eweros.png'
        });
        ewerosTab.on('InputSelect', bind(this, function () {
            this.switchTab('eweros');
        }));

        if (!GC.app.player.upgrades.get('adFree').value) {
            this.adsTab = new Button({
                superview: this,
                x: 33,
                y: 324,
                zIndex: 99,
                width: 135,
                height: 68,
                image: 'resources/images/tab-label-ads.png'
            });
            this.adsTab.on('InputSelect', bind(this, function () {
                this.switchTab('ads');
            }));
        }
    };

    this._buildUpgradeTab = function () {
        this.tabs.upgrades.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-1.png'
        }));
        
        // upgrades title
        this.tabs.upgrades.addSubview(new TextView({
            x: 370,
            y: 40,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Upgrades'
        }));

        // upgrades sub-title
        this.tabs.upgrades.addSubview(new TextView({
            x: 293,
            y: 76,
            width: 574,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            text: 'Purchase upgrades to improve your clipper.'
        }));

        // clipper power title
        this.tabs.upgrades.addSubview(new TextView({
            x: 242,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Clipper Power'
        }));

        // clipper power background
        this.tabs.upgrades.addSubview(new ImageView({
            x: 242,
            y: 152,
            width: 160,
            height: 91,
            image: 'resources/images/store-upgrades-background.png'
        }));

        // clipper power ewero
        this.tabs.upgrades.addSubview(new ImageView({
            x: 252,
            y: 201,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // clipper power description
        this.tabs.upgrades.addSubview(new TextView({
            x: 242,
            y: 253,
            width: 160,
            height: 100,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 18,
            verticalAlign: 'top',
            wrap: true,
            text: 'Increases the max clipper power.'
        }));

        // blade power title
        this.tabs.upgrades.addSubview(new TextView({
            x: 414,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Blade Power'
        }));

        // blade power background
        this.tabs.upgrades.addSubview(new ImageView({
            x: 414,
            y: 152,
            width: 160,
            height: 91,
            image: 'resources/images/store-upgrades-background.png'
        }));

        // blade power ewero
        this.tabs.upgrades.addSubview(new ImageView({
            x: 423,
            y: 201,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // blade power description
        this.tabs.upgrades.addSubview(new TextView({
            x: 414,
            y: 253,
            width: 160,
            height: 100,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 18,
            verticalAlign: 'top',
            wrap: true,
            text: 'Increases the number of sheep a blade single blade can shear.'
        }));

        // bolt multiplier title
        this.tabs.upgrades.addSubview(new TextView({
            x: 586,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Bolt Multiplier'
        }));

        // bolt multiplier background
        this.tabs.upgrades.addSubview(new ImageView({
            x: 586,
            y: 152,
            width: 160,
            height: 91,
            image: 'resources/images/store-upgrades-background.png'
        }));

        // bolt multiplier ewero
        this.tabs.upgrades.addSubview(new ImageView({
            x: 596,
            y: 201,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // bolt multiplier description
        this.tabs.upgrades.addSubview(new TextView({
            x: 586,
            y: 253,
            width: 160,
            height: 100,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 18,
            verticalAlign: 'top',
            wrap: true,
            text: 'Increases the amount of wool earned from shearing sheep.'
        }));

        // diamond blades title
        this.tabs.upgrades.addSubview(new TextView({
            x: 758,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Diamond Blades'
        }));

        // diamond blades background
        this.tabs.upgrades.addSubview(new ImageView({
            x: 758,
            y: 152,
            width: 160,
            height: 91,
            image: 'resources/images/store-upgrades-background.png'
        }));

        // diamond blades image
        this.tabs.upgrades.addSubview(new ImageView({
            x: 794,
            y: 162,
            width: 89,
            height: 32,
            image: 'resources/images/store-diamond-blades.png'
        }));

        // diamond blades ewero
        this.tabs.upgrades.addSubview(new ImageView({
            x: 768,
            y: 201,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // diamond blades description
        this.tabs.upgrades.addSubview(new TextView({
            x: 758,
            y: 253,
            width: 160,
            height: 100,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 18,
            verticalAlign: 'top',
            wrap: true,
            text: 'All clipper blades are diamond blades.'
        }));

        this.progressBars = {
            // clipper power bars
            power: new ImageView({
                superview: this.tabs.upgrades,
                x: 252,
                y: 162,
                width: 140,
                height: 32
            }),
            // blade power bars
            blade: new ImageView({
                superview: this.tabs.upgrades,
                x: 424,
                y: 162,
                width: 140,
                height: 32
            }),
            // bolt multiplier bars
            multiplier: new ImageView({
                superview: this.tabs.upgrades,
                x: 596,
                y: 162,
                width: 140,
                height: 32
            })
        };

        this.updateProgressBars();

        this.priceDisplays = {
            // clipper power price
            power: new TextView({
                superview: this.tabs.upgrades,
                x: 289,
                y: 201,
                width: 92,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 24,
                horizontalAlign: "left"
            }),
            // blade power price
            blade: new TextView({
                superview: this.tabs.upgrades,
                x: 460,
                y: 201,
                width: 92,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 24,
                horizontalAlign: "left"
            }),
            // bolt multiplier price
            multiplier: new TextView({
                superview: this.tabs.upgrades,
                x: 633,
                y: 201,
                width: 92,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 24,
                horizontalAlign: "left"
            }),
            // diamond blades price
            diamond: new TextView({
                superview: this.tabs.upgrades,
                x: 805,
                y: 201,
                width: 92,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 24,
                horizontalAlign: "left"
            })
        };
        this.updatePriceDisplays();

        // clipper power button
        var powerButton = new Button({
            superview: this.tabs.upgrades,
            x: 242,
            y: 152,
            width: 160,
            height: 91,
            click: true
        });
        // clipper power confirmation
        powerButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a clipper power upgrade. Do you wish to continue?', 'power');
        }));

        // blade power button
        var bladeButton = new Button({
            superview: this.tabs.upgrades,
            x: 414,
            y: 152,
            width: 160,
            height: 91,
            click: true
        });
        // blade power confirmation
        bladeButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a blade power upgrade. Do you wish to continue?', 'blade');
        }));

        // bolt muliplier button
        var multiplierButton = new Button({
            superview: this.tabs.upgrades,
            x: 586,
            y: 152,
            width: 160,
            height: 91,
            click: true
        });
        // bolt multiplier confirmation
        multiplierButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a bolt multiplier upgrade. Do you wish to continue?', 'mult');
        }));

        // diamond blades button
        var diamondButton = new Button({
            superview: this.tabs.upgrades,
            x: 758,
            y: 152,
            width: 160,
            height: 91,
            click: true
        });
        // diamond blades confirmation
        diamondButton.on('InputSelect', bind(this, function () {
            this.showPurchaseDialog('You are about to purchase a diamond blade. Do you wish to continue?', 'diamond');
        }));


        // purchase all button
        var unlockAllButton = new Button({
            superview: this.tabs.upgrades,
            x: 753,
            y: 335,
            width: 142,
            height: 130,
            anchorX: 142/2,
            anchorY: 130/2,
            image: 'resources/images/special-offer.png'
        });
        var animateButton = function () {
            animate(unlockAllButton).clear().now({r: Math.PI/64, scale: 1.1}, 1500, animate.easeIn)
            .then({r: -1*Math.PI/64, scale: 1}, 1500, animate.easeOut)
            .then(animateButton);
        };
        animateButton();

        unlockAllButton.on('InputSelect', bind(this, function () {
            billing.purchase('all');
        }));
    };

    this._buildWoolTab = function () {
        var _registerClick = bind(this, function (view, index) {
            view.on('InputSelect', bind(this, function () {
                this.showPurchaseWool(constants.colors[index]);
            }));
        });
        var startX = 227, containerStart = 182, gap = 162, i = 0, container;
        this.tabs.wool.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-2.png'
        }));
        
        // wool title
        this.tabs.wool.addSubview(new TextView({
            x: 370,
            y: 40,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Wool'
        }));

        // wool sub-title
        this.tabs.wool.addSubview(new TextView({
            x: 293,
            y: 76,
            width: 574,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            text: 'Purchase wool for crafting.'
        }));

        // white title
        this.tabs.wool.addSubview(new TextView({
            x: 182,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'White'
        }));

        // white background
        this.tabs.wool.addSubview(new ImageView({
            x: 182,
            y: 152,
            width: 150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // white wool
        this.tabs.wool.addSubview(new ImageView({
            x: 225,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/wool-white.png'
        }));

        // white ewero
        this.tabs.wool.addSubview(new ImageView({
            x: 192,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // red title
        this.tabs.wool.addSubview(new TextView({
            x: 344,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Red'
        }));

        // red background
        this.tabs.wool.addSubview(new ImageView({
            x: 344,
            y: 152,
            width: 150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // red wool
        this.tabs.wool.addSubview(new ImageView({
            x: 387,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/wool-red.png'
        }));

        // red ewero
        this.tabs.wool.addSubview(new ImageView({
            x: 354,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // blue title
        this.tabs.wool.addSubview(new TextView({
            x: 505,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Blue'
        }));

        // blue background
        this.tabs.wool.addSubview(new ImageView({
            x: 505,
            y: 152,
            width: 150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // blue wool
        this.tabs.wool.addSubview(new ImageView({
            x: 548,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/wool-blue.png'
        }));

        // blue ewero
        this.tabs.wool.addSubview(new ImageView({
            x: 515,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // yellow title
        this.tabs.wool.addSubview(new TextView({
            x: 667,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Yellow'
        }));

        // yellow background
        this.tabs.wool.addSubview(new ImageView({
            x: 667,
            y: 152,
            width: 150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // yellow wool
        this.tabs.wool.addSubview(new ImageView({
            x: 710,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/wool-yellow.png'
        }));

        // yellow ewero
        this.tabs.wool.addSubview(new ImageView({
            x: 677,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        // black title
        this.tabs.wool.addSubview(new TextView({
            x: 828,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Black'
        }));

        // black background
        this.tabs.wool.addSubview(new ImageView({
            x: 828,
            y: 152,
            width: 150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // black wool
        this.tabs.wool.addSubview(new ImageView({
            x: 871,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/wool-black.png'
        }));

        // black ewero
        this.tabs.wool.addSubview(new ImageView({
            x: 838,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/store-ewero.png'
        }));

        for (i; i < constants.colors.length; i++) {
            //container
            container = new Button({
                superview: this.tabs.wool,
                x: containerStart + i*gap,
                y: 152,
                width: 150,
                height: 136
            });
            _registerClick(container, i);
            
            // wool quantity
            this.tabs.wool.addSubview(new TextView({
                x: startX + gap*i,
                y: 185,
                width: 58,
                height: 28,
                color: '#ffffff',
                fontFamily: 'delius',
                strokeWidth: 2,
                strokeColor: '#000000',
                size: 24,
                horizontalAlign: 'center',
                verticalAlign: 'middle',
                text: '' + constants.WOOL_QUANTITIES[constants.colors[i].label]
            }));

            // cost
            this.tabs.wool.addSubview(new TextView({
                x: startX + gap*i,
                y: 246,
                width: 92,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 24,
                horizontalAlign: 'left',
                text: '' + constants.UPGRADE_PRICES[constants.colors[i].label]
            }));
        }
    };

    this._buildEwerosTab = function () {
        var _registerClick = bind(this, function (view, index) {
            view.on('InputSelect', function () {
                billing.purchase('coins_' + index);
            });
        });
        var startX = 227, containerStart = 182, gap = 162, i = 0;
        this.tabs.eweros.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-3.png'
        }));
        
        // eweros title
        this.tabs.eweros.addSubview(new TextView({
            x: 370,
            y: 40,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Eweros'
        }));

        // eweros sub-title
        this.tabs.eweros.addSubview(new TextView({
            x: 293,
            y: 76,
            width: 574,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            text: 'Purchase eweros to buy upgrades and wool.'
        }));

        // $1 background
        this.tabs.eweros.addSubview(new ImageView({
            x: 182,
            y: 152,
            width:  150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // $1 ewero
        this.tabs.eweros.addSubview(new ImageView({
            x: 225,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/store-ewero.png'
        }));

        // $1 dollar
        this.tabs.eweros.addSubview(new ImageView({
            x: 192,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/dollar.png'
        }));

        // $2 background
        this.tabs.eweros.addSubview(new ImageView({
            x: 344,
            y: 152,
            width:  150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // $2 ewero
        this.tabs.eweros.addSubview(new ImageView({
            x: 387,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/store-ewero.png'
        }));

        // $2 dollar
        this.tabs.eweros.addSubview(new ImageView({
            x: 354,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/dollar.png'
        }));

        // $3 background
        this.tabs.eweros.addSubview(new ImageView({
            x: 505,
            y: 152,
            width:  150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // $3 ewero
        this.tabs.eweros.addSubview(new ImageView({
            x: 548,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/store-ewero.png'
        }));

        // $3 dollar
        this.tabs.eweros.addSubview(new ImageView({
            x: 515,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/dollar.png'
        }));

        // $4 background
        this.tabs.eweros.addSubview(new ImageView({
            x: 667,
            y: 152,
            width:  150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // $4 ewero
        this.tabs.eweros.addSubview(new ImageView({
            x: 710,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/store-ewero.png'
        }));

        // $4 dollar
        this.tabs.eweros.addSubview(new ImageView({
            x: 677,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/dollar.png'
        }));

        // $5 background
        this.tabs.eweros.addSubview(new ImageView({
            x: 828,
            y: 152,
            width:  150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // $5 ewero
        this.tabs.eweros.addSubview(new ImageView({
            x: 871,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/store-ewero.png'
        }));

        // $5 dollar
        this.tabs.eweros.addSubview(new ImageView({
            x: 838,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/dollar.png'
        })); 

        for (i; i < constants.colors.length; i++) {
            //container
            container = new Button({
                superview: this.tabs.eweros,
                x: containerStart + i*gap,
                y: 152,
                width: 150,
                height: 136
            });
            _registerClick(container, i);
            // quantity
            this.tabs.eweros.addSubview(new TextView({
                x: startX + gap*i,
                y: 114,
                width: 140,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 22,
                horizontalAlign: 'left',
                text: '' + constants.EWEROS_QUANTITIES[i]
            }));

            // cost
            this.tabs.eweros.addSubview(new TextView({
                x: startX + gap*i,
                y: 246,
                width: 92,
                height: 28,
                color: '#352e29',
                fontFamily: 'delius',
                size: 24,
                horizontalAlign: 'left',
                text: '$' + constants.EWEROS_PRICES[i]
            }));
        }
    };

    this._buildAdsTab = function () {
        if (GC.app.player.upgrades.get('adFree').value) {
            return;
        }
        var startX = 550, containerStart = 182;
        this.tabs.ads.addSubview(new ImageView({
            x: 33,
            y: 33,
            width: 137,
            height: 350,
            image: 'resources/images/tab-4.png'
        }));
        
        // ads title
        this.tabs.ads.addSubview(new TextView({
            x: 370,
            y: 40,
            width: 420,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            text: 'Ads'
        }));

        // ads sub-title
        this.tabs.ads.addSubview(new TextView({
            x: 293,
            y: 76,
            width: 574,
            height: 28,
            color: '#6b5e53',
            fontFamily: 'delius',
            size: 20,
            text: 'Purchase to remove ads from Sheared.'
        }));
        
        // ads title
        this.tabs.ads.addSubview(new TextView({
            x: 505,
            y: 114,
            width: 160,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 22,
            text: 'Remove Ads'
        }));

        // ads background
        this.tabs.ads.addSubview(new ImageView({
            x: 505,
            y: 152,
            width:  150,
            height: 136,
            image: 'resources/images/store-wool-eweros-ads-background.png'
        }));

        // ads image
        this.tabs.ads.addSubview(new ImageView({
            x: 548,
            y: 167,
            width:  64,
            height: 64,
            image: 'resources/images/store-no-ads.png'
        }));

        // ads dollar
        this.tabs.ads.addSubview(new ImageView({
            x: 515,
            y: 246,
            width:  32,
            height: 32,
            image: 'resources/images/dollar.png'
        }));

        // cost
        this.adsPrice = new TextView({
            superview: this.tabs.ads,
            x: startX,
            y: 246,
            width: 92,
            height: 28,
            color: '#352e29',
            fontFamily: 'delius',
            size: 24,
            horizontalAlign: 'left',
            text: GC.app.player.upgrades.get('adFree').value ? 'Purchased!' : '$' + constants.ADS_PRICE
        });
        
        var button = new Button({
            superview: this.tabs.ads,
            x: 505,
            y: 152,
            width: 150,
            height: 136,
            click: true
        });

        button.on('InputSelect', function () {
            if (!GC.app.player.upgrades.get('adFree').value) {
                billing.purchase('adFree');
            }
        });
    };

    this.switchTab = function (key) {
        GC.app.audio.playTab();
        this.currentTab.removeFromSuperview();
        this.currentTab = this.tabs[key];
        this.addSubview(this.currentTab);
    };

    this.showPurchaseWool = function (color) {
        this.showPurchaseDialog(
            'You are about to purchase ' + color.label + ' wool. Do you wish to continue?',
            false,
            color
        );
    };

    this.showPurchaseDialog = function (text, upgrade, woolColor) {
        var confirmDialog, cost;
        if (woolColor) {
            cost = constants.UPGRADE_PRICES[woolColor.label];
        } else if (upgrade === 'diamond') {
            if (GC.app.player.upgrades.get('diamond').value) {
                return; // already have diamonds, so do nothing
            }
            cost = constants.UPGRADE_PRICES[upgrade];
        } else {
            if (GC.app.player.upgrades.get(upgrade).value === constants.UPGRADE_MAX[upgrade]) {
                return; // already maxed out this upgrade, so do nothing
            }
            cost = constants.UPGRADE_PRICES[upgrade][GC.app.player.upgrades.get(upgrade).value-1];
        }
        if (!GC.app.localConfig.debug && GC.app.player.stats.get('coins').value < cost) {
            confirmDialog = new Alert({
                superview: this,
                text: 'Not enough Eweros! Earn more by crafting, or buy more in the store.',
                confirmFn: bind(this, function () { this.switchTab('eweros'); }),
                confirmText: 'Buy Eweros!'
            });
        } else {
            confirmDialog = new Alert({
                superview: this,
                text: text,
                confirmFn: bind(this, function () {
                    if (woolColor) {
                        GC.app.player.purchased(false, woolColor.label);
                        this.woolCounts.update(woolColor);
                    } else {
                        GC.app.player.purchased(upgrade);
                        this.updateProgressBars();
                        this.updatePriceDisplays();
                    }
                    this.coinsLabel.update();
                }),
                confirmText: 'OK'
            });
        }
        confirmDialog.show();
    };

    this.updateProgressBars = function () {
        var upgradeLevels = this._upgradeLevels();
        this.progressBars.power.setImage(
            'resources/images/store-clipperpower-' +
            upgradeLevels.power +
            '.png'
        );
        this.progressBars.multiplier.setImage(
            'resources/images/store-multiplier-' +
            upgradeLevels.multiplier +
            '.png'
        );
        this.progressBars.blade.setImage(
            'resources/images/store-bladepower-' +
            upgradeLevels.blade +
            '.png'
        );
    };

    this.updatePriceDisplays = function () {
        var upgradeLevels = this._upgradeLevels();

        // price displays for upgrades
        this.priceDisplays.power.setText(
            constants.UPGRADE_PRICES.power[upgradeLevels.power-1] ||
            'Purchased!'
        );
        this.priceDisplays.multiplier.setText(
            constants.UPGRADE_PRICES.mult[upgradeLevels.multiplier-1] ||
            'Purchased!'
        );
        this.priceDisplays.blade.setText(
            constants.UPGRADE_PRICES.blade[upgradeLevels.blade-1] ||
            'Purchased!'
        );
        if (GC.app.player.upgrades.get('diamond').value) {
            this.priceDisplays.diamond.setText('Purchased!');
        } else {
            this.priceDisplays.diamond.setText(constants.UPGRADE_PRICES.diamond);
        }
    };

    this._upgradeLevels = function () {
        var upgrades = GC.app.player.upgrades;
        return {
            power: upgrades.get('power').value >= constants.UPGRADE_MAX.power ? 'max' : upgrades.get('power').value,
            multiplier: upgrades.get('mult').value >= constants.UPGRADE_MAX.mult ? 'max' : upgrades.get('mult').value,
            blade: upgrades.get('blade').value >= constants.UPGRADE_MAX.blade ? 'max' : upgrades.get('blade').value
        };
    };
});
