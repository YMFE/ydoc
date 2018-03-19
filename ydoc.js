module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ['copy'],
  pluginsConfig: {
    'import-assert': {
      css: 'custom.css',
      js:  'custom.js'
    }
  },
  markdownIt: function(md){
    
  }
  // buildPath: '_site2'
}