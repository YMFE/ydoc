var gulp = require('gulp');
var gutil = require('gulp-util');
var glob = require("glob");
var utils = require('./utils.js');
var builder = require('./builder.js');


gulp.task('default',function(){
    builder.getDoc();
});