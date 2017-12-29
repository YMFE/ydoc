require('babel-register');
const fs = require('fs-extra');
const utils = require('./utils');
const Layout = require('../theme/template/Layout.js');



const ReactDOMServer = require('react-dom/server');

function render(context){
  return ReactDOMServer.renderToString(Layout(context));
}

module.exports = function(page, context){
  return ()=> {
    // console.log(context);
    // throw new Error('err')
    fs.writeFileSync(page.absolutePath, render(context));
    utils.log.debug('Generate file: ' + page.absolutePath)
  }  
}