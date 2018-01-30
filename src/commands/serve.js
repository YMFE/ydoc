const chokidar = require('chokidar');
const path = require('path')
const child_process = require('child_process');
const utils = require('../utils')
const ora = require('ora');

function runner() {
  const spinner = ora('').start();

  const ydocPath = path.resolve(path.dirname(__dirname), '../bin/ydoc')
    child_process.exec(`node ${ydocPath} build`, function(error, stdout, stderr){
      spinner.stop()
      if(error) throw error;
      if(stdout)process.stdout.write(stdout);
      if(stderr)process.stdout.write(stderr);
      utils.log.ok('Starting up http-server: http://127.0.0.1:9999')
    })
}

function preventDuplication(time = 500) {
  let sign = true;
  return function (fn, ...arg) {
    if (sign === false) return;
    sign = false;    
    setTimeout(function () {
      sign = true;
      fn.apply(this, arg);
    }, time)
  }
}

function init() {
  let paths = []
  const projectPath = utils.projectPath;
  const configFilepath = utils.getConfigPath(projectPath);
  const config = utils.getConfig(configFilepath);
  config.root = config.root || utils.defaultDocsPath;
  config.root = path.resolve(projectPath, config.root);
  const buildPath = config.buildPath || utils.defaultBuildPath;
  paths.push(config.root);
  if (configFilepath) paths.push(configFilepath)
  return {
    paths: paths,
    buildPath: path.resolve(projectPath, buildPath) 
  };
}

function server(buildPath){
  const Koa = require('koa');
  const app = new Koa();
  app.use(require('koa-static')(buildPath));   

  app.listen(9999); 
}

module.exports = {
  setOptions: function () { },
  run: function () {
    let preventDuplicationRunner = preventDuplication()
    let config = init()
    runner()   
    server(config.buildPath)
    
    chokidar.watch(config.paths, {      
      ignoreInitial: true
    }).on('all', () => {
      config = init()
      preventDuplicationRunner(runner)
    })
  },
  desc: 'Generate the document site'
}