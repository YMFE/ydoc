const utils = require('./utils.js');
const ydoc = {
  version: require('../package.json').version
}

const defaultConfig = {
  root: "./docs",
  title: "ydoc",
  description: "ydoc description",
  author: "ymfe"
}
utils.extend(ydoc, defaultConfig);
module.exports=ydoc;


