var qdoc = require('./qdoc.js');

var colors = require('colors');
var fs = require('fs');
var sysPath = require('path');
var JSON5 = require('json5');
var optimist = require('optimist');
var loadConfig = require('./utils/loadConfig.js');
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
                loadConfig(cwd, function(conf) {
                    if (conf) {
                        qdoc.build(cwd, conf, {
                            watch: argv.w || argv.watch,
                            template: argv.t || argv.template,
                            dest: argv.o || argv.output,
                            page: argv.p || argv.page
                        });
                    } else {
                        console.log('配置文件读取失败！'.red);
                    }
                })
            } else if (cmd == 'init') {
                qdoc.init(cwd, {
                    template: argv.t || argv.template
                });
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
