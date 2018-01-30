const path = require('path');
const fs = require('fs-extra');
const noox = require('noox');
const parse = require('./parse/parse.js');
const utils = require('./utils');
const sass = require('node-sass');
const loadPlugins = require('./plugin.js').loadPlugins;
const ydoc = require('./ydoc.js');
const ydocPath = path.resolve(__dirname, '..')
const loadMarkdownPlugins = require('./parse/markdown').loadMarkdownPlugins;

async function run() {
  // init Resources path  
  const dist = ydoc.config.dist;  
  const root = ydoc.config.root;
  const styleInPath = path.resolve(ydocPath, 'theme/styles/index.scss');
  const scriptInPath = path.resolve(ydocPath, 'theme/scripts/');
  const imageInPath = path.resolve(ydocPath, 'theme/images/');
  const styleOutPath = path.resolve( dist , 'ydoc/styles', 'style.css');
  const scriptOutPath = path.resolve(dist,  'ydoc/scripts/');
  const imageOutPath = path.resolve(dist,  'ydoc/images/');
  
  const componentsDist = path.resolve(dist, '_components');
  const componentsRoot = path.resolve(ydocPath, 'theme/components');
  ydoc.config.buildPath = dist;

  fs.removeSync(dist);  
  fs.ensureDirSync(dist);
  fs.ensureDirSync(componentsDist);
  fs.ensureDirSync(path.resolve(dist, 'ydoc/styles'));
  fs.ensureDirSync(path.resolve(dist, 'ydoc/scripts'));
  fs.ensureDirSync(path.resolve(dist, 'ydoc/images'));
  fs.copySync(scriptInPath, scriptOutPath);
  fs.copySync(imageInPath, imageOutPath);
  fs.copySync(root, dist);

  let components = fs.readdirSync(componentsRoot);
  components.forEach(item => {
    if (path.extname(item) !== '.jsx' || item[0].toUpperCase() !== item[0]) return;
    let distPath = path.resolve(componentsDist, item)
    if (!utils.fileExist(distPath)) {
      fs.copySync(path.resolve(componentsRoot, item), distPath)
    }
  })

  loadPlugins();

  let componentPath = path.resolve(dist, '_components')
    utils.noox = new noox(componentPath, {
      relePath: ydoc.relePath
    });
  fs.removeSync(componentPath)
  loadMarkdownPlugins(ydoc.config.markdownItPlugins);

  await parse.parseSite(dist);

  // 编译 scss 文件至 docs 目录中
  sass.render({
    file: styleInPath,
    outFile: styleOutPath,
    outputStyle: 'expanded'
  }, function (err, result) {
    if (!err) {
      fs.writeFile(styleOutPath, result.css, function (err) {
        if (err) {
          throw err;
        }
      })
    } else {
      throw err;
    }
  });

}

module.exports = run;