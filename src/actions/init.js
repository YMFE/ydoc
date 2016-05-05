var fs = require('fs');
var sysPath = require('path');

var configTPL = {
    name: "",
    common: "",
    pages: []
};

module.exports = function(cwd) {
    var confFilePath = sysPath.join(cwd, 'qdoc.config'),
        jsConfFilePath = sysPath.join(cwd, 'qdocfile.js');
    if (fs.existsSync(confFilePath) || fs.existsSync(jsConfFilePath)) {
        console.log('X 配置文件已经存在!'.red);
    } else {
        fs.writeFileSync(confFilePath, JSON.stringify(configTPL, {}, 4), 'UTF-8');
        console.log('√ 生成 qdoc.config 成功！');
    }
}

module.exports.usage = '初始化配置文件'
