var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();

var path = require('path');
var fs = require('fs');
var http = require('http');

var packdoc = require('./lib/packJs.js');

var artTemplate = require('./lib/artTemplate.js');
var packMd = require('./lib/packMd.js')
var browserSync = require('browser-sync');
var utils = require('../../utils.js');

var reload = browserSync.reload;
var stream = browserSync.stream;
var through = require('through-gulp');

var BASEPATH = process.cwd();
var pkg = utils.file.readJson(utils.path.join(BASEPATH, 'docfile.config'));

var OUTPUTPATH = pkg.destDir ||  './docsite';
var JSSOURCE = [];
var MARKDOWN = [];
var TEMPLATEDIRPATH = pkg.templatedirepath || path.join(__dirname, 'template/**/*');
var TEMPLATHTML = pkg.template_js || path.join(__dirname, 'template/__template.html');
var pages = pkg.project.pages;

pages.forEach(function(page){
    if(page.type == "js"){
        JSSOURCE.push(page.content);
    }else if(page.type == "markdown"){
        if(utils.file.exists(page.content)){
            MARKDOWN.push(page.content);
        };
    }
});

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
        .pipe($.concat('tem.js'))
        .pipe($.rename(function(path){
            var getNewName = function(oldName){
                var newName;
                pages.forEach(function(page){                    
                    if(page.type == "js"){
                        newName = page.name;
                    }
                });
                return newName
            }
            path.basename = getNewName(path.basename);
        }))
        .pipe(packdoc())
        .pipe($.dest(path.join(OUTPUTPATH,'tmp'), {ext:'.json'}))
        .pipe(gulp.dest('./'));
});

gulp.task('packMd',['store'], function(){
    return gulp.src(MARKDOWN)
        .pipe($.markdown())
        .pipe(packMd())
        .pipe($.rename(function(path){
            var getNewName = function(oldName){
                var newName;
                pages.forEach(function(page){                    
                    if(page.content.indexOf(oldName) >= 0){
                        newName = page.name;
                    }
                });
                return newName
            }
            path.basename = getNewName(path.basename);
        }))
        .pipe($.dest(path.join(OUTPUTPATH,'tmp'), {ext:'.json'}))
        .pipe(gulp.dest('./'));

})

gulp.task('compile', ['packJs'], function(cb){
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

