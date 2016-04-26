var fs = require('fs');
var cpr = require('cpr');
var sysPath = require('path');
var colors = require('colors');

var actions = require('./actions');

var templatePath = sysPath.join(__dirname, '../template');

function execTemplate(distPath, tplPath, callback) {
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }
    cpr(sysPath.join(tplPath, 'source'), sysPath.join(distPath, 'source'), {
        deleteFirst: true,
        overwrite: true,
        confirm: false
    }, function(err, files) {
        if (err) {
            console.log('X 资源拷贝失败！'.red);
        } else {
            var tplFilePath = sysPath.join(tplPath, 'template.html');
            if (fs.existsSync(tplFilePath)) {
                callback(fs.readFileSync(tplFilePath, 'utf-8'));
            } else {
                console.log('X 模板读取失败！'.red);
            }
        }
    });
}

module.exports = {
    init: actions.init,
    build: function(cwd, conf) {
        var distPath = sysPath.join(cwd, conf.dist || '_docs'),
            tplPath = conf.template ? sysPath.join(cwd, conf.template) : templatePath;

        execTemplate(distPath, tplPath, function(content) {
            conf.dist = distPath;
            conf.templateContent = content;
            actions.build(cwd, conf, content)
        });
    },
    server: actions.serve
};
