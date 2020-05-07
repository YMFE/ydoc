const fs = require('fs-extra');
const utils = require('./utils');
const emitHook = require('./plugin.js').emitHook;
const ydoc = require('./ydoc.js');
const beginHtml = '<!DOCTYPE html>'

module.exports = async function (props) {
  props.assets = ydoc.getAssets();
  let content = beginHtml + utils.noox.render('Layout', props);
  props.page.content = content;
  await emitHook('page', props.page, props);  
  fs.writeFileSync(props.page.distPath, props.page.content);
  utils.log.debug('Generate file: ' + props.page.distPath)
}