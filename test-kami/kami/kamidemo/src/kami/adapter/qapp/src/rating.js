require('./base.js');

var QApp = window.QApp,
    Rating = QApp.Kami.Rating = require('../../../scripts/rating/index.js');


var DEFAULT_OPT = {

};
QApp.addWidget('rating', function (element, opt, view) {
   
    var rating = new Rating(QApp.util.extend(
        {
            container: element
        }, 
        opt,
        {
            onchangevalue: function (value, preValue) {
                
                if (view[opt.onchangevalue]) {
                    view[opt.onchangevalue].apply(this, arguments);
                }
            }
        }
    ));

    rating.render();

    if (view) {
        view.on('destroy', function () {
            if (rating) {
                rating.destroy();
                rating = null;
            }
        });
    }

    return rating;
});

module.exports = {
    setOption: function (opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
