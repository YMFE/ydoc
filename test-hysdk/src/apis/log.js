const isString = (string) => Object.prototype.toString.call(string) === "[object String]";
module.exports = {
    log: {
        hy: {
            key: 'debug.log',
            optHandle: function (msg) {
                if( isString(msg) ){
                    var param = {
                        message: msg
                    }
                    return param;
                }
                return msg;
            }
        }
    },
    uelog: {
        hy: {
            key: 'hy.uelog'
        }
    },
    abTest: {
        hy: {
            //TODO 验证是否是abTest.getCase
            key: 'abTest'
        }
    }
};
