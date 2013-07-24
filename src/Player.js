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

        // this will be able to change with upgrades
        this.maxClipperHealth = 5;

        // add a specified amount of coins to the player's wallet
        this.addCoins = function (amt) {
            this.stats.increment('coins', amt);
            this.stats.increment('coinsEarned', amt);
        }

        // add all the wool from another inventory to this one
        this.mergeWoolCounts = bind(this.wool, this.wool.mergeCounts);


        this.shearedSheep = function (sheep) {
            if (sheep.isRam) {
                this.stats.increment('ramsSheared.' + sheep.color.label);
            } else {
                this.stats.increament('ewesSheared.' + sheep.color.label);
            }
        };

        this.collectedBattery = function () {
            this.stats.increment('batteries');
        };

        this.collectedDiamond = function () {
            this.stats.increment('diamonds');
        };

        this.hitWithBlade = function (isDiamond) {
            if (isDiamond) {
                this.stats.increment('diamondBladesHit');
            } else {
                this.stats.increment('regularBladesHit');
            }
        };

        this.bladeFired = function (isDiamond) {
            if (isDiamond) {
                this.stats.increment('diamondBladesFired');
            } else {
                this.stats.increment('regularBladesFired');
            }
        };
    };
});

