const { exec } = require('child_process');
const path = require('path')
const root = __dirname;

module.exports = {
  title: "ydoc",
  description: "ydoc description demo",
  author: "ymfe",
  plugins: ["copy", "edit-page", {
    name: 'privateCreateDemo',
    module: {
      finish: function(){
        exec(`cd ${root}; sh bin/build-demo-page.sh`, (err, stdout, stderr) =>{
          if(err){
            console.error(err);
            return;
          }
          if(stdout)console.log(`stdout: ${stdout}`);
          if(stderr)console.log(`stderr: ${stderr}`);
        })
      }
    }
  }],
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