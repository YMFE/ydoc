const hooks = {
  init: {
    listener: []
  },
  "finish:before": {
    listener: []
  },
  "finish":  {
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