const utils = require("./utils");
const readline = require('readline-sync');
const initConfig = ['title', 'description', 'author'];

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
