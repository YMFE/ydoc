module.exports = function(grunt) {
    var version = grunt.file.readJSON('package.json').version,
        execSync = require('child_process').execSync;

    grunt.registerMultiTask('tag', 'Tag For Git', function() {
        grunt.log.writeln('>> 创建 Tag v' + version);
        execSync('git tag -a v' + version + ' -m "add v' + version + '"');
    });
};
