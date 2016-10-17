(function() {
    var QApp = window.QApp;

    @import "https://raw.githubusercontent.com/YMFE/yGesture/master/yGesture.js"

    function ctrlFn(open) {
        yGesture[open ? 'disable' : 'enable']();
    }

    QApp.on('running', ctrlFn);

    QApp.gesture = yGesture;

    QApp.gesture.disableTransferCtrl = function() {
        QApp.off('running', ctrlFn);
    };

})();
