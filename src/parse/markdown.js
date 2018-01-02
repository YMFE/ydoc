const MarkdownIt = require('markdown-it');
const md = MarkdownIt({
  html: true,
  linkify: true
});
const fs = require('fs-extra');

module.exports = function parseMarkdown(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return md.render(content);
}