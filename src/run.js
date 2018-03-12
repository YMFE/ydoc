const path = require("path");
const fs = require("fs-extra");
const noox = require("noox");
const parse = require("./parse/parse.js");
const utils = require("./utils");

const loadPlugins = require("./plugin.js").loadPlugins;
const ydoc = require("./ydoc.js");
const ydocPath = path.resolve(__dirname, "..");
const loadMarkdownPlugins = require("./parse/markdown").loadMarkdownPlugins;

async function run(options = {
  mode: 'prd'
}) {
  // init Resources path
  const dist = ydoc.config.dist;
  const root = ydoc.config.root;
  const themePath = path.resolve(ydocPath, "theme");  
  const customerComponentsPath = path.resolve(root, "_components");

  const themeDist = path.resolve(dist, "_theme");
  const componentsDist = path.resolve(themeDist, "components");

  ydoc.config.buildPath = dist;

  if(options.mode === 'prd'){
    fs.removeSync(dist);
  }
  fs.ensureDirSync(dist);
  fs.ensureDirSync(themeDist);

  fs.copySync(root, dist);
  fs.copySync(themePath, themeDist);
  if (ydoc.config.theme && ydoc.config.theme !== "default") {
    handleTheme(ydoc.config.theme);
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

  utils.mergeCopyFiles(customerComponentsPath, componentsDist);

  loadPlugins();

  utils.noox = new noox(componentsDist, {
    relePath: ydoc.relePath,
    hook: ydoc.hook
  });

  loadMarkdownPlugins(ydoc.config.markdownIt);

  await parse.parseSite(dist);
  fs.removeSync(themeDist);

  function handleTheme(theme) {
    let modules = path.resolve(process.cwd(), "node_modules");
    let themeModuleDir = path.resolve(modules, "./ydoc-theme-" + theme);
    try {
      let themeModule = require(themeModuleDir);
      utils.mergeCopyFiles(path.resolve(themeModuleDir, "theme"), themeDist);
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
