module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ["copy", "edit-page", "gitalk"],
  pluginsConfig: {
    'import-asset': {
      css: 'custom.css'
    },
    "edit-page": {
      prefix: 'https://github.com/YMFE/ydoc/tree/master/docs'
    },
    "gitalk": {
      on: true,
      owner: ['dwb1994'],
      repo: 'gitalk0',
      admin: 'dwb1994',
      clientID: 'b342e8d71f6f48b2e0c9',
      clientSecret: 'f078384fd5bbbbe08520dc0f1b4d0c55e9cb2c1e'
    }
  },
  markdownIt: function(md){
    md.use(require('markdown-it-include'), __dirname);
  },
  dist: '_site',
//   version: require('./package.json').version
}