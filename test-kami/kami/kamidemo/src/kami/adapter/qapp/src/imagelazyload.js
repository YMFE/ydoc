require('./base.js');

var QApp = window.QApp,
    Imagelazyload = QApp.Kami.Imagelazyload = require('../../../scripts/imagelazyload/index.js');


var DEFAULT_OPT = {

};
QApp.addWidget('imagelazyload', function (element, opt, view) {
   
    var imagelazyload = new Imagelazyload(QApp.util.extend(
        {
            container: element
        }, 
        opt
    ));

    if (view) {
        view.on('destroy', function () {
            if (imagelazyload) {
                imagelazyload.destroy();
                imagelazyload = null;
            }
        });
    }

    return imagelazyload;
});

module.exports = {
    setOption: function (opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
