const ydoc = require('./ydoc.js');
const ydocConfig = ydoc.config;
const path = require('path');
const utils = require('./utils.js');

const PLUGINS = [
  {name: 'execution-time', hideLog: true}
];

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
  },
  "markdown": {
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
        let context = utils.extend({}, ydoc);
        context.options = listenerList[i].options;
        promiseAll.push(Promise.resolve(listenerList[i].fn.apply(context, args)));
      }
    }
    return Promise.all(promiseAll);
  }
}

exports.loadPlugins = function loadPlugins() {
  let modules = path.resolve(process.cwd(), 'node_modules');
  let plugins = [];
  if (ydocConfig.plugins && Array.isArray(ydocConfig.plugins)) {
    plugins = PLUGINS.concat(ydocConfig.plugins)
  }
  for (let i = 0, l = plugins.length; i < l; i++) {
    let pluginName = plugins[i].name;
    let options = plugins[i].options;
    try {
      let pluginModule = require(path.resolve(modules, './ydoc-plugin-' + pluginName));
      if(!plugins[i].hideLog) utils.log.info(`Load plugin "${pluginName}" success.`)
      for (let key in pluginModule) {
        if (hooks[key]) {
          bindHook(key, {
            fn: pluginModule[key],
            options: options
          })
        }
      }
    } catch (err) {
      err.message = 'Load ' + path.resolve(modules, './ydoc-plugin-' + pluginName) + ' plugin failed, ' + err.message;
      throw err;
    }

  }
}