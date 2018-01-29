module.exports = {
  title: "ydoc demo111",
  description: "ydoc description demo",
  author: "ymfe",
  pluginsConfig: {
    'import-assert': {
      css: 'custom.css',
      js:  'custom.js'
    }
  },
  markdownItPlugins: [function(md){
    console.log(typeof md)
  }]
}