const utils = require('./utils.js');
const path = require('path');
const projectPath = utils.projectPath;
const asserts = {
  js: [],
  css: []
}

const ydoc = {
  version: require('../package.json').version,
  log: utils.log,
  config: {
    root: utils.defaultDocsPath,
    title: "ydoc",
    description: "ydoc description",
    author: "ymfe"
  },
  relePath: function(srcFilepath, importFilepath){
    if(utils.isUrl(importFilepath)){
      return importFilepath;
    }
    importFilepath = path.isAbsolute(importFilepath)? importFilepath : path.resolve(ydoc.config.buildPath, importFilepath);
    srcFilepath = path.isAbsolute(srcFilepath) ? srcFilepath : path.resolve(ydoc.config.buildPath, srcFilepath);
    let rele =  path.relative(srcFilepath, importFilepath);
    return rele.substr(3);
  },
  addAssert: function(filepath, type){
    if(type === 'js'){
      asserts.js.push(filepath);
    }else if(type === 'css'){
      asserts.css.push(filepath);
    }    
  },
  getAsserts: function(type){
    return type ? [].concat(asserts[type]) : {
      js: [].concat(asserts.js),
      css: [].concat(asserts.css)
    };
  }
}

const configFilepath = utils.getConfigPath(projectPath);
const config = utils.getConfig(configFilepath);
utils.extend(ydoc.config, config);

const defaultBuildPath = ydoc.config.buildPath || '_site';
ydoc.config.dist = path.resolve(projectPath, defaultBuildPath);  
ydoc.config.root = path.resolve(projectPath, ydoc.config.root);

module.exports=ydoc;


