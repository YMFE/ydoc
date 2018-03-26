module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: [],
  pluginsConfig: {
    'import-assert': {
      css: 'custom.css',
      js:  'custom.js'
    }
  },
  markdownIt: function(md){
    
  },
  dist: '_site'
}