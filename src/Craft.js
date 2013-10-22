import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View;

import src.constants as c;
import src.Button as Button;
import src.util as util;


exports = Class(ui.View, function (supr) {
    this.init = function (garment, main, contrast, monogram) {
        opts = {x: 0, y: 0, width: 394, height: 325};
        supr(this, 'init', [opts]);

        this.colors = {};
        if (typeof garment === 'string') {
            garment = c.garmentsByLabel[garment];
        }
        if (typeof main === 'string') {
            main = c.colorsByLabel[main];
        }
        if (typeof contrast === 'string') {
            contrast = c.colorsByLabel[contrast];
        }
        this.colors.main = main || c.COLOR_NONE;
        this.colors.contrast = contrast || c.COLOR_NONE;
        this.garment = garment || c.GARMENT_NAKED;
        this.monogram = monogram || '';

        _texture = new ImageView({
            x: 0,
            y: 0,
            width: 394,
            height: 324,
            canHandleEvents: false,
            image: 'resources/images/craft-preview-background.png',
            superview: this
        });

        this.bg = new ImageView({
            x: 13,
            y: 0,
            width: 368,
            height: 278,
            canHandleEvents: false,
            superview: this
        });

        this.pvSwatch = new ImageView({x: 13, y: 44, width: 368, height: 230, superview: this,
            canHandleEvents: false});
        this.pvItem = new ImageView({x: 111, y: 73, width: 172, height: 172, superview: this,
            canHandleEvents: false, anchorX: 172/2, anchorY: 0});
        this.pvText = new Button({x: 13, y: 6, width: 232, height: 28, superview: this,
            canHandleEvents: false, horizontalAlign: 'left', color: '#6b5e53', size: 24, strokeWidth: 0});
        this.pvText.setText("Placeholder");
        this.pvMain = new ImageView({x: 30, y: 127, width: 64, height: 64, superview: this,
            canHandleEvents: false});
        this.pvContrast = new ImageView({x: 300, y: 127, width: 64, height: 64, superview: this,
            canHandleEvents: false});

        this._disableBuy = bind(this, this._enableBuy, false);

        this.buyButton = new Button({x: 148, y: 280, width: 96, height: 37,
            superview: this, zIndex: 6000000});
        this.mainWoolCost = new Button({x: 37, y: 145, width: 50, height: 28,
            superview: this, canHandleEvents: false});
        this.contrastWoolCost = new Button({x: 307, y: 145, width: 50, height: 28,
            superview: this, canHandleEvents: false});
        this.value = new Button({x: 308, y: 6, width: 73, height: 28,
            superview: this, canHandleEvents: false});

        this.buyButton.on('InputSelect', bind(this, this.purchased));
    };

    this.purchased = function () {
        if (this.buyButton.getOpts().buyEnabled) {
            GC.app.audio.playBuyGarment();
            this.emit('largeCraft:purchased');
        }
    };

    this._enableBuy = function (enabled) {
        enabled = (enabled === undefined) ? true : enabled;
        this.buyButton.setImage(
            enabled || enabled === undefined ?
               c.craftButtonImage :
               c.craftButtonDisabledImage
        );
        this.buyButton.updateOpts({buyEnabled: enabled});
    };

    /*
     * Display the widget somewhere.
     *
     * If label is given, use label as the text of the item being displayed.
     */
    this.enable = function (enabled, label) {
        var costs, eweros,
            garm = this.garment.label,
            main = this.colors.main.label,
            cont = this.colors.contrast.label;

        costs = this.cost();
        this.mainWoolCost.setText(costs[0].amount);
        this.contrastWoolCost.setText(costs[1].amount);

        if (enabled === undefined || enabled) {
            this.pvSwatch.setImage(c.swatchImages[main][cont]);
            this.pvItem.setImage(c.craftImages[garm][main][cont]);
            this.pvText.setText(util.capitalize(main) + ' & ' + util.capitalize(cont) + ' ' + util.capitalize(garm));
            this.pvMain.setImage(c.woolImages[main]);
            this.pvContrast.setImage(c.woolImages[cont]);

            this._enableBuy();
        } else {
            this.pvSwatch.setImage(undefined);
            this.pvItem.setImage(c.nullCraftImages[garm]);
            this.pvMain.setImage(c.woolImages['disabledMain']);
            this.pvContrast.setImage(c.woolImages['disabledContrast']);

            this._disableBuy();
        }
        if (label) {
            this.pvText.setText(label);
        }

        eweros = this.eweros();
        this.value.setText(eweros ? eweros : '-');
    };

    // return 2-array of [main, contrast] as objects
    this.cost = function _a_cost() {
        var ret = [];
        vMainWool = Math.round(1 / this.colors.main.rarity, 0);
        vContrastWool = Math.round(1 / this.colors.contrast.rarity, 0);

        ret.push({color: this.colors.main,
            amount: this.garment.cost.main,
            eweros: this.garment.cost.main * vMainWool
        });

        ret.push({color: this.colors.contrast,
            amount: this.garment.cost.contrast,
            eweros: this.garment.cost.contrast * vContrastWool
        });
        return ret;
    };

    this.toMotif = function _a_toMotif() {
        return this.garment.label + '|' + this.colors.main.label + '|' + this.colors.contrast.label;
    };

    this.eweros = function _a_eweros(count) {
        if (count === undefined) {
            count = 1;
        }
        costs = this.cost();
        return (count * (costs[0].eweros + costs[1].eweros));
    };

    this.formatDollars = function _a_formatDollars(count) {
        return this.eweros(count).toFixed(2);
    };
});

