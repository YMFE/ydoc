module.exports = function(tag) {
    var minVersion = '',
        maxVersion = '';

    var ret = {
        name: tag.name,
        type: tag.type,
        optional: tag.optional,
        description: (tag.description || '').replace(/\{add\:\s*(\d+\.\d+\.\d+)\s*\}/g, function(a, b) {
            minVersion = b;
            return '';
        }).replace(/\{del\:\s*(\d+\.\d+\.\d+)\s*\}/g, function(a, b) {
            maxVersion = b;
            return '';
        }).replace(/\<\s*(\d+\.\d+\.\d+)\s*\,\s*(\d+\.\d+\.\d+)\s*\>/g, function(a, b, c) {
            minVersion = b;
            maxVersion = c;
            return '';
        }),
        version: minVersion + (maxVersion && (' <del>' + maxVersion + '</del>'))
    };

    if (maxVersion) {
        ret.name = '<del>' + ret.name + '</del>';
        ret.type = '<del>' + ret.type + '</del>';
        ret.description = '<del>' + ret.description + '</del>';
    }

    return ret;
};
