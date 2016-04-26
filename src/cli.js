var qdoc = require('./qdoc.js');

var colors = require('colors');
var fs = require('fs');
var sysPath = require('path');
var JSON5 = require('json5');

var cli = module.exports = {
    run: function(cmd) {
        var cwd = process.cwd(),
            conf = {};
        if (qdoc[cmd]) {
            if (cmd == 'build' || cmd == 'serve') {
                var confPath = sysPath.join(cwd, 'qdoc.config'),
                    confJSPath = sysPath.join(cwd, 'qdocfile.js');
                if (fs.existsSync(confPath)) {
                    try {
                        conf = JSON5.parse(fs.readFileSync(confPath, 'utf-8'));
                    } catch(e) {
                        console.log('X qdoc.config 文件读取失败！'.red);
                        process.exit(1);
                    }
                } else if (fs.existsSync(confJSPath)) {
                    var qdocfile = require(confJSPath);
                    if (typeof qdocfile == 'function') {
                        if (qdocfile.length == 1) {
                            qdocfile(function(conf) {
                                qdoc[cmd](cwd, conf);
                            });
                            process.exit(1);
                        } else {
                            conf = qdocfile();
                        }
                    } else {
                        console.log('X qdoc.config 文件读取失败！'.red);
                        process.exit(1);
                    }
                } else {
                    console.log('X 配置文件读取失败！'.red);
                    process.exit(1);
                }
            }
            qdoc[cmd](cwd, conf);
        } else {
            console.log('X 命令不存在！'.red);
        }
    },
    help: function() {

    }
};
