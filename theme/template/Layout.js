const React = require('react');
const Head = require('./Head.js');
const Body = require('./Body.js');

module.exports = function(context){
  return (
    <html>
      <Head data={context} />
      <body>
        <div>
          <Body content={context.page.content} />
        </div>
      </body>
    </html>
  );
};