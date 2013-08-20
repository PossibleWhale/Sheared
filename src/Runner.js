import ff;
import animate;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import event.Emitter as Emitter;

import src.util as util;

/*
 * Animation runners take an array of structured descriptions of animations
 * and animate them.
 */

var AbstractRunner = Class(Emitter, function _a_Runner(supr) {
    this.init = function _a_init(context) {
        this.fn = ff();
        if (context) {
            this.setContext(context);
        }
        supr(this, 'init', arguments);

        this.next = bind(this.fn, this.fn.next);
        this.waitPlain = bind(this.fn, this.fn.waitPlain);
        this.wait = bind(this.fn, this.fn.wait);
        this.slot = bind(this.fn, this.fn.slot);
        this.slotPlain = bind(this.fn, this.fn.slotPlain);
    };

    this.setContext = function _a_setContext(context) {
        this.context = context;
        util.assert(context.addSubview);
    };

    this.run = function _a_run(script) {
        var meth, runAnimation, step, factory, factoryArgs;
        script = script.slice();

        while (script.length) {
            step = script.shift();
            if (typeof step === 'function' ) {
                this._runFunction(step);
            } else {
                this._runObject(step);
            }
        }
    };

    this._runFunction = function _a_runFunction(step) {
        this.next(step);
    };

    this.passThroughFactory = function _a_passThroughFactory(view) {
        return view;
    };

    this._runObject = function _a_runObject(step) {
        step = merge({}, step); // copy the object before use

        if (typeof step.method === 'string') {
            meth = this['animation_' + step.method];
        } else {
            meth = step.method;
        }
        util.assert(meth);

        if (typeof step.factory === 'string') {
            // look up the factory by its string name
            factory = this['factory_' + step.factory];

        } else if (typeof step.factory === 'object' && step.factory.style) {
            // object IS a view. wrap it in a function that just returns it.
            factory = bind(this, this.passThroughFactory, step.factory);

        } else {
            // object is a function. call it and hope we get a view back.
            factory = step.factory;
        };

        util.assert(factory);

        runAnimation = function _a_runAnimation(method, fac, fargs, margs) {
            var view = fac.call(this, fargs);
            return method.call(this, animate(view), margs);
        };

        this.next(bind(this, runAnimation, meth, factory, step.factoryArgs, step.methodArgs));
    };

});

/*
 * a Runner with appear, disappear, materialize and factories for text and
 * image
 */
var BasicRunner = Class(AbstractRunner, function _a_BasicRunner (supr) {
    var textArgs, imageArgs, appearArgs, disappearArgs;

    textArgs = { opacity: 0.0,
        color: '#fff',
        width: 1024,
        height: 576
    };

    imageArgs = {};

    appearArgs = [{opacity: 1.0}, 600, animate.linear];
    disappearArgs = [{opacity: 0.0}, 600, animate.linear];


    this.animation_appear = function _a_appear(animation, obj) {
        return animation.then.apply(animation, appearArgs).wait(obj.duration)
            .then(this.waitPlain());
    };

    this.animation_disappear = function _a_disappear(animation, obj) {
        return animation.then.apply(animation, disappearArgs).wait(obj.duration)
            .then(this.waitPlain());
    };

    /*
     * appear and then disappear
     */
    this.animation_materialize = function _a_materialize(animation, obj) {
        var _cleanup, cleanup = (obj.cleanup === undefined ? true : obj.cleanup);
        _cleanup = bind(animation.subject, function _a_cleanup() {
            if (cleanup) {
                this.getSuperview().removeSubview(this);
            }
        });
        return animation.then.apply(animation, appearArgs).wait(obj.duration)
            .then.apply(animation, disappearArgs).wait(600)
            .then(_cleanup)
            .then(this.waitPlain());
    };

    this.factory_text = function _a_tvFactory(obj) {
        return new TextView(merge({text: obj.text, superview: this.context}, textArgs));
    };

    this.factory_image = function _a_imageFactory(obj) {
        return new ImageView(merge(merge({superview: this.context}, obj), imageArgs));
    };

});

exports = BasicRunner;
