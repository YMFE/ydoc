var gulp = require('gulp');
var gutil = require('gulp-util');
var glob = require("glob");
var utils = require('../../utils.js');
var builder = require('./builder.js');


gulp.task('default',function(){
    glob('lib/core/variables.scss',function(err,files){
        if(err){
            gutil.error(err);
            return;
        }
        if(files.length === 0){
             gutil.log(gutil.colors.red('在 lib/core 目录下未找到 variables.scss 文件,请确认是在 Yo 目录下操作.'));
            return;
        }
        var fileContent = utils.file.read(files[0]),
            match = fileContent.match(/version:\s*"(\d+\.\d+\.\d+)"/);

        gutil.log(gutil.colors.green('Yo: ' + (match ? match[1] : '未知')));

        builder.getDoc();
    });
});
