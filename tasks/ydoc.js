var colors = require('colors');

var ydoc = require('../src/ydoc.js');
    loadConfig = require('../src/utils/loadConfig.js');

module.exports = function(grunt) {
    grunt.registerMultiTask('ydoc', 'YDoc Builder', function() {
        var cwd = process.cwd(),
            data = this.data || {},
            done = this.async();
        loadConfig(cwd, function(conf) {
            ydoc.build(cwd, conf ? Object.assign(conf, data) : data);
            done();
        });
    });
};
