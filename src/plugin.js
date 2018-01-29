const ydoc = require('./ydoc.js');
const ydocConfig = ydoc.config;
const path = require('path');
const utils = require('./utils.js');
const fs = require('fs-extra');

const DEFAULT_PLUGINS = ['execution-time', 'import-assert'];

const hooks = {
  "init": {
    listener: []
  },
  "finish": {
    listener: []
  },
  "book:before": {
    listener: []
  },
  "book": {
    listener: []
  },
  "page:before": {
    listener: []
  },
  "page": {
    listener: []
  }
}


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

function _importAssert(filepath, type, pluginAssertPath){
  filepath = path.resolve(pluginAssertPath, filepath);
  return ydoc.addAssert(filepath, type)
}

function handleAsserts(config, dir, pluginName){
  let pluginAssertPath;
  if(config && typeof config === 'object'){
    if(config.dir){
      let pluginPath = path.resolve(dir, config.dir);
      pluginAssertPath = path.resolve(ydoc.config.buildPath, 'ydoc/ydoc-plugin-' + pluginName) ;
      fs.ensureDirSync(pluginAssertPath);
      fs.copySync(pluginPath, pluginAssertPath);
    }
    if(config.js){
      importAssert(config.js);
    }
    if(config.css){
      importAssert(config.css);
    }
  }

  function importAssert(filepath){
    if(typeof filepath === 'string'){
      _importAssert(filepath, 'js', pluginAssertPath);
    }else if(Array.isArray(filepath)){      
      filepath.forEach(item=> _importAssert(item, 'js', pluginAssertPath))
    }
  }
}

exports.loadPlugins = function loadPlugins() {
  let modules = path.resolve(process.cwd(), 'node_modules');
  let plugins = [].concat(DEFAULT_PLUGINS);
  if (ydocConfig.plugins && Array.isArray(ydocConfig.plugins)) {
    plugins = plugins.concat(ydocConfig.plugins)
  }
  for (let i = 0, l = plugins.length; i < l; i++) {
    let pluginName = plugins[i];
    let options = typeof ydocConfig.pluginsConfig === 'object' && ydocConfig.pluginsConfig ? ydocConfig.pluginsConfig[pluginName] : null;
    try {
      let pluginModule, pluginModuleDir;
      try{
        pluginModuleDir = path.resolve(modules, './ydoc-plugin-' + pluginName)
        pluginModule = require(pluginModuleDir);
      }catch(err){
        pluginModuleDir = path.resolve(__dirname, '../node_modules', './ydoc-plugin-' + pluginName)
        pluginModule = require(pluginModuleDir);
      }
      
      utils.log.info(`Load plugin "${pluginName}" success.`)
      for (let key in pluginModule) {
        if (hooks[key]) {
          bindHook(key, {
            fn: pluginModule[key],
            options: options
          })
        }
      }
      if(pluginModule.asserts){
        handleAsserts(pluginModule.asserts, pluginModuleDir, pluginName)
      }
    } catch (err) {
      err.message = 'Load ' + path.resolve(modules, './ydoc-plugin-' + pluginName) + ' plugin failed, ' + err.message;
      throw err;
    }

  }
}