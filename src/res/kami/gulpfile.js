/**
 * Created by eva on 15/10/8.
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();

var path = require('path');
var fs = require('fs');
var http = require('http');

var packdoc = require('./lib/packJs.js');
var pkg = require('./config.js');
var artTemplate = require('./lib/artTemplate.js');
var packMd = require('./lib/packMd.js')
var browserSync = require('browser-sync');

var reload = browserSync.reload;
var stream = browserSync.stream;
var through = require('through-gulp')

var OUTPUTPATH = pkg.outputpath ||  './docsite';
var JSSOURCE = pkg.JsSource;
var TEMPLATEDIRPATH = pkg.templatedirepath || path.join(__dirname, 'template/**/*');
var TEMPLATHTML = pkg.templatepath || path.join(__dirname, 'template/__template.html');
var MARKDOWN = pkg.markdowndir || path.join(__dirname, '/document/**/*.markdown');


gulp.task('clean', function(){
    return gulp.src(path.join(OUTPUTPATH,'*'), {read:false}).pipe($.clean());
});


gulp.task('store',['clean'],function(){
    //[todo]支持数组传入
    return  gulp.src([TEMPLATEDIRPATH, '!'+TEMPLATEDIRPATH.replace('**/*','')+path.basename(TEMPLATHTML)])
                .pipe(gulp.dest(OUTPUTPATH));
});

gulp.task('packJs',['store'], function(){
    //[todo]多个JS配置
    return gulp.src(JSSOURCE)
        .pipe(addbasepath())
        .pipe($.concat('widget.js'))
        .pipe(packdoc())
        .pipe($.dest(path.join(OUTPUTPATH,'tmp'), {ext:'.json'}))
        .pipe(gulp.dest('./'))
});

gulp.task('packMd',['store'], function(){
    return gulp.src(MARKDOWN)
        .pipe($.markdown())
        .pipe(packMd())
        .pipe($.dest(path.join(OUTPUTPATH,'tmp'), {ext:'.json'}))
        .pipe(gulp.dest('./'));

})

gulp.task('compile', ['packMd','packJs'], function(cb){
    return gulp.src(path.join(OUTPUTPATH, '/tmp/*.json'))
        .pipe(artTemplate(fs.readFileSync(TEMPLATHTML)))
        .pipe($.rename({
            extname:'.html',
            dirname: OUTPUTPATH
        }))
        .pipe(gulp.dest('./'));
});


gulp.task('default',['compile'] ,function(){
    gutil.log(gutil.colors.green('生成目录:'+path.join(process.cwd(),OUTPUTPATH)));
});

gulp.task('reload',['compile'], function(){
    reload();
})

gulp.task('serve',['default'], function(){
    browserSync({
        notify: false,
        port: 9000,
        ui: false,
        server: {
            baseDir: 'docsite',
            index: 'widget.html'
        }
    });
    gulp.watch(JSSOURCE, ['reload']);
    gulp.watch(MARKDOWN, ['reload']);
    gulp.watch(TEMPLATEDIRPATH, ['reload']);
});


function addbasepath (){
    var stream = through(function(file, encode, callback) {
        var pattern = /\@path\s+'?([\w\.\/]*)'?/g;
        var content = file.contents.toString();
        var newContent = content.replace(pattern, function(match, p1){
            if(!path.isAbsolute(p1)){
                var tempath = path.normalize(p1);
                var s = path.resolve(path.dirname(file.path), tempath);
                return '@path '+ s;
            }
        })
        file.contents = new Buffer(newContent);
        this.push(file);
        callback();
    });
    return stream;
}

