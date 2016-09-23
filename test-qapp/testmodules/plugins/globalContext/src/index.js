(function() {
    @import "https://raw.githubusercontent.com/YMFE/yStorage/master/yStorage.js"

    QApp.util.storage = yStorage;

    // ======== dataSource ========

    var _ = QApp.util,
        dataSource = {};

    function Data() {
        this._source = {};
    }

    _.extend(Data.prototype, {
        get: function(key) {
            var value = this._source[key];
            if (_.isArray(value)) {
                return value.slice(0);
            } else if (_.isObject(value)) {
                return _.extend(true, {}, value);
            }
            return value;
        },
        set: function(key, value) {
            if (_.isArray(value)) {
                this._source[key] = value.slice(0);
            } else if (_.isObject(value)) {
                this._source[key] = _.extend(true, {}, value);
            } else {
                this._source[key] = value;
            }
            this.trigger('change', key, value);
        },
        merge: function(key, value) {
            if (this._source[key] !== void 0) {
                value = _.extend(true, this._source[key], value);
            }
            this.set(key, value);
        },
        remove: function(key) {
            this._source[key] = void 0;
            this.trigger('change', key);
        },
        clear: function() {
            for (var key in this._source) {
                this.remove(key);
            }
        },
        onChange: function(fn) {
            this.on('change', fn);
        },
        destroy: function() {
            this.off();
            this._source = null;
        }
    }, _.CustEvent);

    function init(space) {
        if (!dataSource[space]) {
            dataSource[space] = new Data();
        }
        return dataSource[space];
    }

    var globalSource = QApp.dataSource = {
        init: function(space) {
            return init(space);
        },
        get: function(space, key) {
            if (dataSource[space]) {
                return dataSource[space].get(key);
            }
        },
        set: function(space, key, value) {
            init(space).set(key, value);
        },
        merge: function(space, key, value) {
            init(space).merge(key, value);
        },
        remove: function(space, key) {
            init(space).remove(key);
        },
        clear: function(space) {
            if (dataSource[space]) {
                dataSource[space].clear();
            }
        },
        onChange: function(space, fn) {
            init(space).onChange(fn);
        }
    };

    // ======== globalContext ========

    var localKeys = [],
        space = QApp.hy ? QApp.hy.config().hybridId : 'global';

    var globalContext = QApp.dataSource.init(space),
        storage = QApp.util.storage;

    globalContext.on('change', function(key, value) {
        if (localKeys.indexOf(key) > -1) {
            storage(key, value);
        }
    });

    globalContext.addLocalKeys = function(keys) {
        localKeys = localKeys.concat(keys);
        localKeys.forEach(function(key) {
            globalContext.set(key, storage(key));
        });
    };

    globalContext.refresh = function() {
        localKeys.forEach(function(key) {
            globalContext.set(key, storage(key));
        })
    };

    if (QApp.hy) {
        QApp.hy.on('actived', function() {
            globalContext.refresh();
        });
    }

    QApp.util.globalContext = globalContext;

})();
