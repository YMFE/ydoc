var utils = require('./utils.js'),
    optimist = require('optimist');

function hasCommand(cmd) {
    return utils.file.exists(utils.path.join(__dirname, 'commands', cmd + '.js'));
}

function fixEmpty(str, limit) {
    var i, n = limit - str.length;
    for (i = 0; i < n; i ++) {
        str += ' ';
    }
    return str;
}

module.exports = {
    name: '文档生成工具',
    version: '',
    loadConfig: function() {
        var config = utils.file.readJson(utils.path.join(__dirname, '..', 'package.json'));
        if (config) {
            this.version = config.version;
        }
        this.loadConfig = function(){};
    },
    title: function() {
        this.loadConfig();
        utils.logger.log();
        utils.logger.log('==================== ' + this.name + ' ' + this.version + ' ====================');
        utils.logger.log();
    },
    help: function(){
        var commandBasePath = utils.path.join(__dirname, 'commands'),
            cmd;
        this.title();
        (utils.dir.read(commandBasePath) || []).forEach(function(name) {
            if(name.indexOf('_') !== 0){
                cmd = require(utils.path.join(commandBasePath, name));
                if (cmd) {
                    utils.logger.log(' ', fixEmpty(name.split('.')[0], 15), '#', cmd.usage || '');
                }
            }
        });
        utils.logger.log();
        utils.logger.log(" 如果需要帮助, 请使用 qdoc {命令名} --help ");
        utils.logger.log();
    },
    run: function(cmd){
         if (hasCommand(cmd)) {
            var command = require(utils.path.join(__dirname, 'commands', cmd + '.js')),
                cmdOptions = command.options || {},
                argv = optimist.argv,
                options = {};

            if (command) {
                if (argv.help || argv.h) {
                    this.title();
                    utils.logger.log(' 命令:', cmd);
                    utils.logger.log(' 功能:', command.usage || '');
                    utils.logger.log(' 选项:',JSON.stringify(cmdOptions) === "{}" ? '无': '');

                    for (var key in cmdOptions) {
                        var kv = key.split(':'),
                            param = '--' + kv[0],
                            short = kv[1];
                        if (short) {
                            param += ', -' + short;
                        }
                        utils.logger.log('    ', fixEmpty(param, 15), '#', cmdOptions[key] || '');
                    }
                }
                else {
                    for (var key in cmdOptions) {
                        var kv = key.split(':'),
                            param = kv[0],
                            short = kv[1];

                        if (argv[param]) {
                            options[param] = argv[param];
                        } else if (short && argv[short]) {
                            options[param] = argv[short];
                        }
                    }

                    options.cwd = process.cwd();
                    options._ = argv._;

                    command.process(options);
                }
            }
        } else {
            utils.logger.error('没有找到 ' + cmd + ' 命令.');
        }
    }
};