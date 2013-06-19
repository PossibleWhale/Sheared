import ui.ImageView as ImageView;

exports = Class(ImageView, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            image: 'resources/images/16x9/field-dev.png',
            autoSize: true
        });

        supr(this, 'init', [opts]);
    };
});
