var utils = require('../utils.js'),
	optimist = require('optimist');




exports.usage = "初始化docfile.config";

exports.set_options = function(optimist) {
	optimist.alias('d', 'demo');
	optimist.describe('d', '生成有demo的docfile.config文件');
    return optimist;
};

exports.run = function(options) {
	var config,
		argv = optimist.argv,
		FILENAME = 'docfile.config',
		BASEPATH = options.cwd,
		CONFIGPATH = utils.path.join(BASEPATH, FILENAME);
		
	config = argv.d || argv.demo ? require(utils.path.join(__dirname, '../../src', 'configDemo.js')) : require(utils.path.join(__dirname, '../../src', 'config.js'));
	utils.file.create(CONFIGPATH);
	utils.file.write(CONFIGPATH, JSON.stringify(config, {}, 4));
	utils.logger.success("初始化成功.");
}