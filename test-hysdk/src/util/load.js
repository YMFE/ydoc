const parseURL = require('./parseURL');
const extend = require('./extend');

let jsonpExtraStamp = 0;

let load = module.exports = {
    script: (url, callback) => {
        let head = document.getElementsByTagName('head')[0],
            script = document.createElement('script'),
            remove = () => {
                if (timer) {
                    clearTimeout(timer);
                }
                head.removeChild(script);
            },
            timer = setTimeout(script.onerror = () => {
                remove();
                callback(true);
            }, 30000);
        script.setAttribute('src', url);
        head.appendChild(script);
        script.onload = () => {
            remove();
            callback();
        };

    },
    jsonp: (url, options, listener) => {
        var trans = {},
            isCanceled = false,
            callbackName = '',
            overwritten,
            hasSetCallbackName = false,
            head = document.getElementsByTagName('head')[0],
            scriptElem = document.createElement('script'),
            backingOut = () => {
                if (hasSetCallbackName) {
                    window[callbackName] = overwritten;
                } else {
                    delete window[callbackName];
                }
                head.removeChild(scriptElem);
            },
            timer;

        scriptElem.src = url;

        var URL = parseURL(scriptElem.src);
        URL.query = extend(URL.query, options.data);

        if (options.jsonpCallback) {
            hasSetCallbackName = true;
            overwritten = window[options.jsonpCallback];
        } else {
            options.jsonpCallback = 'HySDK_' + (+new Date()) + (jsonpExtraStamp++);
        }
        callbackName = options.jsonpCallback;
        URL.query[options.jsonp || 'callback'] = callbackName;

        trans.abort = () => {
            isCanceled = true
            listener(null, {
                error: true,
                type: 'Abort'
            });
            backingOut();
        };

        window[callbackName] = (data) => {
            if (timer) {
                clearTimeout(timer);
            }
            if (isCanceled) {
                return
            }
            listener(data);
            backingOut();
        };

        timer = setTimeout(() => {
            listener(null, {
                error: true,
                type: 'Timeout'
            });
            backingOut();
        }, options.timeout || 30000);

        scriptElem.async = true;
        scriptElem.charset = options.charset || 'UTF-8';
        scriptElem.src = URL.toUrl();

        scriptElem.onerror = () => {
            if (timer) {
                clearTimeout(timer);
            }
            listener(null, {
                error: true,
                type: 'Fail'
            });
            backingOut();
        };

        head.appendChild(scriptElem);

        return trans;
    }
};
