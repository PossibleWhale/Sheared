import animate;
import ui.ImageView as ImageView;
import ui.View as View;

import src.constants as c;
import src.Button as Button;
import src.CraftScreen as CraftScreen;
import src.util as util;
import src.ThoughtBubble as ThoughtBubble;
import src.Runner as Runner;

var textOpts = c.TEXT_OPTIONS;


var _sx = function _a_sx(arr) {
    return {
        method: arr[0],
        factory: arr[1],
        methodArgs: arr[2],
        factoryArgs: arr[3]
    };
};




var TutorialRunner = Class(Runner, function _a_TutorialRunner(supr) {
    // handle the continue click by hiding the button
    this.animation_ok = function _a_animation_ok(animation, _) {
        return animation.then({opacity: 1.0}, 600, animate.linear);
    };

    // create the 'Continue >' button
    this.factory_ok = function _a_factory_ok(obj) {
        var next = this.context.nextButton;
        next.removeAllListeners();
        next.on('InputSelect', bind(this, function () {
            next.updateOpts({opacity: 0.0});
        }));
        next.on('InputSelect', this.waitPlain());
        return next;
    };

    // fade in, and then fade out text in a thought bubble
    this.factory_thought = function _a_factory_thought(fargs) {
        return new ThoughtBubble({superview: this.context, text: fargs.text});
    };

    this.factory_arrow = function _a_factory_arrow(fargs) {
        var view = fargs.view;
        delete fargs.view;
        view.updateOpts(fargs);
        return view;
    };
});



