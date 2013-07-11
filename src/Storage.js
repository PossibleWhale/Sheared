/*
 * generic storage container with a localStorage interface
 */
import GCDataSource;

import src.constants as c;
import src.util as util;

assert = util.assert;


exports = Class(GCDataSource, function (supr) {
    this.name = null;
    this.key = null;

    this.init = function (opts) {
        var preload, opts = opts || {};

        this.schema = c.SCHEMA.stores[this.name];

        this.persist = opts.persist === undefined ? true : opts.persist;
        preload = opts.preload === undefined ? [] : opts.preload;
        delete opts.persist;
        delete opts.preload;

        opts['key'] = this.key;

        supr(this, 'init', [opts]);

        this.on('Update', bind(this, this.storeUpdate));
        this.on('Remove', bind(this, this.storeRemove));

        this.add(preload);

        if (this.persist) {
            this.verifySchema();
            this._storeName = 'pw_store_' + this.name;
        }
    };

    /*
     * create the database architecture in localStorage
     */
    this._initPWStorage = function () {
        var ls = localStorage;
        if (! ls.pw_version) {
            ls.pw_version = c.SCHEMA.version;
        }

        if (! ls.pw_stores) {
            ls.pw_stores = JSON.stringify(c.SCHEMA.stores);
        }
    };

    /*
     * check localStorage against our schema. abort if they don't match.
     */
    this.verifySchema = function () {
        var version, stores;

        version = parseInt(localStorage.pw_version, 10);
        if (! version) {
            this._initPWStorage();
            version = c.SCHEMA.version;
        }

        try {
            stores = JSON.parse(localStorage.pw_stores);
        } catch (e) {
            console.log('** JSON load error for: ' + localStorage.pw_stores);
        }

        assert(version === c.SCHEMA.version, 'schema version mismatch');
        assert(JSON.stringify(stores[this.name]) ===
               JSON.stringify(c.SCHEMA.stores[this.name]),
               'schema table ' + this.name + ' is not identical');
    };

    /*
     * check this item against our schema, abort if it doesn't match
     */
    this.verifyItem = function (item) {
        assert(item.keys().length === 2); // yep, we assume there is only a key/value
        assert(item[this.schema.key] !== undefined);
        assert(item[this.schema.value] !== undefined);
    };

    /*
     * In subclasses, add a function to convert passed objects to their keys
     *
     * This may be redundant with the 'ctor' option of GCDataSource, but I
     * can't find any examples of that so I'm staying the hell away from it.
     */
    this.toKey = function (item) {
        return item.toString();
    };

    /* helper for .add() which converts the key items into key strings */
    this.addArray = function (arr) {
        var i, item, arr = Array.prototype.slice.apply(arr);

        i = arr.length;
        while (i--) {
            item = arr[arr.length - 1 - i];
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
     * get from GCDataSource, and if not found, get from localStorage
     */
    this.get = function (key) {
        var ret, warmCacheMiss;
        ret = supr(this, 'get', [key]);
        if (ret === null) {

            // cold cache -- check localStorage first
            ret = localStorage[this._storeName + '.' + key];

            // if localStorage doesn't have it, remember that we checked
            // localStorage with the __wcm__ ("warm cache miss") marker
            if (ret === undefined) {
                warmCacheMiss = {__wcm__: true};
                warmCacheMiss[this.key] = key;
                this.add(warmCacheMiss);
            }

        } else if (ret.__wcm__) {
            ret = undefined;
        }
        return ret;
    };

    /*
     * make a copy of the objects, probably for transient modifications
     */
    this.copy = function (persist) {
        import src.Storage as Storage;

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
            return;
        }

        // warmCacheMiss should NEVER be stored in localStorage, and it
        // doesn't need to be verified against the schema
        if (item.__wcm__) {
            return;
        }

        this.verifyItem(item);
        var storageKey = this._storeName + '.' + key;
        localStorage[storageKey] = item;
    };

    /*
     * apply this removal to localStorage
     */
    this.storeRemove = function (key, item) {
        if (! this.persist) {
            return true;
        }
        this.verifyItem(item);
        var storageKey = this._storeName + '.' + key;
        delete localStorage[storageKey];
    };
});
