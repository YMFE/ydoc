(function() {

    var _ = QApp.util;

    QApp.addPlugin('static', function(view, opt, config) {
        view.on('rendered', function() {
            if (view.root) {
                _.css(view.root, {
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                });
            }
        });
    });
})();
