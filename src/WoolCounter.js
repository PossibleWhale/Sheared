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
            height: 21,
            width: 290,
            clip: false
        });

        supr(this, 'init', [opts]);

        var persist = opts.persist === undefined ? true : opts.persist;
        if (persist) {
            this.wool = GC.app.player.wool;
        } else {
            this.wool = new WoolStorage({persist: false});
        }

        var textViewOpts = {
            width: 50,
            height: 21,
            color: '#FFFFFF',
            fontFamily: 'delius',
            strokeWidth: 3,
            strokeColor: '#333333'
        }, i, xPos = 0;

        this.counts = {};
        for (i = 0; i < constants.colors.length; i++) {
            this.counts[constants.colors[i].label] = new TextView(merge({
                superview: this,
                x: xPos,
                y: 0
            }, textViewOpts));
            xPos += 60;
        }

        this.update();
    };

    this.update = function () {
        var i = constants.colors.length;
        while (i--) {
            this.counts[constants.colors[i].label].setText(
                this.wool.get(constants.colors[i]).count
            );
        }
    };
});
