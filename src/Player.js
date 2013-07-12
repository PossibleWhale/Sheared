"use strict";

import event.Emitter as Emitter;

import src.constants as c;
import src.WoolStorage as WoolStorage;
import src.CraftStorage as CraftStorage;
import src.StatStorage as StatStorage;


exports = Class(Emitter, function Player(supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.wool = new WoolStorage();
        this.crafts = new CraftStorage();
        this.stats = new StatStorage();

        this.addWool = bind(this.wool, this.wool.addWool);

        this.addCraft = bind(this.crafts, this.crafts.addCraft);

        // this will be able to change with upgrades
        this.maxClipperHealth = 5;

        // add all the wool from another inventory to this one
        this.mergeWoolCounts = bind(this.wool, this.wool.mergeCounts);

        /* FIXME - use StatStorage */ this.ewesSheared = {};
        /* FIXME - use StatStorage */ loadStats(this.ewesSheared, 'ewes.');

        /* FIXME - use StatStorage */ this.ramsSheared = {};
        /* FIXME - use StatStorage */ loadStats(this.ramsSheared, 'rams.');

        /* FIXME - use StatStorage */ this.shearedSheep = function (sheep) {
        /* FIXME - use StatStorage */     if (sheep.isRam) {
        /* FIXME - use StatStorage */         this.ramsSheared[sheep.color.label] += 1;
        /* FIXME - use StatStorage */         localStorage['rams.' + sheep.color.label] = this.ramsSheared[sheep.color.label];
        /* FIXME - use StatStorage */     } else {
        /* FIXME - use StatStorage */         this.ewesSheared[sheep.color.label] += 1;
        /* FIXME - use StatStorage */         localStorage['ewes.' + sheep.color.label] = this.ewesSheared[sheep.color.label];
        /* FIXME - use StatStorage */     }
        /* FIXME - use StatStorage */ };

        this.collectedDiamond = function () {
            incrementCounter('diamonds');
        };

        this.hitWithBlade = function (isDiamond) {
            if (isDiamond) {
                incrementCounter('diamondBladesHit');
            } else {
                incrementCounter('regularBladesHit');
            }
        };

        this.bladeFired = function (isDiamond) {
            if (isDiamond) {
                incrementCounter('diamondBladesFired');
            } else {
                incrementCounter('regularBladesFired');
            }
        };
    };
});

/* FIXME - use StatStorage */ function incrementCounter (counterName) {
/* FIXME - use StatStorage */     if (!localStorage[counterName]) {
/* FIXME - use StatStorage */         localStorage[counterName] = 0;
/* FIXME - use StatStorage */     }
/* FIXME - use StatStorage */     localStorage[counterName] = parseInt(localStorage[counterName]) + 1;
/* FIXME - use StatStorage */ }

/* FIXME - use the appropriate Storage */function loadStats (obj, id) {
/* FIXME - use the appropriate Storage */    var i = c.colors.length;
/* FIXME - use the appropriate Storage */    // if there are no saved values, initialize them
/* FIXME - use the appropriate Storage */    if (!localStorage[id + c.COLOR_WHITE.label]) {
/* FIXME - use the appropriate Storage */        while (i--) {
/* FIXME - use the appropriate Storage */            localStorage[id + c.colors[i].label] = 0;
/* FIXME - use the appropriate Storage */        }
/* FIXME - use the appropriate Storage */    }
/* FIXME - use the appropriate Storage */
/* FIXME - use the appropriate Storage */    // pull the stats from local storage
/* FIXME - use the appropriate Storage */    i = c.colors.length;
/* FIXME - use the appropriate Storage */    while (i--) {
/* FIXME - use the appropriate Storage */        obj[c.colors[i].label] = parseInt(localStorage[id + c.colors[i].label]);
/* FIXME - use the appropriate Storage */    }
/* FIXME - use the appropriate Storage */}
