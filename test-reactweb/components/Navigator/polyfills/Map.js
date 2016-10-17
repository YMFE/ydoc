

var numberIsNaN = function (value) {
    return value !== value;
};

function isEqual(a, b) {
    if (a === 0 && b === 0) {
        return 1 / a === 1 / b;
    } else if (a === b) {
        return true;
    } else if (numberIsNaN(a) && numberIsNaN(b)) {
        return true;
    }
    return false;
}

function createMap() {
    var keys = [],
            values = [];

    return {
        get: function (key) {
            return getValue(key, keys, values);
        },
        set: function (key, value) {
            var index = getIndex(key, keys);

            if (index !== -1) {
                values[index] = value;
            } else {
                index = keys.length;
                keys[index] = key;
                values[index] = value;
            }
        },
        has: function (key) {
            return getIndex(key, keys) !== -1;
        },
        remove: function (key) {
            var index = getIndex(key, keys);

            if (index !== -1) {
                keys.splice(index, 1);
                values.splice(index, 1);
                return true;
            } else {
                return false;
            }
        },
        keys: function () {
            return keys.slice();
        },
        values: function () {
            return values.slice();
        },
        key: function (index) {
            return keys[index];
        },
        value: function (index) {
            return getValue(keys[index], keys, values);
        },
        size: function () {
            return keys.length;
        },
        clear: function () {
            keys.length = 0;
            values.length = 0;
        }
    };
}

function getValue(key, keys, values) {
    var index = getIndex(key, keys);

    if (index !== -1) {
        return values[index];
    } else {
        return undefined;
    }
}

function getIndex(key, keys) {
    var i = keys.length;

    while (i--) {
        if (isEqual(key, keys[i])) {
            return i;
        }
    }

    return -1;
}

//==========

var NativeMap = typeof(Map) !== "undefined" ? Map : null,
    MapPolyfill, forEach, createCallback, MapPolyfillPrototype;


if (/\[native code\]/.test(NativeMap)) {
    MapPolyfill = NativeMap;
    MapPolyfillPrototype = MapPolyfill.prototype;

    MapPolyfillPrototype.count = function() {
        return this.size;
    };
} else {
    MapPolyfill = function Map() {
        this.__map = createMap();
    };
    MapPolyfillPrototype = MapPolyfill.prototype;
    MapPolyfillPrototype.constructor = MapPolyfill;

    MapPolyfillPrototype.get = function(key) {
        return this.__map.get(key);
    };

    MapPolyfillPrototype.set = function(key, value) {
        this.__map.set(key, value);
    };

    MapPolyfillPrototype.has = function(key) {
        return this.__map.has(key);
    };

    MapPolyfillPrototype["delete"] = function(key) {
        return this.__map.remove(key);
    };

    MapPolyfillPrototype.clear = function() {
        this.__map.clear();
    };

    MapPolyfillPrototype.count = function() {
        return this.__map.size();
    };

    if (Object.defineProperty) {
        Object.defineProperty(MapPolyfillPrototype, "size", {
            get: MapPolyfillPrototype.count
        });
    }

    MapPolyfillPrototype.length = 0;

    MapPolyfillPrototype.forEach = function(fn, thisArg) {
        return forEach(
            this,
            this.__map,
            thisArg != null ? createCallback(fn, thisArg) : fn
        );
    };

    forEach = function forEach(obj, map, fn) {
        var i = -1,
            il = map.count() - 1;

        while (i++ < il) {
            if (fn(map.value(i), map.key(i), obj) === false) {
                return false;
            }
        }

        return obj;
    };

    createCallback = function createCallback(fn, thisArg) {
        return function callback(value, key, obj) {
            fn.call(thisArg, value, key, obj);
        };
    };
}

MapPolyfillPrototype.remove = MapPolyfillPrototype["delete"];
MapPolyfillPrototype.__KeyedCollection__ = true;
MapPolyfillPrototype.__Collection__ = true;


module.exports = MapPolyfill;