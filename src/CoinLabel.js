/*
 * View that shows the current eweros that the player has.
 */
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.constants as constants;


exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            width: 228,
            height: 64,
            clip: false,
            image: 'resources/images/label-eweros.png'
        });

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
            text: '' + GC.app.player.stats.get('coins').value
        });
    };

    this.update = function () {
        this.text.setText('' + GC.app.player.stats.get('coins').value);
    };
});
