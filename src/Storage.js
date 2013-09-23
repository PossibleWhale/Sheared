/*
 * generic storage container with a localStorage interface
 */
import GCDataSource;

import src.constants as c;
import src.util as util;

assert = util.assert;


// For testing, this might be useful:
//
// function LocalStorage() {
//     this.db = {};
// };
//
//
// LocalStorage.prototype = {
//     getItem: function (key) {
//         return this.db[key];
//     },
//
//     setItem: function (key, value) {
//         util.assert(typeof key === 'string');
//         this.db[key] = JSON.stringify(value);
//     }
// };
//
// GC.localStorage = new LocalStorage;


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

    /*
     * This update adds pw_store_upgrade for in-app purchases.
     * No special initialization required, just update pw_stores.
     */
    this.upgrade_1_to_2 = function _a_upgrade_1_to_2() {
        assert(parseInt(lsGet('pw_version'), 10) === 1);
        lsSet('pw_version', 2);
        lsSet('pw_stores', JSON.stringify(c.SCHEMA.stores));
    };

    this.upgrade_2_to_3 = function _a_upgrade_2_to_3() {
        assert(parseInt(lsGet('pw_version'), 10) === 2);
        lsSet('pw_version', 3);
        lsSet('pw_store_upgrade.adFree', JSON.stringify({name: 'adFree', value: false}));
    };

    this.upgrade_3_to_4 = function _a_upgrade_3_to_4() {
        assert(parseInt(lsGet('pw_version'), 10) === 3);
        lsSet('pw_version', 4);
        lsSet('pw_stores', JSON.stringify(c.SCHEMA.stores));
    };

    this.upgrade_4_to_5 = function _a_upgrade_4_to_5() {
        assert(parseInt(lsGet('pw_version'), 10) === 4);
        lsSet('pw_version', 5);
        lsSet('pw_store_stat.wool', JSON.stringify({name: 'wool', value: 0}));
        lsSet('pw_store_stat.ewesSheared', JSON.stringify({name: 'ewesSheared', value: 0}));
        lsSet('pw_store_stat.ramsSheared', JSON.stringify({name: 'ramsSheared', value: 0}));
    };

    this.upgrade_5_to_6 = function _a_upgrade_5_to_6() {
        assert(parseInt(lsGet('pw_version'), 10) === 5);
        lsSet('pw_version', 6);
        lsSet('pw_store_upgrade.blade', JSON.stringify({name: 'blade', value: 1}));
    };

    this.upgrade_6_to_7 = function _a_upgrade_6_to_7() {
        assert(parseInt(lsGet('pw_version'), 10) === 6);
        lsSet('pw_version', 7);
        lsSet('pw_store_award.bladepower.1', JSON.stringify({name: 'bladepower.1', value: false}));
        lsSet('pw_store_award.bladepower.2', JSON.stringify({name: 'bladepower.2', value: false}));
        lsSet('pw_store_award.bladepower.3', JSON.stringify({name: 'bladepower.3', value: false}));
        lsSet('pw_store_award.bladepower.4', JSON.stringify({name: 'bladepower.4', value: false}));
        lsSet('pw_store_award.bladepower.max', JSON.stringify({name: 'bladepower.max', value: false}));
    };

    this.upgrade_7_to_8 = function _a_upgrade_7_to_8() {
        assert(parseInt(lsGet('pw_version'), 10) === 7);
        lsSet('pw_version', 8);
        lsSet('pw_store_award.ewes.gold.5', JSON.stringify({name: 'ewes.gold.5', value: false}));
        lsSet('pw_store_award.ewes.gold.50', JSON.stringify({name: 'ewes.gold.50', value: false}));
        lsSet('pw_store_award.ewes.gold.500', JSON.stringify({name: 'ewes.gold.500', value: false}));
        lsSet('pw_store_award.ewes.gold.5000', JSON.stringify({name: 'ewes.gold.5000', value: false}));
        lsSet('pw_store_award.ewes.gold.50000', JSON.stringify({name: 'ewes.gold.50000', value: false}));
        lsSet('pw_store_award.rams.gold.5', JSON.stringify({name: 'rams.gold.5', value: false}));
        lsSet('pw_store_award.rams.gold.50', JSON.stringify({name: 'rams.gold.50', value: false}));
        lsSet('pw_store_award.rams.gold.500', JSON.stringify({name: 'rams.gold.500', value: false}));
        lsSet('pw_store_award.rams.gold.5000', JSON.stringify({name: 'rams.gold.5000', value: false}));
        lsSet('pw_store_award.rams.gold.50000', JSON.stringify({name: 'rams.gold.50000', value: false}));
        lsSet('pw_store_award.ewes.20', JSON.stringify({name: 'ewes.20', value: false}));
        lsSet('pw_store_award.ewes.200', JSON.stringify({name: 'ewes.200', value: false}));
        lsSet('pw_store_award.ewes.2000', JSON.stringify({name: 'ewes.2000', value: false}));
        lsSet('pw_store_award.ewes.20000', JSON.stringify({name: 'ewes.20000', value: false}));
        lsSet('pw_store_award.ewes.200000', JSON.stringify({name: 'ewes.200000', value: false}));
        lsSet('pw_store_award.rams.10', JSON.stringify({name: 'rams.10', value: false}));
        lsSet('pw_store_award.rams.100', JSON.stringify({name: 'rams.100', value: false}));
        lsSet('pw_store_award.rams.1000', JSON.stringify({name: 'rams.1000', value: false}));
        lsSet('pw_store_award.rams.10000', JSON.stringify({name: 'rams.10000', value: false}));
        lsSet('pw_store_award.rams.100000', JSON.stringify({name: 'rams.100000', value: false}));
    };

    /*
     * check localStorage against our schema. abort if they don't match.
     */
    this.verifySchema = function _a_verifySchema() {
        var version, stores, upgrader;

        version = parseInt(lsGet('pw_version'), 10);
        if (! version) { // if no value for version, we are initializing brand-new.
            version = c.SCHEMA.version;
            lsSet('pw_version', version);
            lsSet('pw_stores', JSON.stringify(c.SCHEMA.stores));
        }

        try {
            stores = JSON.parse(lsGet('pw_stores'));
        } catch (e) {
            console.log('** JSON load error for: ' + lsGet('pw_stores'));
        }

        if (version !== c.SCHEMA.version) {
            while (version !== c.SCHEMA.version) {
                upgrader = this['upgrade_' + version + '_to_' + (version + 1)];
                upgrader.call(this);
                version = parseInt(lsGet('pw_version'), 10);
            }
        }

        assert(version === c.SCHEMA.version, 'schema version mismatch AFTER upgrading !!!');
        assert(JSON.stringify(stores[this.name]) ===
               JSON.stringify(c.SCHEMA.stores[this.name]),
               'schema table "' + this.name + '" is not identical. ' +
               JSON.stringify(stores[this.name]) + ' !== ' +
               JSON.stringify(c.SCHEMA.stores[this.name])
               );
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
        persist = persist === undefined ? this.persist : persist;
        var other = new this.constructor({persist: persist});
        other.add(this.toArray());
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
