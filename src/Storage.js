/*
 * generic storage container with a localStorage interface
 */
import GCDataSource;

exports = Class(GCDataSource, function (supr) {
    this.idPrefix = '_unknown_';
    
    this.init = function (opts) {
        var preload;

        this.persist = opts.persist === undefined ? true : opts.persist;
        preload = opts.preload === undefined ? [] : opts.preload;
        delete opts.persist;
        delete opts.preload;

        supr(this, 'init', [opts]);

        this.on('Update', bind(this, function (key, item) {
            this.storeUpdate(key, item);
        }));

        this.on('Remove', bind(this, function (key, item) {
            this.storeRemove(key, item);
        }));

        this.add(preload);
    };

    /*
     * In subclasses, add a function to convert passed objfts to their keys
     *
     * This may be redundant with the 'ctor' option of GCDataSource, but I
     * can't find any examples of that so I'm staying the hell away from it.
     */
    this.toKey = null;

    /* helper for .add() which converts the key items into key strings */
    this.addArray = function (arr) {
        var i, item, arr = Array.slice.apply(arr);

        i = arr.length;
        while (i--) {
            item = arr[arr.length - i];
            item[this.key] = this.toKey(item[this.key]);
        }

        return supr(this, 'add', [arr]);
    };

    /*
     * Assuming this Storage has key === 'count', add counts from another
     * object into this one
     */
    this.mergeCounts = function (other) {
        var mine, key = this.key, tmp;

        other.forEach(function (otherItem, index) {
            tmp = {};

            for (prop in otherItem) {
                tmp[prop] = otherItem[prop];
            }

            mine = this.get(otherItem[key]);
            tmp.count = tmp.count + mine.count;
            this.add(tmp);

        }, this);

        return this;
    };

    /*
     * make a copy of the objects, probably for transient modifications
     */
    this.copy = function (persist) {
        var other = new Storage();
        for (prop in this) {
            other[prop] = this[prop];
        }
        other.persist = persist;
        return other;
    };

    /*
     * write this update out to localStorage
     */
    this.storeUpdate = function (key, item) {
        if (! this.persist) {
            return true;
        }
        assert(arguments.length === 1);
        localStorage['rams.' + sheep.color.label] = this.ramsSheared[sheep.color.label];

    };

    /*
     * apply this removal to localStorage
     */
    this.storeRemove = function (key, item) {
        if (! this.persist) {
            return true;
        }
        assert(arguments.length === 1);

    };
});
