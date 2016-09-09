define('fetchNode', function () {

    function resolveNode(deferred) {
        deferred.resolve();
    }

    return function (view) {
        var options = view.options;

        return new Deferred().startWith(function (that) {
            if (options.html || _isFunction(options.fetch)) {
                if (options.html) {
                    resolveNode(that);
                } else if (options.fetch.length) { // function(resolve) {}
                    options.fetch.call(view, function (node) {
                        options.html = node || '';
                        resolveNode(that);
                    });
                } else {
                    options.html = options.fetch.call(view) || '';
                    resolveNode(that);
                }
            } else {
                options.html = '';
                resolveNode(that);
            }
        });
    };
});
