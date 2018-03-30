const utils = require('./utils.js');
const path = require('path');

const projectPath = utils.projectPath;
const assets = {
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
    author: "ymfe",
    theme: 'default'
  },
  hook: function(name){
    const {emitTplHook} = require('./plugin.js')
    let args = Array.prototype.slice.call(arguments, 1);
    args.unshift(utils.defaultTplHookPrefix + name)
    let tpls = emitTplHook.apply(this, args)
    return tpls.join("\n")
  },
  relePath: function(srcFilepath, importFilepath){
    if(utils.isUrl(importFilepath)){
      return importFilepath;
    }
    importFilepath = path.isAbsolute(importFilepath)? importFilepath : path.resolve(ydoc.config.dist, importFilepath);
    srcFilepath = path.isAbsolute(srcFilepath) ? srcFilepath : path.resolve(ydoc.config.dist, srcFilepath);
    let rele =  path.relative(srcFilepath, importFilepath);
    return rele.substr(3);
  },
  addAsset: function(filepath, type){
    if(type === 'js'){
      assets.js.push(filepath);
    }else if(type === 'css'){
      assets.css.push(filepath);
    }    
  },
  getAssets: function(type){
    return type ? [].concat(assets[type]) : {
      js: [].concat(assets.js),
      css: [].concat(assets.css)
    };
  }
}

const configFilepath = utils.getConfigPath(projectPath);
const config = utils.getConfig(configFilepath);
utils.extend(ydoc.config, config);

const defaultBuildPath = ydoc.config.dist || utils.defaultBuildPath;
ydoc.config.dist = path.resolve(projectPath, defaultBuildPath);  
ydoc.config.root = path.resolve(projectPath, ydoc.config.root);

module.exports=ydoc;


