const path = require("path");
const fs = require("fs-extra");
const noox = require("noox");
const parse = require("./parse/parse.js");
const utils = require("./utils");

const loadPlugins = require("./plugin.js").loadPlugins;
const ydoc = require("./ydoc.js");
const ydocPath = path.resolve(__dirname, "..");
const loadMarkdownPlugins = require("./parse/markdown").loadMarkdownPlugins;

const readline = require('readline');



async function initYdoc() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
      
      rl.question('What do you think of Node.js? ', (answer) => {
        // TODO: Log the answer in a database
        console.log(`Thank you for your valuable feedback: ${answer}`);
      
        rl.close();
      });
}

module.exports = initYdoc;
