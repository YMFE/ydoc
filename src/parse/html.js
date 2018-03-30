const fs = require('fs-extra');

module.exports = function parseHtml(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}