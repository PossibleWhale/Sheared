import animate;
import ui.ImageView as ImageView;
import ui.View as View;

import src.constants as c;
import src.Button as Button;
import src.CraftScreen as CraftScreen;
import src.util as util;
import src.ThoughtBubble as ThoughtBubble;
import src.Runner as Runner;
import src.Player as Player;
import src.Craft as Craft;


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
        this.context.addSubview(next);
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
        opts = opts || {};
        opts.player = new Player({persist: false});
        supr(this, 'init', [opts]);
        assert(this.player === opts.player);
        this.build();
    };

    this.build = function() {
        this.player.addWool('black', 512);
        this.player.addWool('white', 128);
        this.woolCounts.update();
        this.clickControl = new View({
            x: 0,
            y: 80,
            zIndex: 999,
            width: 1024,
            height: 496,
            opacity: 0.0,
            superview: this,
            canHandleEvents: false
        });

        this.nextButton = new Button({
            x: 412,
            y: 416,
            zIndex: 99999,
            width: 200,
            height: 64,
            click: true,
            image: 'resources/images/button-continue.png'
        });

        this.hideButtons("store");
    };

    // prevent all clicks except on the button
    this.clickOnlyHere = function _a_clickOnlyHere(button) {
        this.disableClicks();
        this.clickControl.addSubview(button);
        button.on('InputSelect', bind(this, function _a_clickOnlyHereClicked() {
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

        var nextButton = this.nextButton;

        var arrow1 = new ImageView({
            x: 0,
            y: 510,
            width: 58,
            height: 66,
            image: 'resources/images/arrow.png',
            superview: this,
            opacity: 0.0
        });

        var arrow2 = new ImageView({
            x: 0,
            y: 510,
            width: 58,
            height: 66,
            image: 'resources/images/arrow.png',
            superview: this,
            opacity: 0.0
        });

        var text1 = new ThoughtBubble({
            superview: this,
            text: 'Get wool two different ways: shear sheep in the game, or buy it in the store with Eweros.'
        }),
        text2 = new ThoughtBubble({
            superview: this,
            text: 'Your wool is shown here.'
        }),
        text3 = new ThoughtBubble({
            superview: this,
            text: 'You have wool, so you’re ready to craft!'
        });

        var animateTime = 500;

        _a = [
        _sx(['appear', text1, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text1.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 0}, {view: arrow1, x: 512-40, y: 84, r: 0}]),
        _sx(['appear', text2, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text2.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['disappear', arrow1, {duration: 0}]),
        _sx(['appear', text3, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text3.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        ];

        this.runner.run(_a);
        /**********************************************************/

        var text4 = new ThoughtBubble({
            superview: this,
            text: 'Craftable items are shown here.'
        }),
        text5 = new ThoughtBubble({
            superview: this,
            text: 'Click the tab for sweaters on the left.'
        });

        _b = [
        bind(this, function _a_showStuff() {
            this._cleanUI();
            this.showButtons('garment');
            this.showButtons('craftBuy');
            this.showButtons('tabs');
            this.disableClicks();
        }),
        _sx(['appear', text4, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text4.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', text5, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text5.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 0}, {view: arrow1, x: 190, y: 450, r: 4.30}]), /* highlight sweater tab */
        bind(this, function _a_waitSweater() {
            var btnNew = new Button({
                y:319, x:33, width:137, height:64, click: true
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

        var text6 = new ThoughtBubble({
            superview: this,
            text: 'Some of the sweaters are gray. You don’t have enough wool to make those.'
        }),
        text7 = new ThoughtBubble({
            superview: this,
            text: 'Click the black & white sweater in the bottom corner.'
        });

        _c = [
        _sx(['appear', text6, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text6.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', text7, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text7.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 0}, {view: arrow1, x: 175, y: 400, r: 1.30}]), /* highlight b&w sweater */
        bind(this, function _a_waitBWSweater() {
            var btnNew, next;
            btnNew = new Button({
                y: 309, x: 182, width: 60, height: 60,
                item: {
                    main: c.COLOR_BLACK,
                    contrast: c.COLOR_WHITE
                }
            });

            next = this.runner.waitPlain();
            btnNew.on('InputSelect', bind(this, function _on_clickBWSweater() {
                this.onCraftSelected(btnNew);
                assert(this.currentCraft.buyButton.getOpts().buyEnabled);
                next();
            }));
            this.clickOnlyHere(btnNew);
        }),
        _sx(['disappear', arrow1, {duration: 0}]),
        bind(this, this.disableClicks)
        ];

        this.runner.run(_c);
        /**********************************************************/

        var text8 = new ThoughtBubble({
            superview: this,
            text: 'The amount of wool to craft the sweater is shown on the left and right.'
        }),
        text9 = new ThoughtBubble({
            superview: this,
            text: 'The amount of Eweros you would earn by making it is shown in the top corner.'
        }),
        text10 = new ThoughtBubble({
            superview: this,
            text: 'Click ‘Craft’ to make this item.'
        });

        _d = [
        _sx(['appear', text8, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text8.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 613,
                 y: 321,
                 r: 0}]),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow2,
                 x: 893,
                 y: 321,
                 r: 0}]),
        _sx(['disappear', arrow1, {duration: 0}]),
        _sx(['disappear', arrow2, {duration: 0}]),
        _sx(['appear', text9, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text9.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 750},
                {view: arrow1,
                x: 900,
                y: 180,
                r: 0}]),
        _sx(['disappear', arrow1, {duration: 0}]),
        _sx(['appear', text10, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text10.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 730,
                 y: 400,
                 r: Math.PI / 2}]),
        bind(this, function _a_waitBuySweater() {
            var btnNew, next;
            btnNew = new Button({
                // 733, 405
                x: 733, y: 325, width: 96, height: 37
            });

            next = this.runner.waitPlain();
            btnNew.on('InputSelect', bind(this, function _on_clickBuyCraft() {
                this.currentCraft.purchased();
                next();
            }));
            this.clickOnlyHere(btnNew);
        }),
        _sx(['disappear', arrow1, {duration: 0}])
        ];

        this.runner.run(_d);
        /**********************************************************/

        var text11 = new ThoughtBubble({
            superview: this,
            text: 'You immediately receive the Eweros and your wool is immediately deducted.'
        }),
        text12 = new ThoughtBubble({
            superview: this,
            text: 'Once you craft at least one of something, you get a star next to it.'
        });

        _e = [
        _sx(['appear', text11, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text11.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', text12, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text12.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 230,
                 y: 450,
                 r: 0}]),
        _sx(['disappear', arrow1, {duration: 0}])
        ];

        this.runner.run(_e);
        /**********************************************************/

        var text13 = new ThoughtBubble({
            superview: this,
            text: 'Items of black wool are more valuable than red, yellow or blue items, which are more valuable than white.'
        }),
        text14 = new ThoughtBubble({
            superview: this,
            text: 'The more wool in an item, the more it’s worth.'
        });

        _f = [
        _sx(['appear', text13, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text13.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        _sx(['appear', text14, {duration: animateTime}]),
        bind(this, function () {
            var next = this.runner.waitPlain();
            this.addSubview(nextButton);
            nextButton.on('InputSelect', function () {
                text14.style.opacity = 0;
                nextButton.removeFromSuperview();
                nextButton.removeAllListeners();
                next();
            });
        }),
        ];

        this.runner.run(_f);
        /**********************************************************/

        _g = [
        _sx(['appear', 'image',
                {duration: 100},
                {image: 'resources/images/screenshot-store.png',
                x: 0, y: 0,
                width: 1024, height: 576,
                opacity: 0
                }]),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow1,
                 x: 200,
                 y: 280,
                 r: 1.2,
                 zIndex: 1000
                }]),
        _sx(['appear', 'arrow', {duration: 0},
                {view: arrow2,
                 x: 950,
                 y: 260,
                 r: 1.2 + Math.PI,
                 zIndex: 1000
                }]),
        _sx(['materialize', 'thought', {duration: 2000}, {text: 'Use the Eweros you earn to buy powerful upgrades in the game!'}]),
        _sx(['ok', 'ok']),
        bind(this, function _a_done() {
            this.getSuperview().pop();
        })
        ];

        this.runner.run(_g);

    };
});