exports = Class(CraftScreen, function (supr) {
    this.init = function (opts) {
        supr(this, 'init', [opts]);
        this.build();
    };

    this.build = function() {
        this.clickControl = new View({
            x: 0,
            y: 0,
            infinite: true,
            opacity: 0.0,
            superview: this,
            canHandleEvents: false
        });

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

    // prevent all clicks except on the button
    this.clickOnlyHere = function _a_clickOnlyHere(button) {
        this.disableClicks();
        this.clickControl.addSubview(button);
        button.once('InputSelect', bind(this, function _a_clickOnlyHereClicked() {
            this.clickControl.removeSubview(button);
            this.clickAnywhere();
        }));
    };

    // re-enable clicks anywhere
    this.clickAnywhere = function _a_clickAnywhere() {
        this.clickControl.setHandleEvents(false);
    };

    // turn off all clicking
    this.disableClicks = function _a_disableClicks() {
        assert(this.clickControl.getSubviews().length < 2);
        this.clickControl.removeAllSubviews();
        this.clickControl.setHandleEvents(true);
    };

    // run the entire tutorial
    this.tutor = function () {
        var _a, _b, _c, _d, _e, _f, _g;

        this.runner = new TutorialRunner(this);

        this.hideButtons("garment");
        this.hideButtons("craftBuy");
        this.hideButtons("craftStars");
        this.hideButtons("total");

        var arrow1 = new ImageView({
            width: 58,
            height: 66,
            image: 'resources/images/arrow.png',
            superview: this,
            opacity: 0.0
        });

        var arrow2 = new ImageView({
            width: 58,
            height: 66,
            image: 'resources/images/arrow.png',
            superview: this,
            opacity: 0.0
        });

        _a = [
        _sx(['materialize', 'thought', {duration: 3000}, {text: 'Get wool two different ways: shear sheep in the game, or buy it in the store with Eweros.'}]),
        _sx(['appear', 'arrow', {duration: 0}, {view: arrow1, x: 512-40, y: 84, r: 0}]),
        _sx(['materialize', 'thought', {duration: 2000}, {text: 'Your wool is shown here.'}]),
        _sx(['disappear', arrow1, {duration: 0}]),
        _sx(['materialize', 'thought', {duration: 2000}, {text: 'You have wool, so you’re ready to craft!'}]),
        _sx(['ok', 'ok'])
        ];

        this.runner.run(_a);
        /**********************************************************/

        _b = [
        bind(this, function _a_showStuff() {
            this._cleanUI();
            this.showButtons('garment');
            this.showButtons('craftBuy');
            this.showButtons('tabs');
            this.disableClicks();
        }),
        _sx(['materialize', 'thought', {duration: 2000}, {text: 'Craftable items are shown here.'}]),
        _sx(['materialize', 'thought', {duration: 2000}, {text: 'Click the tab for sweaters on the left.'}]),
        _sx(['appear', 'arrow', {duration: 0}, {view: arrow1, x: 190, y: 450, r: 4.30}]), /* highlight sweater tab */
        bind(this, function _a_waitSweater() {
            var btnNew = new Button({
                y:399, x:33, width:137, height:64
            });
            var next = this.runner.waitPlain();
            btnNew.on('InputSelect', bind(this, function _on_clickSweater() {
                this.setGarment(c.GARMENT_SWEATER);
                next();
            }));
            this.clickOnlyHere(btnNew);
        }),
        _sx(['disappear', arrow1, {duration: 0}]),
        bind(this, this.disableClicks)
        ];

        this.runner.run(_b);
        /**********************************************************/

        _c = [
        _sx(['materialize', 'thought', {duration: 4000}, {text: 'Some of the sweaters are gray. You don’t have enough wool to make those.'}]),
        _sx(['materialize', 'thought', {duration: 3000}, {text: 'Click the black & white sweater in the bottom corner.'}]),
        _sx(['appear', 'arrow', {duration: 0}, {view: arrow1, x: 175, y: 400, r: 1.30}]), /* highlight b&w sweater */
        bind(this, function _a_waitBWSweater() {
            var btnNew, next;
            btnNew = new Button({
                y: 389, x: 182, width: 60, height: 60
            });

            next = this.runner.waitPlain();
            btnNew.on('InputSelect', bind(this, function _on_clickBWSweater() {
                this.showLargeCraft({main: c.COLOR_BLACK, contrast: c.COLOR_WHITE});
                next();
            }));
            this.clickOnlyHere(btnNew);
        }),
        _sx(['disappear', arrow1, {duration: 0}]),
        bind(this, this.disableClicks)
        ];

        this.runner.run(_c);
        /**********************************************************/

        _d = [
        _sx(['materialize', 'thought', {duration: 4000}, {text: 'The amount of wool to craft the sweater is shown on the left and right.'}]),
        _sx(['appear', 'arrow', {duration: 750},
                {view: arrow1,
                 x: 613,
                 y: 321,
                 r: 0}]),
        _sx(['appear', 'arrow', {duration: 750},
                {view: arrow2,
                 x: 893,
                 y: 321,
                 r: 0}]),
        _sx(['disappear', arrow1, {duration: 0}]),
        _sx(['disappear', arrow2, {duration: 0}]),
        _sx(['materialize', 'thought', {duration: 4000}, {text: 'The amount of Eweros you would earn by making it is shown in the top corner.'}]),
        _sx(['appear', 'arrow', {duration: 750},
                {view: arrow1,
                x: 900,
                y: 180,
                r: 0}]),
        _sx(['disappear', arrow1, {duration: 0}]),
        _sx(['materialize', 'thought', {duration: 2000}, {text: 'Click ‘Craft’ to make this item.'}]),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 730,
                 y: 400,
                 r: Math.PI / 2}]),
        bind(this, function _a_waitBuySweater() {
            var btnNew, next;
            btnNew = new Button({
                x: 734, y: 408, width: 96, height: 37
            });

            next = this.runner.waitPlain();
            btnNew.on('InputSelect', bind(this, function _on_clickBuyCraft() {
                this.selectedCraft.purchased();
                next();
            }));
            this.clickOnlyHere(btnNew);
        }),
        _sx(['disappear', arrow1, {duration: 0}])
        ];

        this.runner.run(_d);
        /**********************************************************/

        _e = [
        _sx(['materialize', 'thought', {duration: 4000}, {text: 'You immediately receive the Eweros and your wool is immediately deducted.'}]),
        _sx(['materialize', 'thought', {duration: 3500}, {text: 'Once you craft at least one of something, you get a star next to it.'}]),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 230,
                 y: 450,
                 r: 0}]),
        _sx(['ok', 'ok']),
        _sx(['disappear', arrow1, {duration: 0}])
        ];

        this.runner.run(_e);
        /**********************************************************/

        _f = [
        _sx(['materialize', 'thought', {duration: 6000}, {text: 'Items of black wool are more valuable than red, yellow or blue items, which are more valuable than white.'}]),
        _sx(['materialize', 'thought', {duration: 3000}, {text: 'The more wool in an item, the more it’s worth.'}]),
        _sx(['materialize', 'thought', {duration: 3500}, {text: 'The more valuable wool used in the item, the more it’s worth.'}]),
        _sx(['ok', 'ok'])
        ];

        this.runner.run(_f);
        /**********************************************************/

        _g = [
        _sx(['appear', 'text', {duration: 100}, {text: 'SCREENSHOT OF THE STORE SCREEN'}]),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 350,
                 y: 250,
                 r: Math.PI /2
        }]),
        // screenshot of the store screen
        _sx(['materialize', 'thought', {duration: 3000}, {text: 'Use the Eweros you earn to buy powerful upgrades in the game!'}]),
        _sx(['ok', 'ok']),
        bind(this, function _a_done() {
            this.getSuperview().pop();
        })
        ];

        this.runner.run(_g);

    };
});
