(function() {
    var _ = QApp.util;

    var DEFAULT_OPT = {
        tag: 'action-type',
        eventType: 'tap'
    };

    QApp.addPlugin('delegated', DEFAULT_OPT, function (view, options, config) {

        view.on('loaded', function () {
            var delegatedEvent = view.delegatedEvent = _.delegatedEvent(view.root, [], options.tag);

            if (view.options.bindActions) {
                _.each(view.options.bindActions, function(key, process) {
                    var ae = key.split(':'),
                        action = ae[0],
                        eventType = ae[1] || options.eventType;

                    if (typeof process === 'string') process = view[process];

                    if (_.isFunction(process)) {
                        delegatedEvent.add(action, eventType, function (e, data) {
                            return process.call(view, e, data);
                        });
                    }
                });
            }

            view.bind = function (action, eventType, process) {
                if (_.isFunction(eventType)) {
                    process = eventType;
                    eventType = options.eventType;
                }
                if (_.isFunction(process)) {
                    delegatedEvent.add(action, eventType, function (e, data) {
                        return process.call(view, e, data);
                    });
                }
            };

            view.fireAction = delegatedEvent.fireAction;

        });

        view.on('destroy', function () {
            if (view.delegatedEvent && _.isFunction(view.delegatedEvent.destroy)) {
                view.delegatedEvent.destroy();
            }
            view.delegatedEvent = null;
            view.bind = null;
        });

    });
})();
