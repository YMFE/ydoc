const utils = require("./utils");
const readlineSync = require('readline-sync');
const initConfig = ['title', 'description', 'author'];

function initYdoc() {
    const projectPath = utils.projectPath;
    const configFilepath = utils.getConfigPath(projectPath);
    let config = utils.getConfig(configFilepath);
    initConfig.forEach((item) => {
        const input = readlineSync.question(`your document ${item} :`);
        if(input !== '') {
            config[item] = input;
        } 
    })
    return config;
}

module.exports = initYdoc;
