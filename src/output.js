require('babel-register');
const fs = require('fs-extra');
const utils = require('./utils');
const Layout = require('../theme/template/Layout.js');



const ReactDOMServer = require('react-dom/server');

function render(context) {
  return ReactDOMServer.renderToStaticMarkup(Layout(context));
}

module.exports = function (context) {

  // console.log(context);
  // throw new Error('err')
  fs.writeFileSync(context.page.distPath, render(context));
  utils.log.debug('Generate file: ' + context.page.distPath)

}