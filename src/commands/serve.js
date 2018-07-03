const chokidar = require('chokidar');
const path = require('path');
const child_process = require('child_process');
const utils = require('../utils');
const ora = require('ora');
let port = 9999;

function runner() {
  const spinner = ora('').start();

  const ydocPath = path.resolve(path.dirname(__dirname), '../bin/ydoc')
    child_process.exec(`node ${ydocPath} build --mode=dev`, function(error, stdout, stderr){
      spinner.stop()
      if(error) throw error;
      if(stdout) process.stdout.write(stdout);
      if(stderr) process.stdout.write(stderr);
      utils.log.ok('Starting up http-server: http://127.0.0.1:' + port)
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
  const ydocPath = path.resolve(__dirname, '../..')
  const paths = [
    path.resolve(ydocPath, './src'),
    path.resolve(ydocPath, './theme')
  ]
  
  const projectPath = utils.projectPath;
  const configFilepath = utils.getConfigPath(projectPath);
  const config = utils.getConfig(configFilepath);
  config.root = config.root || utils.defaultDocsPath;
  config.root = path.resolve(projectPath, config.root);
  const buildPath = config.dist || utils.defaultBuildPath;
  paths.push(config.root);
  if (configFilepath) paths.push(configFilepath)
  return {
    paths: paths,
    buildPath: path.resolve(projectPath, buildPath) 
  };
}

function server(buildPath){
  const Koa = require('koa');
  var liveload = require('../live-reload');
  const app = new Koa();
  app.use(liveload(buildPath))
  app.use(require('koa-static')(buildPath));   
  app.listen(port); 
}

module.exports = {
  setOptions: function (yargs) { 
    yargs.option('port', {
      describe: 'Port of server',
      default: 9999
    })
  },
  run: function (argv) {
    let preventDuplicationRunner = preventDuplication()    
    port = argv.port;

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
  desc: 'Starts a local server. By default, this is at http://127.0.0.1:' + port
}