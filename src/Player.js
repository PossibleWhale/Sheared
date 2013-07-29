"use strict";

import event.Emitter as Emitter;

import src.constants as c;
import src.WoolStorage as WoolStorage;
import src.CraftStorage as CraftStorage;
import src.StatStorage as StatStorage;
import src.UpgradeStorage as UpgradeStorage;


exports = Class(Emitter, function Player(supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.wool = new WoolStorage();
        this.crafts = new CraftStorage();
        this.stats = new StatStorage();
        this.upgrades = new UpgradeStorage();

        this.addWool = bind(this.wool, this.wool.addWool);

        this.addCraft = bind(this.crafts, this.crafts.addCraft);
 
        this.setUpgrades = function () {
            this.maxClipperHealth = Math.min(10, 5 + Math.max(this.upgrades.get('temp_power').value,
                                    this.upgrades.get('perm_power').value));
            this.boltMultiplier = Math.max(this.upgrades.get('temp_mult').value,
                                    this.upgrades.get('perm_mult').value);
            this.diamondBlade = this.upgrades.get('temp_diamond').value || 
                                    this.upgrades.get('perm_diamond').value;
        };
        this.setUpgrades();

        this.purchased = function (tempOrPerm, upgradeName) {
            if (upgradeName === 'diamond') {
                this.upgrades.addToUpgrade('temp_diamond', true);
                // if a permanent upgrade was purchased then the temporary one was "purchased" too
                if (tempOrPerm === 'perm') {
                    this.upgrades.addToUpgrade(tempOrPerm + '_diamond', true);
                }
            } else {
                var key = tempOrPerm + '_' + upgradeName;
                this.upgrades.addToUpgrade('temp_' + upgradeName, this.upgrades.get('temp_' + upgradeName).value + 1);
                if (tempOrPerm === 'perm') {
                    this.upgrades.addToUpgrade(key, this.upgrades.get(key).value + 1);
                }
            }
            this.emit('player:purchased');
        };

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
                this.stats.increment('ewesSheared.' + sheep.color.label);
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

});

