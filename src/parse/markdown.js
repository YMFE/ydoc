const utils = require('../utils.js');
const fs = require('fs-extra');

module.exports = function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return utils.md.render(content);
}