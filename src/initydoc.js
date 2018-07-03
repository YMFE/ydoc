const readlineSync = require('readline-sync');
const initConfig = ['title', 'description', 'author'];

function initYdoc() {
    readlineSync.question(`This utility will walk you through creating a ydoc.json file.\n
It only covers the most common items, and tries to guess sensible defaults.\n
Please enter your documents config`);
    let config = {};
    initConfig.forEach((item) => {
        const input = readlineSync.question(`Your document ${item} : `);
        if(input !== '') {
            config[item] = input;
        } 
    })
    return config;
}

module.exports = initYdoc;
