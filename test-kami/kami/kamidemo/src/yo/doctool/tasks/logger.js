module.exports = function(grunt) {

    grunt.registerMultiTask('logger', 'Comment To Logger', function() {
        this.files.forEach(function(file) {
            var content = grunt.file.read(file.src[0]);

            content = content.replace(/\/\/(INFO|DEBUG|WARN|ERROR)(.+)\n/g, function(a, b, c) {
                return '_logger.' + b.toLowerCase() + '(' + c + ');\n';
            });

            grunt.file.write(file.dest, content);
            grunt.log.writeln('File "' + file.dest + '" created.');
        });
    });
};
