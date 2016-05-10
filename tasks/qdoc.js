var colors = require('colors');

var qdoc = require('../src/qdoc.js');
    loadConfig = require('../src/utils/loadConfig.js');

module.exports = function(grunt) {
    grunt.registerMultiTask('qdoc', 'QDoc Builder', function() {
        var cwd = process.cwd(),
            data = this.data || {},
            done = this.async();
        loadConfig(cwd, function(conf) {
            qdoc.build(cwd, conf ? Object.assign(conf, data) : data);
            done();
        });
    });
};
