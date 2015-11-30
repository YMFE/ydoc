var cli = require('./cli.js'),
    utils = require('./utils.js');

exports.usage = "文档生成工具";

exports.set_options = function( optimist ){
    var cmd = optimist.argv._[1];

    if(optimist.argv.help || optimist.argv.h){
        cmd ? cli.run(cmd) : cli.help();
        process.exit(0);
    }

    if (cmd && utils.file.exists(utils.path.join(__dirname, 'commands', cmd + '.js'))) {
        var command = require(utils.path.join(__dirname, 'commands', cmd + '.js')),
            cmdOptions = command.options || {};

        for (var key in cmdOptions) {
            var kv = key.split(':'),
                long = kv[0],
                short = kv[1];
            if (short) {
                optimist.alias(short, long);
            }
            optimist.describe(short || long, cmdOptions[key]);
        }
    }
    return optimist;
}

exports.run = function( options ){
    var cmd = options._[1];
    cmd ? cli.run(cmd) : cli.help();
}