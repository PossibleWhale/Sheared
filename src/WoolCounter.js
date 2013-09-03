/*
 * View containing persistent wool counts for each color.
 */
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.constants as constants;
import src.WoolStorage as WoolStorage;
import src.util as util;


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            height: 64,
            width: 424,
            clip: false,
            image: 'resources/images/wool.png'
        });

        util.assert(opts.storage, "opts.storage is required in WoolCounter's options");
        this.wool = opts.storage;
        delete opts.storage;

        supr(this, 'init', [opts]);

        var textViewOpts = {
            width: 50,
            height: 28,
            color: '#FFFFFF',
            fontFamily: 'delius',
            strokeWidth: 3,
            strokeColor: '#333333',
            shadowColor: '#000000',
            size: 26,
            horizontalAlign: 'center',
            verticalAlign: 'middle'
        }, i, xPos = 15;

        this.counts = {};
        for (i = 0; i < constants.colors.length; i++) {
            this.counts[constants.colors[i].label] = new TextView(merge({
                superview: this,
                x: xPos,
                y: 25
            }, textViewOpts));
            xPos += 90;
            this.update(constants.colors[i]);
        }
    };

    this.update = function (color) {
        var _update, i;
        _update = bind(this, function (col) {
            this.counts[col.label].setText(
                this.wool.get(col).count
            );
        });

        if (color === undefined) {
            i = constants.colors.length;
            while (i--) {
                _update(constants.colors[i]);
            }
        } else {
            _update(color);
        }
    };

    // update the wool counter to match whatever is in GC.app.player's WoolStorage
    this.matchStorage = function () {
        var i = constants.colors.length, col;
        while (i--) {
            col = constants.colors[i];
            this.counts[col.label].setText(GC.app.player.wool.get(col).count);
        }
    };
});
