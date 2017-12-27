const path = require('path');
const fs = require('fs-extra');
const parse = require('../parse.js');
const utils = require('../utils');

const defaultBuildPath = '_site';
const projectPath = process.cwd();
const configFilepath = path.resolve(projectPath, 'ydoc.json');

const config = utils.fileExist(configFilepath) ?  require(configFilepath) : {};
const ydoc = require('../ydoc.js');
utils.extend(ydoc, config);

module.exports = {
  setOptions: function (yargs) {},
  run: function (argv) {
    const root = path.resolve(process.cwd(), config.root);
    const dist = path.resolve(process.cwd(), defaultBuildPath);
    fs.removeSync(dist);
    fs.ensureDirSync(dist);
    fs.copySync(root, dist);
    parse.parseSite(dist);
  },
  desc: 'build'
}