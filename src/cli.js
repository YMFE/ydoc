var ydoc = require('./ydoc.js');
var colors = require('colors');
var fs = require('fs');
var sysPath = require('path');
var JSON5 = require('json5');
var optimist = require('optimist');
var loadConfig = require('./utils/loadConfig.js');
var commonConfig = require('../common.json');

var packageJSON = require('../package.json');

function helpTitle() {
    console.info('');
    console.info('===================== YDoc ' + packageJSON.version + ' ====================');
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
        if (ydoc[cmd]) {
            if (argv.h || argv.help) { // 获取帮助
                helpTitle();
                console.info('');
                console.info('命令：', cmd);
                console.info('说明：', ydoc.actions[cmd].usage);
                console.info('');
                if (ydoc.actions[cmd].setOptions) {
                    ydoc.actions[cmd].setOptions(optimist);
                }
                optimist.showHelp();
            } else if (cmd == 'build') { // 构建文档
                // 加载自定义配置
                loadConfig(cwd, function(conf) {
                    if (conf) {
                        var afterconf = Object.assign(commonConfig,conf);
                        // 开始构建
                        ydoc.build(cwd, afterconf, {
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
                ydoc.init(cwd, {
                    template: argv.t || argv.template
                });
            }

        } else {
            console.log('X 命令不存在！'.red);
        }
    },
    help: function() {
        helpTitle();
        for (var key in ydoc.actions) {
            console.info(' ' + (fixempty(key, 15)) + ' # ' + (ydoc.actions[key].usage || ''));
        }
        console.info('');
        console.info(' 如果需要帮助, 请使用 ydoc {命令名} --help ');
    }
};
