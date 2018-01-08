const utils = require('./utils.js');
const path = require('path');


const ydoc = {
  version: require('../package.json').version,
  log: utils.log,
  config: {
    root: "./docs",
    title: "ydoc",
    description: "ydoc description",
    author: "ymfe"
  },
  relePath: function(srcFilepath, importFilepath){
    importFilepath = path.isAbsolute(importFilepath)? importFilepath : path.resolve(ydoc.config.buildPath, importFilepath);
    let rele =  path.relative(srcFilepath, importFilepath);
    return rele.substr(3);
  },
  addAssert: function(filepath, type){
    if(type === 'js'){
      this.asserts.js.push(filepath);
    }else if(type === 'css'){
      this.asserts.css.push(filepath);
    }
    
  },
  asserts: {
    js: [],
    css: []
  }
}

module.exports=ydoc;


