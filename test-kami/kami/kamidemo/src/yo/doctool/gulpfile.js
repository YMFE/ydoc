// 引入 gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');

// 引入组件
var compass = require('gulp-compass');
var sass = require('gulp-ruby-sass');
var nodeSass = require('gulp-sass-china');
var stripCssComments = require('gulp-strip-css-comments');
var through = require('through2');

// 引入其他
var path = require('path');
var fs = require('fs');
var optimist = require('optimist');
var notifier = require('node-notifier');
var child_process = require('child_process');
var execSync = child_process.execSync;
var css = require('css');
var cssIsolate = require('css-isolate');

// style path，由业务自己配置

var scssPath = './src/yo/usage/page';
var cssPath = './tasks/source'
//var cssPath = './usage/export';
//var scssBuildPath = './usage/build';
//var diffBuildPath = './diff';

// 默认编译器
var defaultCompiler = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'))).compiler;


// 扩展名
var extNames = ['.sass', '.scss'];
// 行号显示位数
var digits = 6;

//引入js
var yodoc = require('./tasks/yodoc.js');


// fix 文件路径
function fixFilePath(filePath) {

    var extName = path.extname(filePath),
        baseName = path.basename(filePath),
        dirName = path.dirname(filePath),
        privatePath;

    if (extName && fs.existsSync(filePath)) {
        return filePath;
    }
    if (!extName) {
        for (var i = 0, len = extNames.length; i < len; i++) {
            var eName = extNames[i];
            if (fs.existsSync(filePath + eName)) {
                return filePath + eName;
            }
            privatePath = path.join(dirName, '_' + baseName + eName);
            if (fs.existsSync(privatePath)) {
                return privatePath;
            }
        }
    } else {
        privatePath = path.join(dirName, '_' + baseName);
        if (fs.existsSync(privatePath)) {
            return privatePath;
        }
    }
    throw new Error('找不到import文件: ' + filePath);
}

// 修正行号
function fixLineNum(lineNum) {
    var blankNum, i, ref;
    blankNum = digits - (lineNum + '').length;
    for (i = 1, ref = blankNum; 1 <= ref ; ++i) {
        lineNum = ' ' + lineNum;
    }
    return lineNum;
}

// 显示错误上下问
function displayErrorContext(txt, lineNum) {
    var lines, start;
    start = lineNum - 5;
    lines = txt.split('\n').splice(start, 10);
    lines = lines.map(function(line, index) {
        var content, ln;
        ln = start + index + 1;
        content = (fixLineNum(ln)) + ":" + (ln === lineNum ? '->' : '  ') + " " + line;
        return content;
    });

    return lines.join('\n');
};

// 修复 window 上 path 的 seq
function fixPathSeq(path) {
    if(process.platform === "win32"){
        return path.replace(/\\/g, '/');
    }else {
        return path
    }
}

