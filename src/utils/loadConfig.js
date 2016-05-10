var fs = require('fs'),
    sysPath = require('path'),
    JSON5 = require('json5');

module.exports = function(cwd, callback) {
    var confPath = sysPath.join(cwd, 'qdoc.config'),
        confJSPath = sysPath.join(cwd, 'qdocfile.js'),
        conf;
    if (fs.existsSync(confPath)) {
        try {
            conf = JSON5.parse(fs.readFileSync(confPath, 'utf-8'));
        } catch (e) {}
        callback(conf);
    } else if (fs.existsSync(confJSPath)) {
        var qdocfile = require(confJSPath);
        if (typeof qdocfile == 'function') {
            if (qdocfile.length == 1) {
                qdocfile(callback);
            } else {
                callback(qdocfile());
            }
        } else {
            callback(qdocfile);
        }
    } else {
        callback(conf);
    }
};
