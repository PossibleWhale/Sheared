"use strict";

import src.constants as c;
import event.Emitter as Emitter;

exports = Class(Emitter, function Inventory(supr) {
    this.init = function () {
        supr(this, 'init', arguments);
        this.wool = {
            c.COLOR_WHITE: 0,
            c.COLOR_RED: 0,
            c.COLOR_GREEN: 0,
            c.COLOR_BLUE: 0,
            c.COLOR_YELLOW: 0,
            c.COLOR_BLACK: 0
        };
 
        this._crafts = [];

        this.addWool = bind(this, function (color, amt) {
            if (typeof color === 'string') {
                color = c.colorsByLabel[color];
            }
            this.wool[color] = this.wool[color] + (amt || 1);
            this.emit('inventory:woolAdded', color, amt);
        });

        this.addCraft = bind(this, function (garment, base, trim) {
            if (typeof garment === 'string') {
                garment = c.garmentsByLabel[garment];
            }
            if (typeof base === 'string') {
                base = c.colorsByLabel[base];
            }
            if (typeof trim === 'string') {
                trim = c.colorsByLabel[trim];
            }
            this._crafts.push(new Craft(garment, base, trim));
            this.emit('inventory:craftAdded', garment, base, trim);
        });
    };
});

