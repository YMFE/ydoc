const path = require('path');
const fs = require('fs-extra');
const parse = require('../parse/parse.js');
const utils = require('../utils');
const stylus = require('stylus');

const defaultBuildPath = '_site';
const projectPath = process.cwd();
const configFilepath = path.resolve(projectPath, 'ydoc.json');
const styleInPath = path.resolve(projectPath, 'theme/css/main.styl');
const styleOutPath = path.resolve(projectPath, 'docs/documents/css', 'style.css');
const logger = require('../logger');

const config = utils.fileExist(configFilepath) ?  require(configFilepath) : require(path.resolve(projectPath, 'ydoc.js'));
const ydoc = require('../ydoc.js');
utils.extend(ydoc, config);

module.exports = {
  setOptions: function (yargs) {
    yargs.option('verbose', {
      describe: 'show debug info.',
      default: false
    })
  },
  run: function (argv) {
    const root = path.resolve(process.cwd(), ydoc.root);
    const dist = path.resolve(process.cwd(), defaultBuildPath);

    // 编译 styl 文件至 docs 目录中
    const stylusContent = fs.readFileSync(styleInPath, 'utf8');
    stylus(stylusContent).render(function (err, css) {
      fs.writeFileSync(styleOutPath, css);
    });


    utils.log = new logger( argv.verbose ? 'debug' : 'info' );
    fs.removeSync(dist);
    fs.ensureDirSync(dist);
    fs.copySync(root, dist);
    parse.parseSite(dist);
  },
  desc: 'build'
}