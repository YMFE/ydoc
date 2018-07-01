const path = require("path");
const fs = require("fs-extra");
const noox = require("noox");
const parse = require("./parse/parse.js");
const utils = require("./utils");

const loadPlugins = require("./plugin.js").loadPlugins;
const ydoc = require("./ydoc.js");
const ydocPath = path.resolve(__dirname, "..");
const loadMarkdownPlugins = require("./parse/markdown").loadMarkdownPlugins;

const readline = require('readline-sync');

const initConfig = ['title', 'description', 'author'];
// const projectPath = process.cwd();
// const initConfig = path.resolve(projectPath, 'ydoc.js');


async function initYdoc() {

    const configFilepath = utils.getConfigPath(projectPath);
    let config = utils.getConfig(configFilepath);

    initConfig.forEach((item) => {
        const 
        config[item] 
    })
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('What title? ', (answer) => {
        console.log(`Thank you for your valuable feedback: ${answer}`);
        config.title = answer;
    });

    rl.question('What title? ', (answer) => {
        console.log(`Thank you for your valuable feedback: ${answer}`);
        config.title = answer;
    });

    rl.close();
}

module.exports = initYdoc;
