var gulp = require('../gulp.js');

require('../res/yo/gulpfile.js');

module.exports = {
    usage: 'Yo 文档构建命令',
    options: {},
    process: function(options,callback){
        gulp(['default']);
    }
};