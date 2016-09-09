var URL_REG = /(\w+):\/\/\/?([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(\?[^#]*)?(#.*)?/i,
    URL_MAP = ['url', 'protocol', 'hostname', 'port', 'path', 'name', 'query', 'hash'];

function _parseURL(str, decode) {
    var scope = _associate(URL_REG.exec(str) || [], URL_MAP);

    scope.query = scope.query ? _queryToJson(scope.query.substring(1), decode) : {};

    scope.hash = scope.hash ? _queryToJson(scope.hash.substring(1), decode) : {};

    scope.getQuery = function(key) {
        return scope.query[key];
    };

    scope.getHash = function(key) {
        return scope.hash[key];
    };

    scope.setQuery = function(key, value) {
        if (value === UNDEFINED) {
            scope.query[key] = NULL;
        } else {
            scope.query[key] = value;
        }
        return scope;
    };

    scope.setHash = function(key, value) {
        if (value === UNDEFINED) {
            scope.hash[key] = NULL;
        } else {
            scope.hash[key] = value;
        }
        return scope;
    };

    scope.toUrl = function(encode) {
        var url = scope.protocol + '://',
            query = _jsonToQuery(scope.query, encode),
            hash = _jsonToQuery(scope.hash, encode);
        if (scope.protocol && scope.protocol.toLowerCase() === 'file') {
            url += '/';
        }
        return url +
            scope.hostname +
            (scope.port || '') +
            scope.path +
            (scope.name || '') +
            (query ? '?' + query : '') +
            (hash ? '#' + hash : '');
    };

    return scope;
}

/// Loader
var LOADER_OPT = {
    charset: 'UTF-8',
    timeout: 30 * 1000,
    onComplete: NULL,
    onTimeout: NULL,
    onFail: NULL
};

var headEL = doc.getElementsByTagName('head')[0];

function bindEvent(el, deferred, timeout) {
    var requestTimeout;

    headEL.insertBefore(el, headEL.firstChild);

    if (timeout) {
        requestTimeout = _delay(function() {
            el.onload = NULL;
            _removeNode(el);
            deferred.reject({type : 'Timeout'});
        }, timeout);
    }

    el.onload = function() {
        if (requestTimeout) {
            clearTimeout(requestTimeout);
        }
        el.onload = NULL;
        el.onerror = NULL;
        deferred.resolve();
    };

    el.onerror = function() {
        if (requestTimeout) {
            clearTimeout(requestTimeout);
        }
        _removeNode(el);
        el.onload = NULL;
        el.onerror = NULL;
        deferred.reject({type : 'Error'});
    };
}

var Manager = {
    script : function(url, options) {
        var deferred = new Deferred(),
            charset = options.charset,
            timeout = options.timeout,
            el = doc.createElement('script');
        el.type = 'text/javascript';
        el.charset = charset;
        return deferred.startWith(function() {
            deferred.notify('element', el);
            bindEvent(el, deferred, timeout);
            el.src = url;
        });
    },
    style : function(url, options) {
        var deferred = new Deferred(),
            charset = options.charset,
            timeout = options.timeout,
            el = doc.createElement('link');
        el.type = 'text/css';
        el.charset = charset;
        el.rel = 'stylesheet';
        return deferred.startWith(function() {
            bindEvent(el, deferred, timeout);
            el.href = url;
        });
    },
    image : function(url, options) {
        var deferred = new Deferred(),
            img = new Image(),
            timeout = options.timeout,
            timer = NULL;
        img.onload = function() {
            img.onload = NULL;
            img.onerror = NULL;
            if (timer) {
                clearTimeout(timer);
            }
            deferred.resolve(img);
        };
        img.onerror = function() {
            img.onload = NULL;
            img.onerror = NULL;
            if (timer) {
                clearTimeout(timer);
            }
            deferred.reject({type : 'Error'});
        };
        if (timeout) {
            timer = _delay(function() {
                img.onload = NULL;
                img.onerror = NULL;
                if (timer) {
                    clearTimeout(timer);
                }
                deferred.reject({type : 'Timeout'});
            }, timeout);
        }
        return deferred.startWith(function() {
            img.src = url;
        });
    }
};

function _loader(type, url, options) {
    var opt = _extend({}, LOADER_OPT, options),
        deferred = Manager[type] && Manager[type](url, opt);

    if (deferred && (opt.onComplete || opt.onFail || opt.onTimeout)) {
        deferred.then(opt.onComplete, function(reason) {
            if (reason.type === 'Timeout' && _isFunction(opt.onTimeout)) {
                opt.onTimeout(reason);
            }
            if (reason.type === 'Error' && _isFunction(opt.onFail)) {
                opt.onFail(reason);
            }
        });
    }

    return deferred;
}