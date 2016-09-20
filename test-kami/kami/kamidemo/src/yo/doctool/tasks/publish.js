module.exports = function(grunt) {
    var execSync = require('child_process').execSync;

    grunt.registerMultiTask('publish', 'Publish To Fekit', function() {
        grunt.log.writeln('>> 发布 QApp-dev');
        grunt.file.write('fekit.config', grunt.file.read('fekit_dev.config'));
        grunt.log.writeln(execSync('fekit publish'));
        grunt.log.writeln('>> 发布 QApp');
        grunt.file.write('fekit.config', grunt.file.read('fekit_ori.config'));
        grunt.log.writeln(execSync('fekit publish'));
    });
};
