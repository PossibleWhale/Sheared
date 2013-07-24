/*
 * generic storage container with a localStorage interface
 */
import GCDataSource;

import src.constants as c;
import src.util as util;

assert = util.assert;


Storage = Class(GCDataSource, function (supr) {
    var lsSet, lsGet;

    this.name = null;
    this.key = null;

    lsGet = bind(localStorage, localStorage.getItem);
    lsSet = bind(localStorage, localStorage.setItem);

    this.init = function _a_init(opts) {
        var opts = opts || {};

        this.schema = c.SCHEMA.stores[this.name];

        this.persist = opts.persist === undefined ? true : opts.persist;

        opts['key'] = this.key;


        supr(this, 'init', [opts]);


        this.on('Update', bind(this, this.storeUpdate));
        this.on('Remove', bind(this, this.storeRemove));

        if (this.persist) {
            this._storeName = 'pw_store_' + this.name;
            this.verifySchema();
        }
    };

    /*
     * create the database architecture in localStorage
     */
    this._initPWStorage = function _a_initPWStorage() {
        if (! lsGet('pw_version')) {
            lsSet('pw_version', c.SCHEMA.version);
        }

        if (! lsGet('pw_stores')) {
            lsSet('pw_stores', JSON.stringify(c.SCHEMA.stores));
        }
    };

    /*
     * check localStorage against our schema. abort if they don't match.
     */
    this.verifySchema = function _a_verifySchema() {
        var version, stores;

        version = parseInt(lsGet('pw_version'), 10);
        if (! version) {
            this._initPWStorage();
            version = c.SCHEMA.version;
        }

        try {
            stores = JSON.parse(lsGet('pw_stores'));
        } catch (e) {
            console.log('** JSON load error for: ' + lsGet('pw_stores'));
        }

        assert(version === c.SCHEMA.version, 'schema version mismatch');
        assert(JSON.stringify(stores[this.name]) ===
               JSON.stringify(c.SCHEMA.stores[this.name]),
               'schema table ' + this.name + ' is not identical');
    };

    /*
     * check this item against our schema, abort if it doesn't match
     */
    this.verifyItem = function _a_verifyItem(item) {
        var keyCount = 0;
        for (k in item) { // item.keys() not supported in this interpreter
            if (item.hasOwnProperty(k)) {
                keyCount++;
            }
        }
        assert(keyCount === 2); // yep, we assume there is only a key/value
        assert(item[this.schema.key] !== undefined);
        assert(item[this.schema.value] !== undefined);
    };

    /*
     * In subclasses, add a function to convert passed objects to their keys
     *
     * This may be redundant with the 'ctor' option of GCDataSource, but I
     * can't find any examples of that so I'm staying the hell away from it.
     */
    this.toKey = function _a_toKey(item) {
        return item.toString();
    };

    /* helper for .add() which converts the key items into key strings */
    this.addArray = function _a_addArray(arr) {
        var i, item;
        arr = Array.prototype.slice.apply(arr);

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
    this.mergeCounts = function _a_mergeCounts(other) {
        var mine, key = this.key, tmp;

        other.forEach(function _a_forEachStored(otherItem, index) {
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
    this.get = function _a_get(key) {
        var ret = supr(this, 'get', [key]);
        if (ret === null) {
            ret = lsGet(this._storeName + '.' + key);
            ret = ret ? JSON.parse(ret) : null;

            // Not ideal: if we've already checked, and the key isn't found in
            // the store, we should cache that fact. At the moment, that seems
            // like a premature optimization.

        }
        return ret;
    };

    /*
     * make a copy of the objects, probably for transient modifications
     */
    this.copy = function _a_copy(persist) {
        var other = new this.constructor();
        other.add(this.toArray());
        other.persist = persist;
        return other;
    };

    /*
     * write this update out to localStorage
     */
    this.storeUpdate = function _a_storeUpdate(key, item) {
        if (! this.persist) {
            return;
        }

        this.verifyItem(item);
        var storageKey = this._storeName + '.' + key;
        lsSet(storageKey, JSON.stringify(item));
    };

    /*
     * apply this removal to localStorage
     */
    this.storeRemove = function _a_storeRemove(key, item) {
        if (! this.persist) {
            return true;
        }
        this.verifyItem(item);
        var storageKey = this._storeName + '.' + key;
        localStorage.removeItem(storageKey);
    };
});

/*
 * this clears everything in localStorage IIF:
 * - app.debug is set,
 * - app.localConfig.reset exists,
 * - localStorage.pw_reset_key exists, and
 * - localStorage.pw_reset_key !== app.localConfig.reset.toString()
 */
Storage.reset = function _a_reset(resetKey, debug) {
    resetKey = resetKey ? resetKey.toString() : undefined;
    var storedKey = localStorage.getItem('pw_reset_key');
    if (resetKey && debug && storedKey && storedKey !== resetKey) {
        localStorage.clear();
        localStorage.setItem('pw_reset_key', resetKey);
        console.log("*********************** localStorage was cleared ****** pw_reset_key = " + resetKey);
        console.log("*********************** localStorage was cleared ****** pw_reset_key = " + resetKey);
        console.log("*********************** localStorage was cleared ****** pw_reset_key = " + resetKey);
    }
};

exports = Storage;
