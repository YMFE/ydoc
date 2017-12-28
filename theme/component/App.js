const React = require('react');
const Header = require('./Header.js');
const Body = require('./Body.js');

const App = function(context){
  return <html><Header data={context} /><body><div>    
    <Body content={context.page.content} />
  </div></body></html>
}


module.exports = App;