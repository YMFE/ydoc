let extend = require('../util/extend');

module.exports = extend(
    {},
    require('./base'),
    require('./login'),
    require('./share'),
    require('./device'),
    require('./scan'),
    require('./image'),
    require('./log'),
    require('./webview'),
    require('./navigation'),
    require('./window'),
    require('./scheme')
);
