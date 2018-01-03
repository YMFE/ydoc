const fs = require('fs-extra');
const utils = require('./utils');

const emitHook = require('./plugin.js').emitHook;
const ReactDOMServer = require('react-dom/server');
const jsx = require('./jsx.js');
const components = jsx();


function render(context) {
  return ReactDOMServer.renderToStaticMarkup(components.Layout.fn(context));
}

module.exports = async function (context) {
  let content = render(context);
  context.page.content = content;
  await emitHook('page', context.page);
  fs.writeFileSync(context.page.distPath, content);
  utils.log.debug('Generate file: ' + context.page.distPath)
}