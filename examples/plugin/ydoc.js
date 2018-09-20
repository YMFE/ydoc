module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ["-search", "-import-asset", "edit-page"],
  pluginsConfig: {
    'import-asset': {
      css: 'custom.css'
    },
    "edit-page": {
      prefix: 'https://github.com/YMFE/ydoc/tree/master/docs'
    }
  },
  markdownIt: function (md) {
    md.use(require('markdown-it-sub'));
    // md.use(require('markdown-it-sub'))
    //   .use(require('markdown-it-sup'));
  }
}