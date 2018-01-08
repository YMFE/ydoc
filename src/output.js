const fs = require('fs-extra');
const utils = require('./utils');
const path = require('path')
const emitHook = require('./plugin.js').emitHook;
const ydoc = require('./ydoc.js');

const noox = require('noox');
let nx = new noox(path.resolve(__dirname, '../theme/template'), {
  relePath: ydoc.relePath
});

module.exports = async function (context) {
  context.asserts = ydoc.asserts;
  
  let content = nx.render('Layout', context);
  context.page.content = content;
  
  await emitHook('page', context.page);
  fs.writeFileSync(context.page.distPath, content);
  utils.log.debug('Generate file: ' + context.page.distPath)
}