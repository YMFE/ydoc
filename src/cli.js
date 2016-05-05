var qdoc = require('./qdoc.js');

var colors = require('colors');
var fs = require('fs');
var sysPath = require('path');
var JSON5 = require('json5');
var optimist = require('optimist');
var packageJSON = require('../package.json');

function helpTitle() {
    console.info('');
    console.info('===================== QDoc ' + packageJSON.version + ' ====================');
    console.info('');
}

function fixempty(str, limit) {
    var i, n = limit - str.length;
    if (n < 0) {
        n = 0;
    }
    return str + ((function() {
        var _i, _results = [];
        for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
            _results.push(" ");
        }
        return _results;
    })()).join('');
};

var cli = module.exports = {
    run: function(cmd) {
        var cwd = process.cwd(),
            conf = {},
            argv = optimist.argv;
        if (qdoc[cmd]) {
            if (argv.h || argv.help) {
                helpTitle();
                console.info('');
                console.info('命令：', cmd);
                console.info('说明：', qdoc.actions[cmd].usage);
                console.info('');
                if (qdoc.actions[cmd].setOptions) {
                    qdoc.actions[cmd].setOptions(optimist);
                }
                optimist.showHelp();
            } else if (cmd == 'build') {
                var confPath = sysPath.join(cwd, 'qdoc.config'),
                    confJSPath = sysPath.join(cwd, 'qdocfile.js');
                if (fs.existsSync(confPath)) {
                    try {
                        conf = JSON5.parse(fs.readFileSync(confPath, 'utf-8'));
                    } catch (e) {
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
                        conf = qdocfile;
                    }
                } else {
                    console.log('X 配置文件读取失败！'.red);
                    process.exit(1);
                }
                qdoc.build(cwd, conf, {
                    watch: argv.w || argv.watch,
                    template: argv.t || argv.template
                });
            } else if (cmd == 'init') {
                qdoc.init(cwd);
            }

        } else {
            console.log('X 命令不存在！'.red);
        }
    },
    help: function() {
        helpTitle();
        for (var key in qdoc.actions) {
            console.info(' ' + (fixempty(key, 15)) + ' # ' + (qdoc.actions[key].usage || ''));
        }
        console.info('');
        console.info(' 如果需要帮助, 请使用 qdoc {命令名} --help ');
    }
};
