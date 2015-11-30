var gulp = require('../gulp.js');

require('../res/kami/gulpfile.js');

module.exports = {
    usage: 'Kami 文档构建命令',
    options: {},
    process: function(options){
        gulp(['default']);
    }
};