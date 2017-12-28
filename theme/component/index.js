require('babel-register');

const ReactDOMServer = require('react-dom/server');
const App = require('./App.js');

module.exports = function(context){
  return ReactDOMServer.renderToString(App(context));
}