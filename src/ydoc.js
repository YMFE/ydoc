const utils = require('./utils.js');
const path = require('path');
const url = require('url');

const projectPath = utils.projectPath;
const assets = {
  js: [],
  css: []
};

const ydoc = {
  version: require('../package.json').version,
  log: utils.log,  
  config: {
    root: utils.defaultDocsPath,
    dist: utils.defaultBuildPath,
    title: "ydoc",
    description: "website description",
    author: "ymfe",
    theme: 'default'
  },
  hook: function(name) {
    const {emitTplHook} = require('./plugin.js')
    let args = Array.prototype.slice.call(arguments, 1);
    args.unshift(utils.defaultTplHookPrefix + name)
    let tpls = emitTplHook.apply(this, args)
    return tpls.join("\n")
  },
  relePath: function(srcFilepath, importFilepath) {
    const publicPath = ydoc.config.publicPath;
    if (utils.isUrl(importFilepath)) {
      return importFilepath;
    }
    
    importFilepath = path.isAbsolute(importFilepath)? importFilepath : path.resolve(ydoc.config.dist, importFilepath);
    if(publicPath){
      const pageExts = ['.html', '.md', '.jsx'];
      if(!pageExts.includes(path.extname(url.parse(importFilepath).pathname))){
        return publicPath + importFilepath.substr(ydoc.config.dist.length);
      }
    }
    srcFilepath = path.isAbsolute(srcFilepath) ? srcFilepath : path.resolve(ydoc.config.dist, srcFilepath);
    let rele =  path.relative(srcFilepath, importFilepath);
    return rele.substr(3);
  },
  addAsset: function(filepath, type) {
    if (type === 'js') {
      assets.js.push(filepath);
    }else if (type === 'css') {
      assets.css.push(filepath);
    }    
  },
  getAssets: function(type) {
    return type ? [].concat(assets[type]) : {
      js: [].concat(assets.js),
      css: [].concat(assets.css)
    };
  }
}



module.exports = ydoc;


