"use strict";

import event.Emitter as Emitter;

import src.constants as c;
import src.WoolStorage as WoolStorage;
import src.CraftStorage as CraftStorage;
import src.StatStorage as StatStorage;
import src.UpgradeStorage as UpgradeStorage;
import src.AwardStorage as AwardStorage;
import src.debughack as dh;
import src.awardtracker as at;


exports = Class(Emitter, function Player(supr) {
    this.init = function (opts) {
        supr(this, 'init', arguments);

        opts = opts || {};

        this.persist = opts.persist === undefined ? true : opts.persist;

        this.wool = new WoolStorage({persist: this.persist});
        this.crafts = new CraftStorage({persist: this.persist});
        this.stats = new StatStorage({persist: this.persist});
        this.upgrades = new UpgradeStorage({persist: this.persist});
        this.awards = new AwardStorage({persist: this.persist});

        // if this is the paid version, no ads.
        if (GC.app.localConfig.release === 'paid' || GC.app.localConfig.release === 'samsung') {
            this.upgrades.addToUpgrade('adFree', true);
        }

        this.addWool = bind(this.wool, this.wool.addWool);

        this.addCraft = bind(this.crafts, this.crafts.addCraft);

        this.setUpgrades();

        // add all the wool from another inventory to this one
        this.mergeWoolCounts = bind(this.wool, this.wool.mergeCounts);
    };

    this.hasAllUpgrades = function () {
        return (this.upgrades.get('power').value === c.UPGRADE_MAX.power &&
                this.upgrades.get('mult').value === c.UPGRADE_MAX.mult &&
                this.upgrades.get('blade').value === c.UPGRADE_MAX.blade &&
                this.upgrades.get('diamond').value);
    };

    this.setUpgrades = function () {
        this.maxClipperHealth = Math.min(10, 5 + this.upgrades.get('power').value-1);
        this.boltMultiplier = this.upgrades.get('mult').value;
        this.diamondBlade = this.upgrades.get('diamond').value;
    };

    this._buy = function (upgradeName, woolColor) {
        var key = woolColor ? woolColor : upgradeName, price;
        if (!woolColor && upgradeName !== 'diamond') {
            price = c.UPGRADE_PRICES[key][this.upgrades.get(key).value-1];
        } else {
            price = c.UPGRADE_PRICES[key];
        }
        this.stats.increment('coins', -1*price);
    };

    this.purchased = function (upgradeName, woolColor) {
        dh.pre_purchase();

        if (upgradeName === 'all') {
            this.upgrades.addToUpgrade('power', c.UPGRADE_MAX.power);
            this.upgrades.addToUpgrade('blade', c.UPGRADE_MAX.blade);
            this.upgrades.addToUpgrade('mult', c.UPGRADE_MAX.mult);
            this.upgrades.addToUpgrade('diamond', true);
        } else {
            this._buy(upgradeName, woolColor);
            if (woolColor) {
                this.wool.addWool(woolColor, c.WOOL_QUANTITIES[woolColor]);
            } else if (upgradeName === 'diamond') {
                this.upgrades.addToUpgrade('diamond', true);
            } else {
                this.upgrades.addToUpgrade(upgradeName, this.upgrades.get(upgradeName).value + 1);
            }
        }

        this.emit('player:purchased');
        if (upgradeName === 'power' || upgradeName === 'all') {
            this.emit('player:purchasedPower');
        }

        if (upgradeName === 'all') {
            at.emit('player:purchasedpower');
            at.emit('player:purchasedblade');
            at.emit('player:purchasedmult');
            at.emit('player:purchaseddiamond');
        } else if (upgradeName) {
            at.emit('player:purchased' + upgradeName);
        }

        GC.app.audio.playPurchase();
    };

    // add a specified amount of coins to the player's wallet
    this.addCoins = function (amt) {
        this.stats.increment('coins', amt);
        this.stats.increment('coinsEarned', amt);

        at.emit('player:coins');
    }

    this.shearedSheep = function (sheep) {
        if (sheep.isRam) {
            this.stats.increment('ramsSheared');
            this.stats.increment('ramsSheared.' + sheep.color.label);
        } else {
            this.stats.increment('ewesSheared');
            this.stats.increment('ewesSheared.' + sheep.color.label);
        }
        if (!sheep.isGold) {
            this.stats.increment('wool', sheep.bolts);
            this.stats.increment('wool.' + sheep.color.label, sheep.bolts);
        }

        at.emit('player:sheared', sheep);
    };

    this.collectedBattery = function () {
        this.stats.increment('batteries');

        at.emit('player:battery');
    };

    this.collectedDiamond = function () {
        this.stats.increment('diamonds');

        at.emit('player:diamond');
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

    // true if the player has sufficient wool to craft something
    this.canCraft = function _a_canCraft(craft) {
        var main, contrast, copy, costs = craft.cost();
        main = craft.colors.main;
        contrast = craft.colors.contrast;

        copy = this.wool.copy({persist: false});

        copy.addWool(main, -1 * costs[0].amount);
        copy.addWool(contrast, -1 * costs[1].amount);
        return (copy.get(main).count >= 0 && copy.get(contrast).count >= 0);
    };

    this.earnedAward = function (awardKey) {
        this.awards.add({name: awardKey, value: true});
        this.addCoins(c.AWARDS[awardKey].reward);
        this.emit('player:earnedAward', c.AWARDS[awardKey]);
    };

});

