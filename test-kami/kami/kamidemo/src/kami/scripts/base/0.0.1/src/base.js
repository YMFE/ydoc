

;(function () {
    'use strict';

    var Kami = require('../../../class/0.0.1/index.js');
    var Event = require('./event.js');
    
    var Attribute = require('./attribute.js');
    
    var Base = Kami.create({
        Mixins: [Event, Attribute],

        initialize: function (config) {
            /**
             * nothing to do now
             */
            
            this.initAttrs(config);
        },
        
        destroy: function () {
            this.off();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            this.destroy = function () {};
            this.isDestroy = true;
        }

    });
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Base;
    }
    
}());


