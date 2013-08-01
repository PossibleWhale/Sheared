import animate;

import src.constants as constants;
import src.Button as Button;
import src.CraftScreen as CraftScreen;
import src.TextAnimation as TextAnimation;


var textOpts = merge({opacity: 0}, constants.TEXT_OPTIONS);

var SCRIPT = {
    a1:
    '3000|You get wool two different ways: by shearing sheep in the game, or by buying it in the store with Eweros.',
    a2:
    '2000|Your wool is shown here.',
/* [arrow] */
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
    '4000|Notice that some of the sweaters are gray. You don’t have enough wool to make those.',
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
    '5000|The first time you craft something, you get a star next to it to show that you have made one of these.',
/* <OK GOT IT> */
    h1:
    '6000|Items of black wool are more valuable than red, yellow or blue items, which are more valuable than white items.',
    h2:
    '3000|The more wool in an item, the more it’s worth.',
    h3:
    '3000|The more valuable wool used in the item, the more it’s worth.',
/* <OK GOT IT> */
/* [static frame of the store] */
    i1:
    '3000|Use the Eweros you earned to buy powerful upgrades in the game!'
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
            text: 'Back',
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
            text: 'OK, got it!',
            width: 160,
            height: 80,
            size: 128,
            autoFontSize: true,
            zIndex: 999
        });

        this.hideButtons("store");
        this.hideButtons("backButton");
        this.hideButtons("backButtonLabel");
    };

    this.step1 = function () {
        this.hideButtons("garment");
        this.hideButtons("craftBuy");
        this.hideButtons("craftStars");
        this.hideButtons("total");

        this._animateTexts(SCRIPT.a1,
                SCRIPT.a2,
                SCRIPT.b1,
                SCRIPT.c1,
                SCRIPT.d1,
                SCRIPT.e1,
                SCRIPT.f1,
                SCRIPT.f2,
                SCRIPT.f3,
                SCRIPT.g1,
                SCRIPT.g2,
                SCRIPT.h1,
                SCRIPT.h2,
                SCRIPT.h3,
                SCRIPT.i1);
    };

    /// this.clipperTutorial = function () {
    ///     this.nextButton.removeAllListeners();
    ///     var moveText = new TextView(merge({
    ///         superview: this,
    ///         text: 'Drag on the left side of the screen to move the clipper.',
    ///     }, textOpts)),
    ///     fireText = new TextView(merge({
    ///         superview: this,
    ///         text: 'Tap on the right side of the screen to fire a blade.',
    ///     }, textOpts));

    ///     animate(this.inputBuffer.leftSide).now({opacity: 0.1}, 1000).wait(2000).then({opacity: 0}, 1000);
    ///     animate(moveText).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function () {

    ///         animate(this.inputBuffer.rightSide).now({opacity: 0.1}, 1000).wait(2000).then({opacity: 0}, 1000);
    ///         animate(fireText).now({opacity: 1}, 1000).wait(2000).then({opacity: 0}, 1000).then(bind(this, function (){

    ///             this.addSubview(this.nextButton);
    ///             this.nextButton.on('InputSelect', bind(this, function () {
    ///                 this.nextButton.removeFromSuperview();
    ///                 this.eweTutorial();
    ///             }));
    ///         }));
    ///     }));
    /// };


    this._animate = function (view, timeout) {
        timeout = timeout ? timeout : 2000;
        return animate(view).now({opacity: 1}, 1000).wait(timeout).then({opacity: 0}, 1000);
    };

    this._animateTexts = function () {
        var opts1, anim, msgs, args = Array.prototype.slice.apply(arguments);

        opts1 = merge({superview: this}, textOpts);

        while (args.length) {
            var tan = new TextAnimation(args.shift(), opts1);
            var fn = tan.toClosure();
        }
    };

    /// this.tryAgain = function (fn) {
    ///     if (this.interval) {
    ///         clearInterval(this.interval);
    ///     }
    ///     var i = this.sheep.length;
    ///     while (i--) {
    ///         this.sheep[i].die();
    ///     }

    ///     var text = new TextView(merge({
    ///         superview: this,
    ///         text: 'Oops, try again',
    ///         opacity: 0
    ///     }, textOpts));
    ///     animate(text).now({opacity: 1}, 500).wait(1500).then({opacity:0}).then(bind(this, fn));
    /// };

});
