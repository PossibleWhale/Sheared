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
    this.init = function _a_init() {
        this.fn = ff();
        supr(this, 'init', arguments);

        this.next = bind(this.fn, this.fn.next);
        this.waitPlain = bind(this.fn, this.fn.waitPlain);
        this.wait = bind(this.fn, this.fn.wait);
        this.slot = bind(this.fn, this.fn.slo);
        this.slotPlain = bind(this.fn, this.fn.slotPlain);
    };

    this.run = function _a_run(context, script) {
        var meth, runAnimation, step, factory, factoryArgs;
        if (isArray(context)) {
            script = context;
            context = this;
        }
        util.assert(context.addSubview);
        script = script.slice();

        while (script.length) {
            step = merge({}, script.shift());
            if (typeof step.method === 'string') {
                meth = this['animation_' + step.method];
            } else {
                meth = step.method;
            }
            util.assert(meth);

            if (typeof step.factory === 'string') {
                factory = this['factory_' + step.factory];
            } else {
                factory = step.factory;
            };
            util.assert(factory);

            runAnimation = function _a_runAnimation(method, fac, fargs, margs) {
                var view = fac.call(this, fargs);
                return method.call(this, animate(view), margs);
            };

            factoryArgs = merge({context: context}, step.factoryArgs);
            console.log(factory);
            this.next(bind(this, runAnimation, meth, factory, factoryArgs, step.methodArgs));
        }
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
        return animation.then.apply(animation, appearArgs).wait(obj.duration)
            .then.apply(animation, disappearArgs).wait(600)
            .then(this.waitPlain());
    };

    this.factory_text = function _a_tvFactory(obj) {
        return new TextView(merge({text: obj.text, superview: obj.context}, textArgs));
    };

    this.factory_image = function _a_imageFactory(obj) {
        return new ImageView(merge(merge({superview: obj.context}, obj), imageArgs));
    };

});

exports = BasicRunner;
