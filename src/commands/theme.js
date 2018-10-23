// 安装主题的时候，先执行npm install, 如果有copy, 然后再复制到theme文件夹下面
const path = require('path');
const fs = require('fs-extra');
const child_process = require('child_process');
const projectPath = process.cwd();
const argv= process.argv;
const utils = require('../utils');
const themePath = path.resolve(projectPath, 'theme');

module.exports = {
  setOptions: function () {},
  run: function () {
    // 执行npm install testTheme 
    let themeName;
    // console.log('------argv', argv);
    if(argv.length >= 4) {
      themeName = argv[3];
      console.log(`Start install ${themeName}......` );
      child_process.execSync(`npm install --save-dev ${themeName}`, function(err){
        if(err) {
            throw err;
        } else {
            console.log(`Install the theme ${themeName} success` );
        }

      });
    } else {
       return utils.log.error('The theme is not exists.')
    }
    // 新建一个theme的文件夹，把nodeModules中的文件复制出来
    // console.log('+++++123', argv.length, argv[4] === '--copy', argv[4] === '-c')
    if (argv.length === 5 && (argv[4] === '--copy' || argv[4] === '-c')) {
      if(!fs.existsSync(themePath)) {
        fs.mkdirSync(themePath)
      }
      let themeFile = path.resolve(themePath, `${themeName}`);
      if(!fs.existsSync(themeFile)) {
        fs.mkdirSync(themeFile)
      }
      let modules = path.resolve(process.cwd(), 'node_modules');
      let themeModuleDir = path.resolve(modules, `./${themeName}`);
      utils.mergeCopyFiles(path.resolve(themeModuleDir, "./theme"), themeFile);
    }
    utils.log.ok('Install a theme success')
  },
  desc: 'Install a theme'
}