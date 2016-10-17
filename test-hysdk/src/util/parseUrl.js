const URL_REG = /(\w+):\/\/\/?([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(\?[^#]*)?(#.*)?/i;
const URL_MAP = ['url', 'protocol', 'hostname', 'port', 'path', 'name', 'query', 'hash'];
const isFunction = (fn) => typeof fn === 'function';
const isNull = (obj) => obj === void 0 || obj === null;
const encodeFormat = (data, isEncode) => {
    data = (data === null ? '' : data).toString().trim();
    return isEncode ? encodeURIComponent(data) : data;
};
const decodeFormat = (data, isDecode) => {
    return isNull(data) ? data : isDecode ? decodeURIComponent(data) : data;
};
const jsonToQuery = (json, isEncode) => {
    let qs = [],
        k, i, len;
    for (k in json) {
        if (isNull(json[k])) {
            qs = qs.concat(k);
        } else if (Array.isArray(json[k])) {
            for (i = 0, len = json[k].length; i < len; i++) {
                if (!isFunction(json[k][i])) {
                    qs.push(k + "=" + encodeFormat(json[k][i], isEncode));
                }
            }
        } else if (!isFunction(json[k]) && !isNull(json[k])) {
            qs.push(k + "=" + encodeFormat(json[k], isEncode));
        }
    }
    return qs.join('&');
};
const queryToJson = (qs, isDecode) => {
    let qList = qs.trim().split("&"),
        json = {},
        i = 0,
        len = qList.length;
    for (; i < len; i++) {
        if (qList[i]) {
            let hash = qList[i].split("="),
                key = hash[0],
                value = hash[1];
            if (!(key in json)) {
                json[key] = decodeFormat(value, isDecode);
            } else {
                json[key] = [].concat(json[key], decodeFormat(value, isDecode));
            }
        }
    }
    return json;
};

module.exports = (str, decode) => {
    var scope = {},
        m = URL_REG.exec(str) || [];
    URL_MAP.forEach((key, index) => scope[key] = m[index]);
    scope.query = scope.query ? queryToJson(scope.query.substring(1), decode) : {};
    scope.hash = scope.hash ? queryToJson(scope.hash.substring(1), decode) : {};

    scope.getQuery = (key) => {
        return scope.query[key];
    };

    scope.getHash = (key) => {
        return scope.hash[key];
    };

    scope.setQuery = (key, value) => {
        if (value === UNDEFINED) {
            scope.query[key] = NULL;
        } else {
            scope.query[key] = value;
        }
        return scope;
    };

    scope.setHash = (key, value) => {
        if (value === UNDEFINED) {
            scope.hash[key] = NULL;
        } else {
            scope.hash[key] = value;
        }
        return scope;
    };

    scope.toUrl = (encode) => {
        let url = scope.protocol + '://',
            query = jsonToQuery(scope.query, encode),
            hash = jsonToQuery(scope.hash, encode);
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
