const React = require('react');
const Head = require('./Head.js');
const Header = require('./Header.js');
const Body = require('./Body.js');

module.exports = function(context){
  return (
    <html>
      <Head data={context} />
      <body>
        <div>
          <Header />
          <Body content={context.page.content} />
        </div>
      </body>
    </html>
  );
};