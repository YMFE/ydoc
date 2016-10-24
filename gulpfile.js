var gulp = require('gulp'),
concat = require('gulp-concat'),
minifyCss = require('gulp-minify-css'),
uglify = require('gulp-uglify');

gulp.task('concat', function() {

    // 将所有css文件连接为一个文件并压缩，存到public/css
    gulp.src(['template/css/app.css','template/css/highlight.min.css'])
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('template/source'));

    gulp.src(['template/css/shCoreDefault.css','template/css/app.css'])
            .pipe(concat('code.css'))
            .pipe(minifyCss())
            .pipe(gulp.dest('template/source'));

    // 将所有js文件连接为一个文件并压缩，存到public/js
    gulp.src(['template/js/jquery.min.js','template/js/bootstrap.min.js','template/js/docs.min.js','template/js/highlight.min.js','template/js/app.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('template/source'));

    gulp.src(['template/js/shCore.js','template/js/shBrush-*.js'])
        .pipe(concat('code.js'))
        .pipe(uglify())
        .pipe(gulp.dest('template/source'));
});
