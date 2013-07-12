/*
 * Miscellaneous utility functions
 */

exports = {
    /*
     *  shuffle(array) => shallow copy of array, shuffled randomly
     */
    shuffle: function (list) {
        var ret = list.slice(0);
        var i, j, t;
        for (i = 1; i < ret.length; i++) {
            j = Math.floor(Math.random() * (1 + i));  // choose j in [0..i]
            if (j != i) {
                t = ret[i];                        // swap ret[i] and ret[j]
                ret[i] = ret[j];
                ret[j] = t;
            }
        }
        return ret;
    },

    /*
     *  choice(array) => randomly chosen item from list
     */
    choice: function (list) {
        var j = Math.floor(Math.random() * list.length);
        return list[j];
    },

    /*
     * Catch an event, and issue a new event on the target object
     *
     * Since GC events do not bubble or capture, this is useful for catching
     * an event in one place and issuing it in a more specific form somewhere
     * else.
     *
     * If you need to do anything besides emit a new event, you should write
     * an .on() handler.
     *
     * All event arguments are also passed through.
     */
    reissue: function (sourceObject, sourceEvent, targetObject, targetEvent) {
        sourceObject.on(sourceEvent, bind(targetObject, function () {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 0, targetEvent);
            targetObject.emit.apply(targetObject, args);
        }));
    },

    /*
     * Take a number and a length and return a string with
     * enough leading zeroes to meet the length
     */
    zeroPad: function (number, length) {
        var ret = '' + number, i = length - ret.length;
        while (i--) {
            ret = '0' + ret;
        }
        return ret;
    }
}

