const path = require('path');
const fs = require('fs-extra');
const parse = require('../parse/parse.js');
const utils = require('../utils');
const loadPlugins = require('../plugin.js').loadPlugins;

const defaultBuildPath = '_site';
const projectPath = process.cwd();
const configFilepath = path.resolve(projectPath, 'ydoc.json');
const logger = require('../logger');

const config = utils.fileExist(configFilepath) ?  require(configFilepath) : require(path.resolve(projectPath, 'ydoc.js'));
const ydoc = require('../ydoc.js');
utils.extend(ydoc.config, config);

module.exports = {
  setOptions: function (yargs) {
    yargs.option('verbose', {
      describe: 'show debug info.',
      default: false
    })
  },
  run: function (argv) {
    const root = path.resolve(process.cwd(), ydoc.config.root);
    const dist = path.resolve(process.cwd(), defaultBuildPath);
    utils.log = new logger( argv.verbose ? 'debug' : 'info' );
    fs.removeSync(dist);
    fs.ensureDirSync(dist);
    fs.copySync(root, dist);
    loadPlugins();
    parse.parseSite(dist);
  },
  desc: 'build'
}