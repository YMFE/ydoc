const fs = require('fs-extra');
const utils = require('./utils');
const path = require('path')
const emitHook = require('./plugin.js').emitHook;
const ydoc = require('./ydoc.js');

module.exports = async function (context) {
  context.asserts = ydoc.asserts;
  
  let content = utils.noox.render('Layout', context);
  context.page.content = content;

  await emitHook('page', context.page);
  fs.writeFileSync(context.page.distPath, content);
  utils.log.debug('Generate file: ' + context.page.distPath)
}