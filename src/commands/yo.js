var gulp = require('../gulp.js');

require('../res/yo/gulpfile.js');

exports.usage = "Yo 文档构建命令",
exports.set_options = function(optimist) {
    return optimist;
};

exports.run = function(options) {
	gulp(['default']);
}