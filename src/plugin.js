const ydoc = require('./ydoc.js');
const path = require('path');
const utils = require('./utils.js');
const fs = require('fs-extra');

let DEFAULT_PLUGINS = ['execution-time', 'import-asset', 'search'];

const hooks = {}

function addHook(arr){
  arr.forEach(hookname=> hooks[hookname] = {
    listener: []
  })
}

function addTplHook(arr){
  arr.forEach(hookname=> hooks[utils.defaultTplHookPrefix + hookname] = {
    listener: []
  })
}

addHook(["init","nav", "finish", "book:before", "book", "page:before", "page"])
addTplHook(["header","mask"])


function bindHook(name, listener) {
  if (!name) throw new Error(`Hookname ${name} is undefined.`);
  if (name in hooks === false) {
    throw new Error(`It is't exist hookname ${name}.`);
  }
  hooks[name].listener.push(listener);
}

exports.bindHook = bindHook;

/**
* 
* @param {*} hookname
* @return promise 
*/
exports.emitHook = function emitHook(name) {
  if (hooks[name] && typeof hooks[name] === 'object') {
    let args = Array.prototype.slice.call(arguments, 1);
    let promiseAll = [];

    if (Array.isArray(hooks[name].listener)) {
      let listenerList = hooks[name].listener;
      for (let i = 0, l = listenerList.length; i < l; i++) {
        let context = utils.extend({}, ydoc);
        context.options = listenerList[i].options;
        promiseAll.push(Promise.resolve(listenerList[i].fn.apply(context, args)));
      }
    }
    return Promise.all(promiseAll);
  }
}

/**
* 
* @param {*} hookname
* @return promise 
*/
exports.emitTplHook = function emitHook(name) {
  let all = [];
  if (hooks[name] && typeof hooks[name] === 'object') {
    let args = Array.prototype.slice.call(arguments, 1);
    
    if (Array.isArray(hooks[name].listener)) {
      let listenerList = hooks[name].listener;
      for (let i = 0, l = listenerList.length; i < l; i++) {
        let context = utils.extend({}, ydoc);
        context.options = listenerList[i].options;
        all.push(listenerList[i].fn.apply(context, args));
      }
    }
  }
  return all;
}

function _importAsset(filepath, type, pluginAssetPath){
  filepath = path.resolve(pluginAssetPath, filepath);
  return ydoc.addAsset(filepath, type)
}

function handleAssets(config, dir, pluginName){
  let pluginAssetPath;
  if(config && typeof config === 'object'){
    if(config.dir){
      let pluginPath = path.resolve(dir, config.dir);
      pluginAssetPath = path.resolve(ydoc.config.dist, 'ydoc/ydoc-plugin-' + pluginName) ;
      fs.ensureDirSync(pluginAssetPath);
      fs.copySync(pluginPath, pluginAssetPath);
      if(config.js){
        importAsset(config.js, 'js');
      }
      if(config.css){
        importAsset(config.css, 'css');
      }
    }
    
  }

  function getType(p){
    return path.extname(filepath).substr(1)
  }

  function importAsset(filepath, type){        
    if(typeof filepath === 'string'){
      _importAsset(filepath, type, pluginAssetPath);
    }else if(Array.isArray(filepath)){      
      filepath.forEach(item=> _importAsset(item, type, pluginAssetPath))
    }
  }
}

function bindHooks(pluginModule, options){
  for (let key in pluginModule) {
    if (hooks[key]) {
      bindHook(key, {
        fn: pluginModule[key],
        options: options
      })
    }
  }
}

exports.loadPlugins = function loadPlugins() {
  const ydocConfig = ydoc.config;
  let modules = path.resolve(process.cwd(), 'node_modules');
  if(Array.isArray(ydocConfig.plugins) && ydocConfig.plugins.length > 0 ){
    ydocConfig.plugins.forEach(item=>{
      if(item[0] === '-'){
        let name = item.substr(1)
        DEFAULT_PLUGINS = DEFAULT_PLUGINS.filter(item=>{
          return item !== name
        })        
      }
    })
    ydocConfig.plugins = ydocConfig.plugins.filter(item=> item[0] !== '-')
  }

  let plugins = [].concat(DEFAULT_PLUGINS);
  if (ydocConfig.plugins && Array.isArray(ydocConfig.plugins)) {
    plugins = plugins.concat(ydocConfig.plugins)
  }
  for (let i = 0, l = plugins.length; i < l; i++) {
    let pluginName = plugins[i];
    
    try {
      let pluginModule, pluginModuleDir;
      if(pluginName && typeof pluginName === 'object' && pluginName.name && pluginName.module){
        pluginModule = pluginName.module;
        pluginName = pluginName.name;
        pluginModuleDir = process.cwd();        
      }else{
        try{
          pluginModuleDir = path.resolve(modules, './ydoc-plugin-' + pluginName)
          pluginModule = require(pluginModuleDir);
        }catch(err){
          pluginModuleDir = path.dirname(require.resolve('ydoc-plugin-' + pluginName))
          pluginModule = require(pluginModuleDir);
        }
        utils.log.info(`Load plugin "${pluginName}" success.`)
      }
      let options = typeof ydocConfig.pluginsConfig === 'object' && ydocConfig.pluginsConfig ? ydocConfig.pluginsConfig[pluginName] : null;    
      
      bindHooks(pluginModule, options)
      if(pluginModule.assets){
        handleAssets(pluginModule.assets, pluginModuleDir, pluginName)
      }
    } catch (err) {
      err.message = 'Load ' + path.resolve(modules, './ydoc-plugin-' + pluginName) + ' plugin failed, ' + err.message;
      throw err;
    }

  }
}