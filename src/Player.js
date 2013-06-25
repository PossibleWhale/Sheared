"use strict";

import src.constants as c;
import src.Inventory as Inventory;
import event.Emitter as Emitter;

exports = Class(Emitter, function Player(supr) {
    this.init = function () {
        supr(this, 'init', arguments);
        this.inventory = new Inventory();
        // if there are no saved wool values, initialize them
        if (!localStorage['wool.' + c.COLOR_WHITE.label]) {
            localStorage['wool.' + c.COLOR_WHITE.label] = 0;
            localStorage['wool.' + c.COLOR_RED.label] = 0;
            localStorage['wool.' + c.COLOR_BLUE.label] = 0;
            localStorage['wool.' + c.COLOR_YELLOW.label] = 0;
            localStorage['wool.' + c.COLOR_BLACK.label] = 0;
        }
        this.inventory.wool[c.COLOR_WHITE.label] = parseInt(localStorage['wool.' + c.COLOR_WHITE.label]);
        this.inventory.wool[c.COLOR_RED.label] = parseInt(localStorage['wool.' + c.COLOR_RED.label]);
        this.inventory.wool[c.COLOR_BLUE.label] = parseInt(localStorage['wool.' + c.COLOR_BLUE.label]);
        this.inventory.wool[c.COLOR_YELLOW.label] = parseInt(localStorage['wool.' + c.COLOR_YELLOW.label]);
        this.inventory.wool[c.COLOR_BLACK.label] = parseInt(localStorage['wool.' + c.COLOR_BLACK.label]);

        this.deduct = bind(this, function (color) {
        });

        this.addWool = bind(this, function (color, amt) {
            this.inventory.addWool(color, amt);
            localStorage['wool.' + color] = parseInt(localStorage['wool.' + color]) + (amt || 1);
        });

        this.addCraft = bind(this, function (garment, base, trim) {
            this.inventory.addCraft(garment, base, trim);
            // TODO local storage
        });

        // add all the wool from another inventory to this one
        this.addInventory = function (other) {
            var i = c.colors.length;
            while (i--) {
                this.addWool(c.colors[i].label, other.wool[c.colors[i].label]);
            }
        };
    };
});

