/*
 * View that shows the current eweros that the player has.
 */
import ui.ImageView as ImageView;
import ui.TextView as TextView;

import src.constants as constants;
import src.util as util;


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 228,
            height: 64,
            clip: false,
            image: 'resources/images/label-eweros.png'
        });

        util.assert(opts.stats, "opts.stats is required in CoinLabel's options");
        this.stats = opts.stats;
        delete opts.stats;

        supr(this, 'init', [opts]);

        this.text = new TextView({
            superview: this,
            x: 53,
            y: 15,
            width: 150,
            height: 28,
            color: '#333333',
            fontFamily: 'delius',
            size: 24,
            horizontalAlign: 'left',
            text: '' + this.stats.get('coins').value
        });
    };

    this.update = function () {
        this.text.setText('' + this.stats.get('coins').value);
    };
});
