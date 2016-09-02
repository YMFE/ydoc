define('taskQ', function () {

    var messageCenter = _createEventManager(),
        curTasks = NULL,
        timeout = 500;

    function createQueue(tasks) {
        QApp.trigger('running', TRUE);
        _queue(tasks, [], TRUE).done(function() {
            curTasks.forEach(function(task) {
                if (task && _isFunction(task.destroy)) {
                    task.destroy();
                }
            });
            curTasks = NULL;
            QApp.trigger('running', FALSE);
        }).progress(function() {
            messageCenter.trigger('ev');
        });
    }

    var taskQueue = {
        push: function(defer) {
            if (curTasks) {
                curTasks.push(defer);
            } else {
                curTasks = [defer];
                createQueue(curTasks);
            }
        },
        pushTask: function(task) {
            taskQueue.push(new Deferred().startWith(function(that) {
                try {
                    task(that);
                } catch(e) {}
                _delay(function() {
                    if (that && _isFunction(that.resolve)) {
                        that.resolve();
                    }
                }, timeout);
            }));
        },
        addListener: function(fn) {
            messageCenter.on('ev', fn);
        }
    };

    return taskQueue;
});