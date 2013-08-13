import animate;
import ui.ImageView as ImageView;

import src.constants as constants;
import src.Button as Button;
import src.CraftScreen as CraftScreen;
import src.TextAnimation as TextAnimation;
import src.util as util;
import src.ThoughtBubble as ThoughtBubble;
import src.Runner as Runner;

var textOpts = constants.TEXT_OPTIONS;


var _sx = function _a_sx(arr) {
    return {
        method: arr[0],
        factory: arr[1],
        methodArgs: arr[2],
        factoryArgs: arr[3]
    };
};


var SCRIPT = {
    a: [
    _sx(['materialize', 'thought', {duration: 3000}, {text: 'Get wool two different ways: shear sheep in the game, or buy it in the store with Eweros.'}]),
    _sx(['appear', 'image', 0, {x: 512-29, y: 84, width: 58, height: 66, image: 'resources/images/arrow.png'}]),
    _sx(['materialize', 'thought', {duration: 2000}, {text: 'Your wool is shown here.'}]),
    _sx(['materialize', 'thought', {duration: 2000}, {text: 'You have wool, so you’re ready to craft!'}]),
    _sx(['ok', 'ok'])
    ],

    b: [
    /* [show the 20 item catalog and tabs] */
    _sx(['materialize', 'thought', {duration: 2000}, {text: 'Craftable items are shown here.'}]),
    _sx(['materialize', 'thought', {duration: 2000}, {text: 'Click the tab for sweaters on the left.'}])
    /* [wait for click] */
    ]

    // c: [
    // _sx(['materialize', 'thought', {duration: 4000}, {text: 'Some of the sweaters are gray. You don’t have enough wool to make those.'}]),
    // _sx(['materialize', 'image', 0, {x: 100, y: 400, width: 58, height: 66, image: 'resources/images/arrow.png'}]), /* [highlight b&w sweater] */
    // _sx(['materialize', 'thought', {duration: 3000}, {text: 'Click the black & white sweater in the bottom corner.'}])
    // /* [wait for click] */ /* [large b&w sweater is shown] */
    // ],

    // d: [
    // _sx(['materialize', 'thought', {duration: 4000}, {text: 'The amount of wool to craft the sweater is shown on the left and right.'}]),
    // _sx(['appear', 'image', 1, {x: 600, y: 200, width: 58, height: 66, image: 'resources/images/arrow.png'}]),
    // _sx(['appear', 'image', 1, {x: 900, y: 200, width: 58, height: 66, image: 'resources/images/arrow.png'}]),
    // _sx(['materialize', 'thought', {duration: 4000}, {text: 'The amount of Eweros you would earn by making it is shown in the top corner.'}]),
    // _sx(['appear', 'image', 1, {x: 900, y: 84, width: 58, height: 66, image: 'resources/images/arrow.png'}]),
    // _sx(['materialize', 'thought', {duration: 2000}, {text: 'Click ‘Craft’ to make this item.'}])
    // /* [wait for click] */ /* [eweros added and wool deducted and star lights up] */
    // ],

    // e: [
    // _sx(['materialize', 'thought', {duration: 4000}, {text: 'You immediately receive the Eweros and your wool is immediately deducted.'}]),
    // _sx(['materialize', 'thought', {duration: 5000}, {text: 'Once you craft at least one of something, you get a star next to it.'}]),
    // _sx(['materialize', 'image', 1, {x: 600, y: 310, width: 58, height: 66, image: 'resources/images/arrow.png'}]),
    // _sx(['ok', 'ok'])
    // ],

    // f: [
    // _sx(['materialize', 'thought', {duration: 6000}, {text: 'Items of black wool are more valuable than red, yellow or blue items, which are more valuable than white.'}]),
    // _sx(['materialize', 'thought', {duration: 3000}, {text: 'The more wool in an item, the more it’s worth.'}]),
    // _sx(['materialize', 'thought', {duration: 3000}, {text: 'The more valuable wool used in the item, the more it’s worth.'}]),
    // _sx(['ok', 'ok'])
    // ],

    // g: [
    // _sx(['appear', 'image', 0, {x:0, y: 0, width: 1024, height: 576, image: 'resources/images/store-screenshot.png'}]),
    // _sx(['materialize', 'thought', {duration: 3000}, {text: 'Use the Eweros you earn to buy powerful upgrades in the game!'}])
    // ]
};


var TutorialRunner = Class(Runner, function _a_TutorialRunner(supr) {
    this.animation_ok = function _a_animation_ok(animation, _) {
        return animation.then({opacity: 1.0}, 600, animate.linear);
    };

    this.factory_ok = function _a_factory_ok(obj) {
        var next = obj.context.nextButton;
        next.removeAllListeners();
        next.on('InputSelect', bind(this, function () {
            next.updateOpts({opacity: 0.0});
        }));
        next.on('InputSelect', this.waitPlain());
        return next;
    };

    this.factory_thought = function _a_factory_thought(obj, fargs) {
        return new ThoughtBubble({superview: obj.context, text: obj.text});
    };
});



exports = Class(CraftScreen, function (supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        this.nextButton = new ImageView({
            x: 404,
            y: 253,
            zIndex: 9999,
            width: 215,
            height: 70,
            image: 'resources/images/button-continue.png',
            superview: this,
            opacity: 0.0
        });

        this.hideButtons("store");
        this.hideButtons("backButton");
    };

    this.tutor = function () {
        this.runner = new TutorialRunner();

        this.hideButtons("garment");
        this.hideButtons("craftBuy");
        this.hideButtons("craftStars");
        this.hideButtons("total");

        this.runner.run(this, SCRIPT.a);
        this.runner.run(this, SCRIPT.b);
    };
});
