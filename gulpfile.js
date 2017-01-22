var gulp = require('gulp'),
concat = require('gulp-concat'),
minifyCss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
sass = require('gulp-sass');

gulp.task('sass',function(){
    console.log('sass编译。。。');
    return gulp.src('sass/*.scss').pipe(sass()).pipe(gulp.dest('template/css/'));
});

// 合并css 文件
gulp.task('concatCss', function() {
    console.log('concatcss');
    // 将所有css文件连接为一个文件并压缩，存到public/css
    gulp.src(['template/css/prism.css','template/css/app.css'])
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('template/source'));

    gulp.src(['template/css/shCoreDefault.css','template/css/app.css'])
            .pipe(concat('code.css'))
            .pipe(minifyCss())
            .pipe(gulp.dest('template/source'));
});
// 合并js文件
gulp.task('concatJs', function() {
    // 将所有js文件连接为一个文件并压缩，存到public/js
    gulp.src(['template/js/jquery.min.js','template/js/bootstrap.min.js','template/js/docs.min.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('template/source'));

    // gulp.src(['template/js/shCore.js','template/js/shBrush-*.js'])
    //     .pipe(concat('code.js'))
    //     .pipe(uglify())
    //     .pipe(gulp.dest('template/source'));
});

gulp.task('watch',function(){
    gulp.watch('sass/*.scss',['sass']);
    gulp.watch('template/css/*.css',['concatCss']);
});
