const path = require('path');
const fs = require('fs-extra');
const parse = require('../parse.js');
const utils = require('../utils');

const projectPath = process.cwd();
const configFilepath = path.resolve(projectPath, 'ydoc.json');

const config = utils.fileExist(configFilepath) ?  require(configFilepath) : {};
const ydoc = require('../ydoc.js');
utils.extend(ydoc, config);

module.exports = {
  setOptions: function (yargs) {},
  run: function (argv) {
    const root = path.resolve(process.cwd(), config.root);
    const dist = path.resolve(process.cwd(), './_site');
    fs.removeSync(dist);
    fs.ensureDirSync(dist);
    fs.copySync(root, dist);

    var rootFiles = fs.readdirSync(dist);
    rootFiles.forEach(item=>{
      let bookPath = path.resolve(dist, item);
      let stats = fs.statSync(bookPath);      
      if(stats.isDirectory() && item[0] !== '_' && item[0] !== 'style' ){
        parse.parseBook(bookPath);
      }
    })
  },
  desc: 'build'
}