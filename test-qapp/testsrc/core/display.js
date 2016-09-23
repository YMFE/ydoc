define('display', function() {
    return {
        show: function (container, startCss, endCss, duration) {
            var me = this;
            if (me.isShow) {
                _css(me.root, _extend({
                    width: '100%',
                    height: '100%',
                    zIndex: _getZIndex()
                }, endCss || startCss));
                me.trigger('refresh');
            } else {
                me.once('completed', function () {
                    _css(me.root, _extend({
                        width: '100%',
                        height: '100%',
                        zIndex: _getZIndex()
                    }, startCss));
                    me.trigger('beforeShow');
                    if (Config.animate && endCss) {
                        _animate(me.root, endCss, duration).done(function () {
                            me.trigger('show');
                        });
                    } else {
                        _css(me.root, endCss || {});
                        me.trigger('show');
                    }
                });
                me.renderTo(_isElement(container) ? container : Config.appRoot);
            }
            return me;
        },
        hide: function () {
            var me = this;
            if (me.isShow) {
                me.trigger('beforeHide');
                me.trigger('hide');
            }
            return me;
        }
    };
});