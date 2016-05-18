var fs = require('fs');
var cpr = require('cpr');
var sysPath = require('path');
var colors = require('colors');
var watch = require('watch');
var through = require('through2');

var actions = require('./actions');
var loadConfig = require('./utils/loadConfig.js');

var templatePath = sysPath.join(__dirname, '../template');

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

var qdoc = module.exports = function(data) {
    data = data || {};
    return through.obj(function(file, enc, cb) {
        var cwd = file.cwd;
        loadConfig(cwd, function(conf) {
            qdoc.build(cwd, conf ? Object.assign(conf, data) : data);
            cb();
        })
    });
};

qdoc.actions = actions;

qdoc.init = actions.init;

qdoc.build = function(cwd, conf, opt) {
    opt = opt || {};
    var template = opt.template || conf.template,
        rDest = opt.dest || conf.dest || '_docs',
        destPath = sysPath.join(cwd, rDest),
        tplPath = template ? sysPath.join(cwd, template) : templatePath,
        buildPages = opt.page;

    if (!buildPages || buildPages == true) {
        buildPages = [];
    } else {
        buildPages = buildPages.split(',').map(function(page) {
            return page.trim();
        });
    }

    conf.buildPages = buildPages;

    execTemplate(destPath, tplPath, function(content, codeContent) {
        conf.dest = destPath;
        conf.templateContent = content;
        conf.codeTemplateContent = codeContent;
        actions.build(cwd, conf);
        console.log('√ Complete!'.green);
        if (opt.watch) {
            console.log('√ Start Watching .......'.green);
            watch.watchTree(cwd, {
                ignoreDirectoryPattern: new RegExp(rDest)
            }, function() {
                console.log('-> Building .......'.gray);
                actions.build(cwd, conf, content);
                console.log('√ Complete!'.green);
                console.log('');
            });
        }
    });
};
