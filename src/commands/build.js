const path = require('path');
const fs = require('fs-extra');
const parse = require('../parse/parse.js');
const utils = require('../utils');
const sass = require('node-sass');
const loadPlugins = require('../plugin.js').loadPlugins;

const defaultBuildPath = '_site';
const projectPath = process.cwd();
const configFilepath = path.resolve(projectPath, 'ydoc.json');
const styleInPath = path.resolve(projectPath, 'theme/styles/index.scss');
const styleOutPath = path.resolve(projectPath, defaultBuildPath+'/ydoc/styles', 'style.css');
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
    utils.log = new logger( argv.verbose ? 'debug' : 'info' );

    const root = path.resolve(process.cwd(), ydoc.config.root);
    const dist = path.resolve(process.cwd(), defaultBuildPath);
    ydoc.config.buildPath = dist;
    
    fs.removeSync(dist);
    fs.ensureDirSync(dist);
    fs.ensureDirSync(path.resolve(dist, 'ydoc'));
    fs.copySync(root, dist);
    loadPlugins();
    parse.parseSite(dist);

    // 编译 scss 文件至 docs 目录中
    sass.render({
      file: styleInPath,
      outFile: styleOutPath,
      outputStyle: 'expanded'
    }, function (err, result) {
      if (!err) {
        fs.writeFile(styleOutPath, result.css, function (err) {
          if (err) {
            throw err;
          }
        })
      } else {
        throw err;
      }
    });
  },
  desc: 'build'
}