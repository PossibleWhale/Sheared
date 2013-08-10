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
    this.init = function () {
        supr(this, 'init', arguments);

        this.wool = new WoolStorage();
        this.crafts = new CraftStorage();
        this.stats = new StatStorage();
        this.upgrades = new UpgradeStorage();
        this.awards = new AwardStorage();

        this.addWool = bind(this.wool, this.wool.addWool);

        this.addCraft = bind(this.crafts, this.crafts.addCraft);

        this.setUpgrades();

        // add all the wool from another inventory to this one
        this.mergeWoolCounts = bind(this.wool, this.wool.mergeCounts);
    };

    this.setUpgrades = function () {
        this.maxClipperHealth = Math.min(10, 5 + Math.max(this.upgrades.get('temp_power').value-1,
                                this.upgrades.get('perm_power').value-1));
        this.boltMultiplier = Math.max(this.upgrades.get('temp_mult').value,
                                this.upgrades.get('perm_mult').value);
        this.diamondBlade = this.upgrades.get('temp_diamond').value ||
                                this.upgrades.get('perm_diamond').value;
    };

    this._buy = function (tempOrPerm, upgradeName, woolColor) {
        var key = woolColor ? woolColor : tempOrPerm + '_' + upgradeName, price;
        if (!woolColor && upgradeName !== 'diamond') {
            price = c.UPGRADE_PRICES[key][this.upgrades.get(key).value-1];
        } else {
            price = c.UPGRADE_PRICES[key];
        }
        this.stats.increment('coins', -1*price);
    };

    this.purchased = function (tempOrPerm, upgradeName, woolColor) {
        dh.pre_purchase();
        var key = tempOrPerm + '_' + upgradeName;
        this._buy(tempOrPerm, upgradeName, woolColor);
        if (woolColor) {
            this.wool.addWool(woolColor, 100);
        } else if (upgradeName === 'diamond') {
            this.upgrades.addToUpgrade('temp_diamond', true);
            // if a permanent upgrade was purchased then the temporary one was "purchased" too
            if (tempOrPerm === 'perm') {
                this.upgrades.addToUpgrade(tempOrPerm + '_diamond', true);
            }
        } else {
            this.upgrades.addToUpgrade('temp_' + upgradeName, this.upgrades.get('temp_' + upgradeName).value + 1);
            if (tempOrPerm === 'perm') {
                this.upgrades.addToUpgrade(key, this.upgrades.get(key).value + 1);
            }
        }

        this.emit('player:purchased');

        if (tempOrPerm === 'perm' && upgradeName) {
            at.emit('player:purchased' + upgradeName);
        }
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
        this.stats.increment('wool', sheep.bolts);
        this.stats.increment('wool.' + sheep.color.label, sheep.bolts);

        if (!sheep.getSuperview().isTutorial) {
            at.emit('player:sheared', sheep);
        }
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

        copy = this.wool.copy();

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

