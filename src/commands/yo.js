var gulp = require('../gulp.js'),
	utils = require('../utils.js');

exports.usage = "Yo项目文档构建命令";

exports.set_options = function(optimist) {
    return optimist;
};

exports.run = function(options) {
	var BASEPATH, config;
	
		BASEPATH = options.cwd;
		configFilePath = utils.path.join(BASEPATH, 'docfile.config');
	if(utils.file.exists(configFilePath)){
		require('../res/yo/gulpfile.js');
		gulp(['default']);
	}else{
		utils.logger.info("找不到docfile.config文件, 请使用 qdoc init 命令初始化");
	}
}