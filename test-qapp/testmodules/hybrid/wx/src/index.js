(function() {

    var QApp = window.QApp,
        _ = QApp.util,
        Sniff = QApp.sniff;

    var Config = {
        indexView: 'index',
        viewOptions: {},
        transferInApp: true,
        useWechatHeader: true,
        hdHeight: 44
    };

    function setTitle() {
        var view = (QApp.router.getCurInfo() || {}).view.split(':')[0];
        if (view && Config.viewOptions[view]) {
            var nav = Config.viewOptions[view].nav;
            if (nav && nav.title) {
                document.title = nav.title.text;
            }
        }
    }

    if (!Sniff.pc && !Sniff.webApp) {
        var bindShow = false;

        if (Sniff.browsers.wechat) {
            QApp.config({
                type: 'mobile',
                root: {
                    top: Config.useWechatHeader ? (function() {
                        if (_.isNumber(Config.hdHeight)) {
                            var dpr = parseInt(window.dpr) || 1;
                            return -dpr * Config.hdHeight;
                        } else if (_.isFunction(Config.hdHeight)) {
                            return -Config.hdHeight();
                        } else {
                            return 0;
                        }
                    })() : 0
                }
            });
        }

        if (Config.transferInApp) {
            QApp.router.on('willForward', function(data) {
                QApp.router.transfer(data.view, data.query);
                if (!bindShow) {
                    window.addEventListener('pageshow', function() {
                        QApp.router.resetHistory();
                    }, true);
                    bindShow = true;
                }
                return false;
            });
        }
    } else if (Sniff.webApp) {
        QApp.config({
            type: 'app'
        });
    }

    QApp.wx = {
        config: function(options) {
            if (options) {
                options.indexView = options.indexView || QApp.config().indexView;
                _.extend(true, Config, options);
                QApp.config({
                    indexView: Config.indexView
                });
            }
            if (Sniff.browsers.wechat) {
                setTitle();
            }
            return Config;
        }
    };

})();
