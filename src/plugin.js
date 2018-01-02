const ydoc = require('./ydoc.js');

const Plugins = [];

const hooks = {
  "init": {
    listener: []
  },
  "finish":  {
    listener: []
  },
  "markdown": {
    listener: []
  },
  "book:bofore":{
    listener: []
  },
  "book":{
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
              promiseAll.push(Promise.resolve(listenerList[i].apply(yapi, args)));
          }
      }
      return Promise.all(promiseAll);
  }
}

function loadPlugins(){
  let modules = path.resolve(process.cwd(), 'node_modules');
  if(ydoc.plugins && Array.isArray(ydoc.plugins)){
    plugins = plugins.concat(ydoc.plugins)
  }
  for(let i=0, l= plugins.length; i< l; i++){
    let pluginName = plugins[i];
    try{
      let pluginModule = require(path.resolve(modules, './ydoc-plugin-' + pluginName));
      utils.log.info(`Load plugin ${pluginName} success.`)
    }catch(err){
      err.message = 'Load ' + path.resolve(modules, './ydoc-plugin-' + pluginName) + ' plugin failed, ' + err.message;
      throw err;
    }
    for(let key in pluginModule){
      if(hooks[key]){
        bindHook(key, pluginModule[key])
      }
    }
  }
}