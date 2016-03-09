var utils = require('../utils.js'),
	readline = require('readline'),
	optimist = require('optimist');



function creatConfigFile(file, content){
	utils.file.create(file);
	utils.file.write(file, JSON.stringify(content, {}, 4));
	utils.logger.success("docfile.config文件下载完成,请在根目录下进行配置");
	utils.logger.success("初始化成功");
};

exports.usage = "初始化docfile.config";

exports.set_options = function(optimist) {
	optimist.describe('s', '为scss文件,生成demo的docfile.config文件');
	optimist.describe('j', '为js文件,生成demo的docfile.config文件');
	optimist.describe('r', '为react文件,生成demo的docfile.config文件');
	optimist.describe('m', '获取模板文件');
    return optimist;
};

exports.run = function(options) {
	var config,
		argv = optimist.argv,
		FILENAME = 'docfile.config',
		BASEPATH = options.cwd,
		CONFIGPATH = utils.path.join(BASEPATH, FILENAME);
	
	//下载模板
	if(argv.m){
		utils.dir.copySync(utils.path.join(__dirname, '../template/'), utils.path.join(BASEPATH,"template"));
		utils.logger.success("模板文件下载完成! 请查看根目录下template文件夹");
	}

	for(var i in argv){
		switch (i){
			case "s":
				config = require(utils.path.join(__dirname, '../../src/config/', 'configScssDemo.js'));
				break;
			case "r":
				config = require(utils.path.join(__dirname, '../../src/config/', 'configReactDemo.js'));
				break;
			case "j":
				config = require(utils.path.join(__dirname, '../../src/config/', 'configJsDemo.js'));
				break;
		}
	}
	config = config || require(utils.path.join(__dirname, '../../src/config/', 'config.js'));	

	//生成docfile.config文件
	if(utils.file.exists(CONFIGPATH)) {
        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        var question = '本地已存在' + FILENAME + '是否替换Y/N: ';
        rl.question(question.yellow, function(answer) {
            if(answer.match(/^y(es)?$/i)){
                utils.file.del(CONFIGPATH);
                creatConfigFile(CONFIGPATH, config);
                rl.close();
            }else{
                process.exit (1);
            }
        });
    }else {
        creatConfigFile();
    }	
}

