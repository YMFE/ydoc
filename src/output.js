const fs = require('fs-extra');
const utils = require('./utils');
const Layout = require('../theme/template/Layout.js');
const emitHook = require('./plugin.js').emitHook;
const ReactDOMServer = require('react-dom/server');

function render(context) {
  return ReactDOMServer.renderToStaticMarkup(Layout(context));
}

module.exports = async function (context) {
  let content = render(context);
  context.page.content = content;
  await emitHook('page', context.page);
  fs.writeFileSync(context.page.distPath, content);
  utils.log.debug('Generate file: ' + context.page.distPath)
}