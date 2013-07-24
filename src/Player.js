"use strict";

import event.Emitter as Emitter;

import src.constants as c;
import src.WoolStorage as WoolStorage;
import src.CraftStorage as CraftStorage;
import src.StatStorage as StatStorage;


exports = Class(Emitter, function Player(supr) {
    var lsSet, lsGet;
    lsSet = bind(localStorage, localStorage.setItem);
    lsGet = bind(localStorage, localStorage.getItem);

    this.init = function () {
        supr(this, 'init', arguments);

        this.wool = new WoolStorage();
        this.crafts = new CraftStorage();
        this.stats = new StatStorage();

        this.addWool = bind(this.wool, this.wool.addWool);

        this.addCraft = bind(this.crafts, this.crafts.addCraft);

        // TODO load this from localStorage
        this.upgrades = {
            temporary: {
                power: 0,
                multiplier: 1,
                diamond: false
            },
            permanent: {
                power: 0,
                multiplier: 1,
                diamond: false
            }
        };

        this.maxClipperHealth = 5 + Math.max(this.upgrades.temporary.power, this.upgrades.permanent.power);
        this.boltMultiplier = Math.max(this.upgrades.temporary.multiplier, this.upgrades.permanent.multiplier);
        this.diamondBlade = this.upgrades.temporary.diamond || this.upgrades.permanent.diamond;

        this.purchased = function (tempOrPerm, upgradeName) {
            if (upgradeName === 'diamond') {
                this.upgrades[tempOrPerm].diamond = true;
                // if a permanent upgrade was purchased then the temporary one was "purchased" too
                if (tempOrPerm === 'permanent') {
                    this.upgrades.temporary.diamond = true;
                }
            } else {
                this.upgrades[tempOrPerm][upgradeName] += 1;
                if (tempOrPerm === 'permanent') {
                    this.upgrades.temporary[upgradeName] += 1;
                }
            }
        };

        // get coins from local storage
        if (!localStorage.coins) {
            localStorage.coins = 0;
        }
        this.coins = localStorage.coins;
        // add a specified amount of coins to the player's wallet
        this.addCoins = function (amt) {
            localStorage.coins = parseInt(localStorage.coins) + amt;
            this.coins = localStorage.coins;
        }

        // add all the wool from another inventory to this one
        this.mergeWoolCounts = bind(this.wool, this.wool.mergeCounts);


        /* FIXME - use StatStorage */ this.ewesSheared = {};
        /* FIXME - use StatStorage */ loadStats(this.ewesSheared, 'ewes.');

        /* FIXME - use StatStorage */ this.ramsSheared = {};
        /* FIXME - use StatStorage */ loadStats(this.ramsSheared, 'rams.');

        /* FIXME - use StatStorage */ this.shearedSheep = function (sheep) {
        /* FIXME - use StatStorage */     if (sheep.isRam) {
        /* FIXME - use StatStorage */         this.ramsSheared[sheep.color.label] += 1;
                                              lsSet('rams.' + sheep.color.label, this.ramsSheared[sheep.color.label]);
        /* FIXME - use StatStorage */     } else {
        /* FIXME - use StatStorage */         this.ewesSheared[sheep.color.label] += 1;
                                              lsSet('ewes.' + sheep.color.label, this.ewesSheared[sheep.color.label]);
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
/* FIXME - use StatStorage */     if (!localStorage.getItem(counterName)) {
/* FIXME - use StatStorage */         localStorage.setItem(counterName, 0);
/* FIXME - use StatStorage */     }
/* FIXME - use StatStorage */     localStorage.setItem(counterName, parseInt(localStorage.getItem(counterName), 10) + 1);

/* FIXME - use StatStorage */ }

/* FIXME - use the appropriate Storage */function loadStats (obj, id) {
/* FIXME - use the appropriate Storage */    var i = c.colors.length;
/* FIXME - use the appropriate Storage */    // if there are no saved values, initialize them
/* FIXME - use the appropriate Storage */    if (!localStorage.getItem(id + c.COLOR_WHITE.label)) {
/* FIXME - use the appropriate Storage */        while (i--) {
/* FIXME - use the appropriate Storage */            localStorage.setItem(id + c.colors[i].label, 0);
/* FIXME - use the appropriate Storage */        }
/* FIXME - use the appropriate Storage */    }
/* FIXME - use the appropriate Storage */
/* FIXME - use the appropriate Storage */    // pull the stats from local storage
/* FIXME - use the appropriate Storage */    i = c.colors.length;
/* FIXME - use the appropriate Storage */    while (i--) {
/* FIXME - use the appropriate Storage */        obj[c.colors[i].label] = parseInt(localStorage.getItem(id + c.colors[i].label), 10);
/* FIXME - use the appropriate Storage */    }
/* FIXME - use the appropriate Storage */}
