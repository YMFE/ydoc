var gulp = require('../gulp.js');

require('../res/kami/gulpfile.js');

exports.usage = "Kami项目文档构建命令";

exports.set_options = function(optimist) {
    return optimist;
};

exports.run = function(options) {
	gulp(['default']);
}