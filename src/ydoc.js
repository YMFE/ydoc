const utils = require('./utils.js');
const path = require('path');
const asserts = {
  js: [],
  css: []
}

const ydoc = {
  version: require('../package.json').version,
  log: utils.log,
  config: {
    root: "./docs",
    title: "ydoc",
    description: "ydoc description",
    author: "ymfe",
    plugins: [{
      name: 'comment',
      options: {
        files: 'src/test-comment/**/*.js'
      }
    }]
  },
  relePath: function(srcFilepath, importFilepath){
    importFilepath = path.isAbsolute(importFilepath)? importFilepath : path.resolve(ydoc.config.buildPath, importFilepath);
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

module.exports=ydoc;


