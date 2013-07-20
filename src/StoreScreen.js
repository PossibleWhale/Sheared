import plugins.billing.billing as billing;
import ui.View as View;
import src.Button as Button;

exports = Class(View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 1024,
            height: 576,
            backgroundColor: '#000000'
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function() {
        this.addCoinsButton = new Button({
            superview: this,
            x: 1024/2 - 200,
            y: 576/2 - 100,
            width: 400,
            height: 200,
            text: 'Click to buy 1000 coins',
            color: '#000000',
            backgroundColor: '#FFFFFF'
        });

        this.addCoinsButton.on('InputSelect', function () {
            billing.purchase('coins');
        });

        billing.onPurchase = function (item) {
            console.log("purchased " + item); 
        };
    };
});

