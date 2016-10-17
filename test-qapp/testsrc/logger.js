var LOGGER_TYPES = ['info', 'debug', 'warn', 'error'];

function _logger(type, args) {
    console[type].apply(console, ['[' + type.toUpperCase() + ']'].concat(_makeArray(args)));
}

LOGGER_TYPES.forEach(function(type, index) {
   _logger[type] = function() {
       if (index >= Config.logLevel) {
           _logger(type, arguments);
       }
   };
});

// query 配置

var logLevel = _parseURL(location.href).query.logLevel;

if (logLevel) {
    Config.logLevel = parseInt(logLevel);
}
