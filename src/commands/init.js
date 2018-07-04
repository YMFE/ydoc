const path = require('path');
const fs = require('fs-extra');
const projectPath = process.cwd();
const utils = require('../utils');
const initPath = path.resolve(__dirname, '../init');
const docsPath = path.resolve(projectPath, 'docs');
const projectConfig = path.resolve(projectPath, 'ydoc.json');
const initydoc = require('../initydoc');

module.exports = {
  setOptions: function () {},
  run: function () {
    let configFilepath = utils.getConfigPath(projectPath);
    if (configFilepath) {
      return utils.log.error('The current directory already exists ydoc config.')
    }else if (utils.dirExist(docsPath)) {
      return utils.log.error('The current directory already exists directory "docs".');
    }
    const configs = initydoc();
    if(Object.keys(configs).length > 0){
        fs.writeFileSync(projectConfig, JSON.stringify(configs, {}, 2));
    }
    fs.ensureDirSync(docsPath);
    fs.copySync(initPath, docsPath);
    utils.log.ok('Initialization successful, please use the following command to generate the documents site.')
    utils.log.info('Execute: "ydoc build"')
  },
  desc: 'Initialize a document site'
}