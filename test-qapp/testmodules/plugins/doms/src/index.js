(function() {
    var _ = QApp.util;

    var DEFAULT_OPT = {
        tag: 'node-type'
    };

    QApp.addPlugin('doms', DEFAULT_OPT, function (view, options, config) {

        view.doms = {};

        view.find = function(type) {
            return view.root ? _.makeArray(view.root.querySelectorAll('[' + options.tag + '="' + type + '"]')) : [];
        };

        view.on('rendered', function () {
            _.makeArray(view.root.querySelectorAll('[' + options.tag + ']')).forEach(function (item) {
                var name = _.attr(item, options.tag) || 'node';
                if (!view.doms[name]) {
                    view.doms[name] = item;
                } else {
                    if (_.isArray(view.doms[name])) {
                        view.doms[name].push(item);
                    } else {
                        view.doms[name] = [view.doms[name], item];
                    }
                }
            });
        });

        view.on('destroy', function () {
            _.empty(view.doms);
            view.doms = null;
        });

    });
})();
