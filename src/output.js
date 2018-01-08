const fs = require('fs-extra');
const utils = require('./utils');
const path = require('path')
const emitHook = require('./plugin.js').emitHook;
const ydoc = require('./ydoc.js');

const noox = require('noox');
let nx = new noox(path.resolve(__dirname, '../theme/template'), {
  relePath: function(srcFilepath, importFilepath){
    importFilepath = path.isAbsolute(importFilepath)? '.' + importFilepath : importFilepath;
    importFilepath = path.resolve(ydoc.config.buildPath, importFilepath);
    let rele =  path.relative(srcFilepath, importFilepath);
    return rele.substr(3);
  }
});

module.exports = async function (props) {
  let content = nx.render('Layout', props);
  props.page.content = content;
  await emitHook('page', props.page);
  fs.writeFileSync(props.page.distPath, content);
  utils.log.debug('Generate file: ' + props.page.distPath)
}