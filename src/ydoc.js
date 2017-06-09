var fs = require('fs');
var cpr = require('cpr');
var sysPath = require('path');
var colors = require('colors');
var watch = require('watch');
var through = require('through2');
var globby = require('globby');
var childProcess = require('child_process');
var shell = require('shelljs');

var actions = require('./actions');
var loadConfig = require('./utils/loadConfig.js');

var templatePath = sysPath.join(__dirname, '../template');

// 判断是否有git命令
if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

// 获取时间, 格式 => hh:mm:ss
function checkTime(i){
    if (i<10){
        i="0" + i;
    }
    return i;
}
function startTime(){
    var today=new Date()
    var h=today.getHours()
    var m=today.getMinutes()
    var s=today.getSeconds()
    h=checkTime(h)
    m=checkTime(m)
    s=checkTime(s)
    return '[' + h + ':' + m + ':' + s + ']';
}

function execTemplate(destPath, tplPath, callback) {
    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
    }
    cpr(sysPath.join(tplPath, 'source'), sysPath.join(destPath, 'source'), {
        deleteFirst: true,
        overwrite: true,
        confirm: false
    }, function(err, files) {
        if (err) {
            console.log('X 资源拷贝失败！'.red);
        } else {
            var tplFilePath = sysPath.join(tplPath, 'template.html');
            var codeTplFilePath = sysPath.join(tplPath, 'code.html');
            if (fs.existsSync(tplFilePath) && fs.existsSync(codeTplFilePath)) {
                callback(fs.readFileSync(tplFilePath, 'utf-8'), fs.readFileSync(codeTplFilePath, 'utf-8'));
            } else {
                console.log('X 模板读取失败！'.red);
            }
        }
    });
}

var ydoc = module.exports = function(data) {
    data = data || {};
    return through.obj(function(file, enc, cb) {
        var cwd = file.cwd;
        loadConfig(cwd, function(conf) {
            ydoc.build(cwd, conf ? Object.assign(conf, data) : data);
            cb();
        });
    });
};

ydoc.actions = actions;

ydoc.init = actions.init;

ydoc.build = function(cwd, conf, opt) {
    opt = opt || {};
    // 多版本时生成文件到对应version的路径
    var li = '',
        template = opt.template || conf.template,
        rDest = opt.dest || conf.dest || '_docs',
        destPath = sysPath.join(cwd, rDest), // add=>version?
        tplPath = template ? sysPath.join(cwd, template) : templatePath,
        buildPages = opt.page;
    // 多版本切换
    if(conf.mutiversion){
        shell.exec('git add -A && git commit -m "commit *doc"');
        var docBranch = conf.mutiversion.docbranch,
            docDir = '../ydocCache';
        if(docBranch){
            // 新建目录 ydocCache 缓存各分支文档
            shell.rm('-rf', docDir);
            shell.mkdir(docDir);
            // 遍历版本号，切换到对应的分支拷贝文件
            conf.mutiversion.versions.forEach(function(item, index){
                li += '<li class="m-version-item"><a class="link" href="../' + item.name + '/index.html">'+item.name+'</a></li>\n';
                // 切换到各版本分支
                shell.exec('git checkout ' + item.branch);
                shell.exec('ydoc build');
                // 加载配置文件
                loadConfig(cwd, function(conf) {
                    if (conf) {
                        // 获取该分支文档目录
                        var branchDest = opt.dest || conf.dest || '_docs';
                        shell.rm('-rf', branchDest + '/' + item.name);
                        shell.cp('-rf', branchDest + '/', docDir + '/' + item.name);
                        console.log(('√ 复制 ' + item.name + ' 分支文档至: ' + docDir + '/' + item.name).yellow);
                    } else {
                        console.log(item.branch + '分支的配置文件读取失败！'.red);
                    }
                });
                shell.exec('git add -A && git stash');
            });
            // 获取多版本标签切换的 html
            var getVersionHTML = function(versionName) {
                var title = '<p class="version-selector" data-target="version">' + versionName + '<span data-target="version" class="ydocIcon icon">&#xf3ff;</span></p>';
                var ul = '<ul class="m-version-mask">' + li + '</ul>';
                return '<div class="m-version">' + title + ul + '</div>';
            }
            // 切换回生成文档的分支
            shell.exec('git checkout ' + docBranch);
            // 删除主分支文档，将其他分支拷贝出来的文档剪切进来
            shell.rm('-rf', rDest);
            shell.cp('-rf', docDir + '/', rDest);
            shell.rm('-rf', docDir);
            console.log('-> 添加版本切换标签.......'.gray);
            shell.ls(rDest + '/*/*.html').forEach(function (file) {
                var reg = new RegExp(rDest + "\/(.+)\/","gi");
                var versionName = reg.exec(file)[1];
                shell.sed('-i', /(navbar-brand.+\<\/a\>)/gi, '$1' + getVersionHTML(versionName), file);
                console.log(('√ 添加版本切换标签: ' + file).yellow);
            });
            console.log('√ Complete!\n'.green);
        }else {
            console.log('Warning: 请配置文档分支名称!'.red);
        }
    }else {
        // 未使用多版本切换

        if (!buildPages || buildPages == true) {
            buildPages = [];
            try {
                childProcess.execSync('rm -rf ' + destPath);
            } catch(e) {}
        } else {
            buildPages = buildPages.split(',').map(function(page) {
                return page.trim();
            });
        }

        conf.rDest = rDest;
        conf.buildPages = buildPages;

        var build = function(content) {
            console.log('-> Building .......'.gray);
            actions.build(cwd, conf, content);
            console.log('√ Complete!'.green);
        }

        execTemplate(destPath, tplPath, function(content, codeContent) {
            conf.dest = destPath;
            conf.templateContent = content;
            conf.codeTemplateContent = codeContent;
            build(content);
            // 监听文件变化
            if (opt.watch) {
                console.log('√ Start Watching .......'.green);
                watch.watchTree(cwd, {
                    ignoreDirectoryPattern: new RegExp(rDest) // 不监听这些文件的变化
                }, function(path) {
                    var reg = /ydoc.json$|ydoc.config$|ydocfile.js$/gi;
                    // 判断doc的配置文件是否变化，若变化则更新配置文件后构建文档
                    if(reg.test(path)){
                        console.log((startTime()+'--> Reload Config ......').cyan);
                        loadConfig(cwd, function(cf) {
                            cf.buildPages = buildPages;
                            cf.dest = destPath;
                            cf.templateContent = content;
                            cf.codeTemplateContent = codeContent;
                            conf = cf;
                            build(content);
                        });
                    }else {
                        console.log((startTime()+'--> Reload Config ......').cyan);
                        build(content);
                    }
                });
            }
        });
    }

};
