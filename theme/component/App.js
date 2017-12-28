const React = require('react');

const Header = (props)=> {
  return <head>
    <title>{props.data.title}</title>
  </head> 
};

const Body = (props)=> {
  return <div dangerouslySetInnerHTML={{__html: props.content}}></div>
}

const App = function(context){
  return <html><Header data={context} /><body><div>    
    <Body content={context.page.content} />
  </div></body></html>
}


module.exports = App;