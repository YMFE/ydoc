var utils = require('../utils.js'),
	optimist = require('optimist');

exports.usage = "初始化docfile.config";

exports.set_options = function(optimist) {
	optimist.alias('d', 'demo');
	optimist.describe('d', '生成有demo的docfile.config文件');
	optimist.alias('m', 'module');
	optimist.describe('m', '获取模板文件');
    return optimist;
};

exports.run = function(options) {
	var config,
		argv = optimist.argv,
		FILENAME = 'docfile.config',
		BASEPATH = options.cwd,
		CONFIGPATH = utils.path.join(BASEPATH, FILENAME);
	
	config = argv.d || argv.demo ? require(utils.path.join(__dirname, '../../src', 'configDemo.js')) : require(utils.path.join(__dirname, '../../src', 'config.js'));		

	if(argv.m || argv.module){
		utils.dir.copySync(utils.path.join(__dirname, '../template/'), utils.path.join(BASEPATH,"template"));
		utils.logger.success("模板文件下载完成! 请查看根目录下template文件夹");
	}

	utils.file.create(CONFIGPATH);
	utils.file.write(CONFIGPATH, JSON.stringify(config, {}, 4));
	utils.logger.success("docfile.config文件下载完成,请在根目录下进行配置");
	utils.logger.success("初始化成功");
}