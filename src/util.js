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
    }
}
