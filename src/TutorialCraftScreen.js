import animate;
import ui.ImageView as ImageView;

import src.constants as constants;
import src.Button as Button;
import src.CraftScreen as CraftScreen;
import src.TextAnimation as TextAnimation;
import src.util as util;


var textOpts = constants.TEXT_OPTIONS;

var SCRIPT = {
    a1:
    '3000|Get wool two different ways: shear sheep in the game, or buy it in the store with Eweros.',
    a2:
    '2000|Your wool is shown here.',
    a3Arrow:
    'resources/images/arrow.png',

    b1:
    '2000|You have wool, so you’re ready to craft!',
/* <OK GOT IT> */

/* [show the 20 item catalog and tabs] */
    c1:
    '2000|Craftable items are shown here.',
    c2:
    '2000|Click the tab for sweaters on the left.',

/* [wait for click] */
    d1:
    '4000|Some of the sweaters are gray. You don’t have enough wool to make those.',

/* [highlight b&w sweater] */
    e1:
    '3000|Click the black & white sweater in the bottom corner.',
/* [wait for click] */

/* [large b&w sweater is shown] */
    f1:
    '4000|The amount of wool to craft the sweater is shown on the left and right.',
    f2:
    '4000|The amount of Eweros you would earn by making it is shown in the top corner.',
    f3:
    '2000|Click ‘Craft’ to make this item.',
/* [wait for click] */

/* [eweros added and wool deducted and star lights up] */
    g1:
    '4000|You immediately receive the Eweros and your wool is immediately deducted.',
    g2:
    '5000|Once you craft at least one of something, you get a star next to it.',
/* <OK GOT IT> */

    h1:
    '6000|Items of black wool are more valuable than red, yellow or blue items, which are more valuable than white.',
    h2:
    '3000|The more wool in an item, the more it’s worth.',
    h3:
    '3000|The more valuable wool used in the item, the more it’s worth.',
/* <OK GOT IT> */

    i1Store:
    'resources/images/store-screenshot.png',
    i2:
    '3000|Use the Eweros you earn to buy powerful upgrades in the game!'
};

exports = Class(CraftScreen, function (supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        var backButton = new Button({
            superview: this,
            x: 0,
            y: 0,
            backgroundColor: '#FF00FF',
            color: '#000000',
            fontFamily: 'delius',
            text: '< Back',
            width: 140,
            height: 60,
            size: 128,
            autoFontSize: true,
            zIndex: 999
        });
        backButton.on('InputSelect', bind(this, function () {
            this.removeAllSubviews();
            this.getSuperview().pop();
        }));
        this.nextButton = new Button({
            x: 1024 - 160,
            y: 576 - 80,
            backgroundColor: '#FF00FF',
            color: '#000000',
            fontFamily: 'delius',
            text: 'OK, got it! >',
            width: 160,
            height: 80,
            size: 128,
            autoFontSize: true,
            zIndex: 999,
            superview: this
        });

        this.nextButton.hide();

        this.hideButtons("store");
        this.hideButtons("backButton");
    };

    this._animateTexts = function () {
        var tan, opts1, args = Array.prototype.slice.apply(arguments);

        opts1 = merge({superview: this}, textOpts);

        _r = function _a_r(items) {
            util.assert(items.length, "no items to animate");
            textItem = items.shift();
            tan = new TextAnimation(textItem, opts1);
            if (items.length) {
                return tan.animate().then(bind(this, _r, items));
            } else {
                return tan.animate();
            }
        };

        return _r(args);

    };

    this.appear = function (view, timeout) {
        return animate(view).then({opacity: 1.0}, 500, animate.linear).wait(timeout || 1000);
    };

    this.disappear = function (view) {
        return animate(view).then({opacity: 0.0}, 500, animate.linear);
    };

    this.next = function (callback) {
        this.nextButton.show();
        this.nextButton.on('InputSelect', bind(this, function () {
            this.nextButton.hide();
            return callback();
        }));
    };

    this.stepA = function () {
        this.hideButtons("garment");
        this.hideButtons("craftBuy");
        this.hideButtons("craftStars");
        this.hideButtons("total");

        var arrow = new ImageView(
                {superview: this, x: 512-29, y: 130, width: 58, height: 66, image: SCRIPT.a3Arrow, opacity: 0.0}
        );
        this._animateTexts(SCRIPT.a1, SCRIPT.a2).then(
            bind(this, function () {
                return this.appear(arrow, 1000).then(
                    bind(this, function () {
                        return this.next(bind(this, function () {
                            return this.disappear(arrow).then(
                                bind(this, function () {
                                    return this.stepB();
                            }));
                        }));
                    })
                );
            })
        );
    };

    this.stepB = function () {
        return this._animateTexts(SCRIPT.b1).then(
            bind(this, this.next, bind(this, this.stepC))
        );
    };

    this.stepC = function () {
        return this._animateTexts(SCRIPT.c1).then(
            bind(this, this.next, bind(this, this.stepD))
        );
    };

    this.stepD = function () {
        return this._animateTexts(SCRIPT.d1).then(
            bind(this, this.next, bind(this, this.stepE))
        );
    };

    this.stepE = function () {
        return this._animateTexts(SCRIPT.e1).then(
            bind(this, this.next, bind(this, this.stepF))
        );
    };

    this.stepF = function () {
        return this._animateTexts(SCRIPT.f1, SCRIPT.f2, SCRIPT.f3).then(
            bind(this, this.next, bind(this, this.stepG))
        );
    };

    this.stepG = function () {
        return this._animateTexts(SCRIPT.g1, SCRIPT.g2).then(
            bind(this, this.next, bind(this, this.stepH))
        );
    };

    this.stepH = function () {
        return this._animateTexts(SCRIPT.h1, SCRIPT.h2, SCRIPT.h3).then(
            bind(this, this.next, bind(this, this.stepI))
        );
    };

    this.stepI = function () {
        return this.appear(SCRIPT.i1Store).then(
            bind(this, this._animateTexts, SCRIPT.i2)
        );
    };

});
