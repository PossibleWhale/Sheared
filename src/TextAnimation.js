import animate;
import ui.TextView;

import src.util as util;

exports = TextAnimation = function _a_TextAnimation(textItem, options) {
    this._parseMessage(textItem);
    this.textView = new ui.TextView(merge({text: this.msg}, options));
};

TextAnimation.prototype = {
    _parseMessage: function (msgIn) {
        var time, splits;
        util.assert(msgIn.indexOf('|') > 0, "Timeout not specified for message");

        splits = msgIn.split('|');
        time = parseInt(splits[0], 10);
        util.assert(time > 0, "Timeout should be a positive integer");
        this.msg = splits[1];
        this.time = time;
    },

    toClosure: function () {
        return bind(this, function _a_textAnimationClosure() {
            animate(this.textView)
                .now({opacity: 1}, 1000)
                .wait(this.time)
                .then({opacity: 0}, 1000)
                .wait(500);
        });
    }
};
