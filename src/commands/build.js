const path = require('path');
const fs = require('fs-extra');
const parse = require('../parse/parse.js');
const utils = require('../utils');
const sass = require('node-sass');
const loadPlugins = require('../plugin.js').loadPlugins;

const defaultBuildPath = '_site';
const projectPath = process.cwd();
const ydocPath = path.resolve(__dirname, '../..')
const styleInPath = path.resolve(ydocPath, 'theme/styles/index.scss');
const scriptInPath = path.resolve(ydocPath, 'theme/scripts/');
const imageInPath = path.resolve(ydocPath, 'theme/images/');
const styleOutPath = path.resolve(projectPath, defaultBuildPath + '/ydoc/styles', 'style.css');
const scriptOutPath = path.resolve(projectPath, defaultBuildPath + '/ydoc/scripts/');
const imageOutPath = path.resolve(projectPath, defaultBuildPath + '/ydoc/images/');
const logger = require('../logger');

const configFilepath = utils.getConfigPath(projectPath);
const config = utils.fileExist(configFilepath) ? require(configFilepath) : {};
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
    const componentsDist = path.resolve(dist, '_components');
    const componentsRoot = path.resolve(__dirname, '../../theme/components');
    ydoc.config.buildPath = dist;
    
    fs.removeSync(dist);
    fs.ensureDirSync(dist);
    fs.ensureDirSync(componentsDist);
    fs.ensureDirSync(path.resolve(dist, 'ydoc/styles'));
    fs.ensureDirSync(path.resolve(dist, 'ydoc/scripts'));
    fs.ensureDirSync(path.resolve(dist, 'ydoc/images'));
    fs.copySync(scriptInPath, scriptOutPath);
    fs.copySync(imageInPath, imageOutPath);
    fs.copySync(root, dist);

    let components = fs.readdirSync(componentsRoot);
    components.forEach(item=>{
      if(path.extname(item) !== '.jsx' || item[0].toUpperCase() !== item[0]) return;
      let distPath = path.resolve(componentsDist, item)
      if(!utils.fileExist(distPath)){
        fs.copySync(path.resolve(componentsRoot, item), distPath)
      }
    })

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
  desc: 'Generate the document site'
}