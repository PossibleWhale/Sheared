
import event.Emitter;
import src.constants as c;
import src.Craft as Craft;

AwardTracker = Class(event.Emitter, function (supr) {
    this.init = function () {
        supr(this, 'init', arguments);

        this.build();
    };

    this.build = function () {
        this.on('player:coins', function () {
            var player = GC.app.player, i = 10, awardKey;
            while (i <= 100000) {
                awardKey = 'eweros.' + i;
                if (!player.awards.get(awardKey).value && player.stats.get('coins').value >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }
        });

        this.on('player:sheared', function (sheep) {
            var player = GC.app.player, totalSheared, colorSheared, prefix, i, awardKey;
            if (sheep.isRam) {
                prefix = 'rams.';
                numSheared = player.stats.get('ramsSheared').value;
                colorSheared = player.stats.get('ramsSheared.' + sheep.color.label).value;
            } else {
                prefix = 'ewes.';
                numSheared = player.stats.get('ewesSheared').value;
                colorSheared = player.stats.get('ewesSheared.' + sheep.color.label).value;
            }

            // check for ewe/ram of any color award
            i = 5;
            while (i <= 50000) {
                awardKey = prefix + i;
                if (!player.awards.get(awardKey).value && numSheared >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }

            // check for ewe/ram of specific color award
            i = 1;
            while (i <= 10000) {
                awardKey = prefix + sheep.color.label + '.' + i;
                if (!player.awards.get(awardKey).value && colorSheared >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }

            // check for wool of any color award
            i = 10;
            while (i <= 100000) {
                awardKey = 'wool.' + i;
                if (!player.awards.get(awardKey).value && player.stats.get('wool').value >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }

            // check for wool of specific color award
            i = 2;
            while (i <= 20000) {
                awardKey = 'wool.' + sheep.color.label + '.' + i;
                if (!player.awards.get(awardKey).value && player.stats.get('wool.' + sheep.color.label).value >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }
        });

        this.on('player:battery', function () {
            var player = GC.app.player, i = 1, awardKey;
            while (i <= 10000) {
                awardKey = 'batteries.' + i;
                if (!player.awards.get(awardKey).value && player.stats.get('batteries').value >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }
        });

        this.on('player:diamond', function () {
            var player = GC.app.player, i = 1, awardKey;
            while (i <= 10000) {
                awardKey = 'diamonds.' + i;
                if (!player.awards.get(awardKey).value && player.stats.get('diamonds').value >= i) {
                    player.earnedAward(awardKey);
                }
                i *= 10;
            }
        });

        this.on('player:purchasedpower', function () {
            var player = GC.app.player;
            var upgradeLevel = player.upgrades.get('perm_power').value - 1, i = 1;
            while (i <= 5) {
                var currentLevel = i === 5 ? 'max' : i, key = 'power.' + currentLevel;
                if (!player.awards.get(key).value && upgradeLevel >= i) {
                    player.earnedAward(key);
                }
                i++;
            }
        });

        this.on('player:purchasedmult', function () {
            var player = GC.app.player;
            var upgradeLevel = player.upgrades.get('perm_mult').value, i = 2;
            while (i <= 6) {
                var currentLevel = i === 6 ? 'max' : i, key = 'multiplier.' + currentLevel;
                if (!player.awards.get(key).value && upgradeLevel >= i) {
                    player.earnedAward(key);
                }
                i++;
            }
        });

        this.on('player:crafted', function (craft) {
            var player = GC.app.player, earnedAward = true;
            // check for garment award
            player.crafts.loopGarment(craft.label,
                function (i, j, data) {
                    if (data.count === 0) {
                        earnedAward = false;
                        return;
                    }
                });
            if (earnedAward) {
                player.earnedAward('crafts.' + craft.garment.label + 's');
            }

            // check for color award
            earnedAward = true;
            var i, j, current;
            for (i = 0; i < c.colors.length; i++) {
                for (j = 0; j < c.garments.length; j++) {
                    current = new Craft(c.garments[j].label, craft.colors.main.label, c.colors[i].label);
                    console.log(current.garment.label + '-' + current.colors.main.label + '-' + current.colors.contrast.label);
                    if (!player.crafts.get(current).value) {
                        earnedAward = false;
                    }
                }
            }
            if (earnedAward) {
                player.earnedAward('crafts.' + craft.colors.main.label);
            }
        });
    };

});

exports = new AwardTracker();
