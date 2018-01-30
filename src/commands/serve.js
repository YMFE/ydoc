const chokidar = require('chokidar');
const path = require('path')
const child_process = require('child_process');
const utils = require('../utils')
const color = require('bash-color');

function runner(ydocPath) {
  child_process.exec(`node ${ydocPath} build`, function (error, stdout, stderr) {
    if (error) {
      throw error
    }
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stdout.write(stdout);
  })
}

function preventDuplication(time = 500) {
  let sign = true;
  return function (fn, arg1) {
    if (sign === false) return;
    sign = false;    
    process.stdout.write(color.yellow("\nBuild...\n"))
    setTimeout(function () {
      sign = true;
      fn(arg1);
    }, time)
  }
}

module.exports = {
  setOptions: function () { },
  run: function () {
    const ydocPath = path.resolve(path.dirname(__dirname), '../bin/ydoc')
    runner(ydocPath)

    let preventDuplicationRunner = preventDuplication()

    function initPaths() {
      let paths = []
      const projectPath = utils.projectPath;
      const configFilepath = utils.getConfigPath(projectPath);
      const config = utils.getConfig(configFilepath);
      config.root = config.root || utils.defaultDocsPath;
      config.root = path.resolve(projectPath, config.root);
      paths.push(config.root);
      if (configFilepath) paths.push(configFilepath)
      return paths;
    }

    chokidar.watch(initPaths(), {
      ignoreInitial: true
    }).on('all', () => {
      preventDuplicationRunner(runner, ydocPath)
    })
  },
  desc: 'Generate the document site'
}