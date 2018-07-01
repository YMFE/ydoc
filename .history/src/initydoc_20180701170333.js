const utils = require("./utils");
const readline = require('readline-sync');

const initConfig = ['title', 'description', 'author'];
// const projectPath = process.cwd();
// const initConfig = path.resolve(projectPath, 'ydoc.js');


async function initYdoc() {
    const projectPath = utils.projectPath;
    const configFilepath = utils.getConfigPath(projectPath);
    let config = utils.getConfig(configFilepath);

    initConfig.forEach((item) => {
        const input = readline(`your document ${item} :`);
        if(input !== '') {
            config[item] = input;
        } 
    })
    
}

module.exports = initYdoc;
