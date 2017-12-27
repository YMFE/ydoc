const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const fs = require('fs-extra');

module.exports = function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return md.render(content);
}