function getWholeScssFile(filePath, dir, imports) {
    var data;
    imports = imports || {};

    if(!imports[filePath]) {
        imports[filePath] = true;
        data = '\n' + fs.readFileSync(filePath);

        // 删除注释
        data = data.replace(/\/\*(.|\s)*?\*\//gm, '').replace(/\n\s*\/\/.*(?=[\n\r])/g, '');
        // 删除多余空行
        data = data.replace(/\n+/g, '\n');
        // 分析 import
        data = data.replace(/@import(.*);/g, function($1, $2){
            var ret = '';
            // 匹配 @import url("xxxx");
            content = $2.replace(/url\(.*[\'\"]([^\'^\"]+)[\'\"].*\)/g, function($3, $4) {
                if($4.indexOf('://') > -1){
                    ret += "@import url(\"" + $4 + "\");\n";
                }else {
                    var importPath = fixFilePath(path.join( path.dirname(filePath), $4));
                    // 如果是 sass 和 scss 则先编译，再将内容拼接
                    if(extNames.indexOf(path.extname(importPath)) > -1) {
                        try {
                            txt = getWholeScssFile(importPath, dir);
                            ret += sass.renderSync({
                                    data: txt,
                                    includePaths: [dir],
                                    outputStyle: 'expanded'
                                }).css.toString() + '\n';
                        }catch(err) {
                            throw new Error('文件 ' + filePath + ' 编译错误: at line ' + err.line + ' column ' + err.column + ': ' + err.message + '\n' + (displayErrorContext(txt, err.line)) );
                        }
                    }else {
                        // 其他 例如 .css 转换相对路径后，由 node-sass 解析
                        var relativePath = fixPathSeq(path.relative(dir, importPath));
                        ret += '@import url("' + relativePath + '");\n';
                    }
                }
                return '';
            });

            // 匹配 @import "xxxx";
            content.replace(/[\'\"]([^\'^\"]+)[\'\"]/g, function($5, $6) {
                if($6.indexOf('://') > -1) {
                    // http:// 直接忽略，用 node-sass 解析
                    ret += "@import \"" + $6 + "\";\n";
                }else {
                    importPath = fixFilePath(path.join(path.dirname(filePath), $6));

                    // 如果是 sass 和 scss 直接将内容拼接
                    if(extNames.indexOf(path.extname(importPath)) > -1){
                        ret += getWholeScssFile(importPath, dir, imports) + '\n';
                    }else {
                        // 其他 例如 .css 转换相对路径后，由 node-sass 解析
                        var relativePath = fixPathSeq( path.relative(dir, importPath) );
                        ret += "@import \"" + relativePath + "\";\n";
                    }
                }
                return ret;
            });
            return ret;
        });
        return data;
    }else {
        return '';
    }
}

// 合并Scss文件
function combineScss(file, enc, cb) {
    file.contents = new Buffer(getWholeScssFile(file.path, enc));
    cb(null, file);
}

// 读取 Yo 版本号
function getVersion() {
    var config = fs.readFileSync(path.join(__dirname,'src','yo','lib', 'core', 'variables.scss'), 'UTF-8').match(/version:\s*"(\d+\.\d+\.\d+)"/);
    return config ? config[1] : 'Not Found';
}

// Sass Version
function getSassVersion() {
    var version = '未知';
    try {
        var str = execSync('sass -v').toString();
        var match = str.match(/Sass\s+(\S*)\s+\(/);
        if (match) {
            version = match[1];
        }
    } catch (e) {
    }
    return version;
}

// Compass Version
function getCompassVersion() {
    var version = '未知';
    try {
        var str = execSync('compass -v').toString();
        var match = str.match(/Compass\s+(\S*)\s+\(/);
        if (match) {
            version = match[1];
        }
    } catch (e) {
    }
    return version;
}

// Node-sass Version
function getNodeSassVersion() {
    var version = '未知';

    try {
        // 全局的 node-sass 版本
        //var str = execSync('node-sass -v').toString();
        // gulp-sass 里包含的 node-sass版本
        var str = nodeSass.compiler.info;
        var matchNodeSass = str.match(/node-sass\s+(\S*)\s+\(/);
        var matchLibSass = str.match(/libsass\s+(\S*)\s+\(/);
        if (matchNodeSass && matchLibSass) {
            version = matchNodeSass[1] + ' ( libsass ' + matchLibSass[1] + ' )';
        }
    } catch (e) {
    }
    return version;
}

// Beautify Css

function beautifyCss(file, enc, cb) {
    file.contents = new Buffer(css.stringify(css.parse(file.contents.toString().replace(/\n+/g, '\n'))));
    cb(null, file);
}

// Error Handler
function errorHandler(e) {
    notifier.notify({
        title: 'Sass Error',
        message: e.fileName,
        icon: path.join(__dirname, 'sass.jpg'),
        sound: true
    });
    gutil.log(gutil.colors.red(e.message));
}

// End Handler
function endHandler() {
    gutil.log(gutil.colors.green('Completed!'));
}

function diffCss(compile1, compile2) {

    var diff1 = css.parse(cssIsolate.diff(this[compile1], this[compile2])),
        diff2 = css.parse(cssIsolate.diff(this[compile2], this[compile1]));

    diff1.stylesheet.rules.forEach(function (rule) {
        rule.declarations.forEach(function (declaration) {
            declaration.value += ' /* ' + compile1 + ' */';
        });
    });

    diff2.stylesheet.rules.forEach(function (rule) {
        rule.declarations.forEach(function (declaration) {
            declaration.value += ' /* ' + compile2 + ' */';
        });
    });

    var addRules = [];

    diff2.stylesheet.rules.forEach(function (rule2) {
        var has = false;
        diff1.stylesheet.rules.forEach(function (rule1) {
            if (rule1.selectors.join(',') == rule2.selectors.join(',')) {
                has = true;
                rule1.declarations = rule1.declarations.concat(rule2.declarations);
            }
        });
        if (!has) {
            addRules.push(rule2);
        }
    });

    diff1.stylesheet.rules = diff1.stylesheet.rules.concat(addRules);

    return css.stringify(diff1);

}

// 构建 Compass Gulp
function buildCompassGulp(scssPath, cssPath) {
    return gulp.src(scssPath + '/*.scss')
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(compass({
            config_file: './config.rb',
            css: cssPath,
            sass: scssPath,
            // nested, expanded, compact, compressed
            style: 'expanded'
        }))
        .pipe(gulp.dest(cssPath))
        .on('end', endHandler);
}

// 构建 Node-Sass Gulp
function buildNodeSassGulp(scssPath, cssPath) {
    return gulp.src(scssPath + '/*.scss')
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(through.obj(combineScss))
        .pipe(nodeSass({
            outputStyle: 'expanded'
        }))
        .pipe(gulp.dest(cssPath))
        .on('end', endHandler);
}

// 构建 Sass Gulp
function buildSassGulp(scssPath, cssPath) {
    return sass(scssPath, {
        style: 'expanded'
    })
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(gulp.dest(cssPath))
        .on('end', endHandler);
}

var compilers = {
    sass: buildSassGulp,
    compass: buildCompassGulp,
    'node-sass': buildNodeSassGulp
};

// 编译 Sass
gulp.task('compile', function () {
    var argv = optimist.argv,
        compiler = argv.c || argv.compiler || defaultCompiler;

    if (compilers[compiler]) {
        gutil.log(gutil.colors.yellow('使用编译器 ' + compiler + ' 编译...'));
        return compilers[compiler](scssPath, cssPath);
    } else {
        gutil.log(gutil.colors.red('找不到编译器 ' + compiler));
    }
});



// 生成sassdoc 文档

gulp.task('sassdoc', function () {

    yodoc.getDoc();
});



// watch变更
gulp.task('watch', function () {
    gulp.watch('./**/*.scss', ['compile']);
});

// 获取 Version
gulp.task('version', function () {
    gutil.log(gutil.colors.green('Yo: ' + getVersion()));
    gutil.log(gutil.colors.green('Sass: ' + getSassVersion()));
    gutil.log(gutil.colors.green('Node-sass: ' + getNodeSassVersion()));
    gutil.log(gutil.colors.green('Compass: ' + getCompassVersion()));
});

// diff

var diffBuildTasks = [];

Object.keys(compilers).forEach(function (compiler) {
    diffBuildTasks.push('compile:' + compiler);
    gulp.task('compile:' + compiler, function () {
        return compilers[compiler](scssBuildPath, path.join(diffBuildPath, compiler));
    });
});

gulp.task('pre-diff', diffBuildTasks, function () {
    return gulp.src(diffBuildPath + '/**/*.css')
        .pipe(stripCssComments())
        .pipe(through.obj(beautifyCss))
        .pipe(gulp.dest(diffBuildPath));
});

gulp.task('diff', ['pre-diff'], function () {
    var contents = {},
        cssFile = '/* Diff with sass, compass, node-sass */',
        argv = optimist.argv,
        file = argv.f || argv.file || 'yo.scss';

    Object.keys(compilers).forEach(function (compiler) {
        contents[compiler] = fs.readFileSync(path.join(__dirname, diffBuildPath, compiler, file.replace(/\.scss$/, '.css')), 'UTF-8');
    });

    cssFile += '\n\n/**';
    cssFile += '\n * Sass: ' + getSassVersion();
    cssFile += '\n * Node-Sass: ' + getNodeSassVersion();
    cssFile += '\n * Compass: ' + getCompassVersion();
    cssFile += '\n */';

    cssFile += '\n\n/* ==================== Diff sass and node-sass ==================== */\n\n' + (diffCss.call(contents, 'sass', 'node-sass') || '/* No Difference */');
    cssFile += '\n\n/* ==================== Diff sass and compass ==================== */\n\n' + (diffCss.call(contents, 'sass', 'compass') || '/* No Difference */');
    cssFile += '\n\n/* ==================== Diff compass and node-ass ==================== */\n\n' + (diffCss.call(contents, 'compass', 'node-sass') || '/* No Difference */');

    fs.writeFileSync(path.join(__dirname, diffBuildPath, 'diff.css'), cssFile, 'UTF-8');
});


// 默认任务
gulp.task('default', ['version', 'compile','sassdoc','watch']);
