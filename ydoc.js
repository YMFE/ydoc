module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ["copy", "edit-page"],
  pluginsConfig: {
    'import-asset': {
      css: 'custom.css'
    },
    "edit-page": {
      prefix: 'https://github.com/YMFE/ydoc/tree/master/docs'
    }
  },
  markdownIt: function(md){
    md.use(require('markdown-it-include'), __dirname);
  },
  dist: '_site',
//   version: require('./package.json').version
}