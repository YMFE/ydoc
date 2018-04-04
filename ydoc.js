module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ["copy","img-view"],
  pluginsConfig: {
    'import-asset': {
      css: 'custom.css'
    }
  },
  markdownIt: function(md){
    
  },
  dist: '_site',
  version: require('./package.json').version
}