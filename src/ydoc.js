const utils = require('./utils.js');
const ydoc = {
  version: require('../package.json').version,
  require: function(path){
    if(!path) return;
  },
  log: utils.log,
  config: {
    root: "./docs",
    title: "ydoc",
    description: "ydoc description",
    author: "ymfe"
  }
}

module.exports=ydoc;


