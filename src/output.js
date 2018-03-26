const fs = require('fs-extra');
const utils = require('./utils');
const emitHook = require('./plugin.js').emitHook;
const ydoc = require('./ydoc.js');

module.exports = async function (props) {
  props.assets = ydoc.getAssets();
  let content = utils.noox.render('Layout', props);
  props.page.content = content;
  await emitHook('page', props.page);
  fs.writeFileSync(props.page.distPath, content);
  utils.log.debug('Generate file: ' + props.page.distPath)
}