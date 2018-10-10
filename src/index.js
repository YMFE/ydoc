const path = require("path");
const fs = require("fs-extra");
const noox = require("noox");
const parse = require("./parse/parse.js");
const utils = require("./utils");

const loadPlugins = require("./plugin.js").loadPlugins;
const ydoc = require("./ydoc.js");
const ydocPath = path.resolve(__dirname, "..");
const loadMarkdownPlugins = require("./parse/markdown").loadMarkdownPlugins;

function initConfig(config){
  const projectPath = utils.projectPath;
  if(!config){    
    const configFilepath = utils.getConfigPath(projectPath);
    config = utils.getConfig(configFilepath);
  }
  
  utils.extend(ydoc.config, config);
  ydoc.config.dist = path.resolve(projectPath, ydoc.config.dist);  
  ydoc.config.root = path.resolve(projectPath, ydoc.config.root);
}

async function run(config) {
  // init Resources path
  initConfig(config)
  const dist = ydoc.config.dist;
  const root = ydoc.config.root;
  const themePath = path.resolve(ydocPath, "theme"); 
  const customerComponentsPath = path.resolve(root, "_components");

  const themeDist = path.resolve(dist, "_theme");
  const componentsDist = path.resolve(themeDist, "components");

  if(process.env.NODE_ENV === 'production'){
    fs.removeSync(dist);
  }
  fs.ensureDirSync(dist); // 新建 my-project/_site 
  fs.ensureDirSync(themeDist); // 新建 my-project/_site/_theme

  fs.copySync(root, dist); // docs => _site
  fs.copySync(themePath, themeDist); // ydoc/theme => my-project/_site/_theme
  if (ydoc.config.theme && ydoc.config.theme !== "default") {
    handleTheme(ydoc.config.theme); // load custom theme
  }

  fs.copySync(
    path.resolve(themeDist, "style.css"),
    path.resolve(dist, "ydoc/styles", "style.css")
  );
  fs.copySync(
    path.resolve(themeDist, "images"),
    path.resolve(dist, "ydoc/images")
  );
  fs.copySync(
    path.resolve(themeDist, "scripts"),
    path.resolve(dist, "ydoc/scripts")
  );

  if(utils.dirExist(customerComponentsPath)){
    utils.mergeCopyFiles(customerComponentsPath, componentsDist);
  }
  

  loadPlugins();

  utils.noox = new noox(componentsDist, {
    relePath: ydoc.relePath,
    hook: ydoc.hook
  });

  loadMarkdownPlugins(ydoc.config.markdownIt);

  await parse.parseSite(dist);
  fs.removeSync(themeDist);

  return {
    code: 0 //0 代表成功
  }
  
  function handleTheme(theme) {
    // 如果theme的文件夹中存在对应的theme，则使用对应的theme,没有的话使用node_modules
    let themePath = path.resolve(process.cwd(), "theme");
    let themeFile = path.resolve(themePath, "./ydoc-theme-" + theme);
    let themeModuleDir;
    // console.log('-----themeFile',themeFile)
    if(fs.existsSync(themeFile)) {
        themeModuleDir = themeFile;
    } else {
        let modules = path.resolve(process.cwd(), "node_modules");
        let themeFile = path.resolve(modules, "./ydoc-theme-" + theme);
        themeModuleDir = path.resolve(themeFile, "./theme");
    }
    // console.log('=======themeModuleDir', themeModuleDir)
    try {
      utils.mergeCopyFiles(themeModuleDir, themeDist);
    } catch (err) {
      err.message =
        "Load " +
        path.resolve(modules, "./ydoc-theme-" + theme) +
        `theme failed, Please run "npm install ydoc-theme-${theme}" install the theme.`;
      throw err;
    }
  }
}

module.exports = run;