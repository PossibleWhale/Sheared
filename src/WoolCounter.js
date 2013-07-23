/*
 * View containing persistent wool counts for each color.
 */
import ui.View as View;
import ui.TextView as TextView;
import src.constants as constants;
import src.WoolStorage as WoolStorage;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            height: 80,
            width: 510,
            clip: false
        });

        supr(this, 'init', [opts]);

        var fromLocal = opts.fromLocal || false;
        if (fromLocal) {
            this.wool = GC.app.player.wool.copy();
        } else {
            this.wool = new WoolStorage({persist: false});
        }

        var textViewOpts = {
            width: 80,
            height: 80,
            color: '#FFFFFF',
            fontFamily: 'delius',
            strokeWidth: 4,
            strokeColor: '#333333',
            size: 26,
            horizontalAlign: 'center',
            verticalAlign: 'middle'
        }, i, xPos = 0;

        this.counts = {};
        for (i = 0; i < constants.colors.length; i++) {
            this.counts[constants.colors[i].label] = new TextView(merge({
                superview: this,
                x: xPos,
                y: 0
            }, textViewOpts));
            xPos += 95;
            this.update(constants.colors[i]);
        }
    };

    this.update = function (color) {
        this.counts[color.label].setText(
            this.wool.get(color).count
        );
    };
});
