const path = require("path");
const fs = require("fs-extra");
const noox = require("noox");
const parse = require("./parse/parse.js");
const utils = require("./utils");

const loadPlugins = require("./plugin.js").loadPlugins;
const ydoc = require("./ydoc.js");
const ydocPath = path.resolve(__dirname, "..");
const loadMarkdownPlugins = require("./parse/markdown").loadMarkdownPlugins;

async function initYdoc(config) {
  
}

module.exports = initYdoc;
