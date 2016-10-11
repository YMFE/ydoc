let extend = require('../util/extend');

module.exports = extend(
    {},
    require('./webview'),
    require('./navigation')
);
