require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    KamiAlert = QApp.Kami.alert = require('../../../scripts/alert/index.js'),
    KamiConfirm = QApp.Kami.confirm = require('../../../scripts/confirm/index.js');
// debugger
var list = [];

function addId(id) {
    list.push(id);
}

function removeId(id) {
    list.splice(list.indexOf(id), 1);
}

QApp.Kami = QApp.Kami || {};

QApp.Kami.hasDialog = function() {
    return !!list.length;
};

QApp.addWidget('alert', function (element, opt) {

    var id = setTimeout('1');

    addId(id);

    KamiAlert.show(_.extend({}, {
        onok: function () {
            if (_.isFunction(opt.onComplete)) {
                opt.onComplete();
                this.hide();
            }
            else {
                this.hide();
            }
            
            removeId(id);
        }
    }, 
    opt));

}, 'tap');

QApp.addWidget('confirm', function  (element, opt) {

    var id = setTimeout('1');

    addId(id);

    KamiConfirm.show(_.extend({}, {
        onok: function () {
            
            if (_.isFunction(opt.onComplete)) {
                opt.onComplete(true);
                this.hide();
            }
            else {
                this.hide();
            }
            // this.hide();
            removeId(id);
        },
        oncancel: function () {
            if (_.isFunction(opt.onComplete)) {
                opt.onComplete(false);
                this.hide();
            }
            else {
                this.hide();
            }
            // this.hide();
            removeId(id);
        }
    }, opt));

}, 'tap');
