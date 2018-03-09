module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ["demo"],
  pluginsConfig: {
    'import-assert': {
      css: 'custom.css',
      js:  'custom.js'
    }
  },
  markdownIt: [function(md){
    console.log(md)
  }]
  // buildPath: '_site2'
}