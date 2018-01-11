const marked = require('marked')
const fs = require('fs');
const utils = require('../utils');
const hljs = require('highlight.js');

marked.setOptions({
  highlight: function (code, lang) {
    if(lang && hljs.getLanguage(lang)){
      return hljs.highlight(lang, code).value;
    }else return hljs.highlightAuto(code).value;
  }
});

function parser(filepath) {
  let contents = fs.readFileSync(filepath, 'utf8');
  const renderer = new marked.Renderer();
  renderer.heading = function (text, level) {
    text = utils.hashEncode(text);
    return `<h${level} id="${text}">${text}</h${level}>`
  };
  renderer.listitem = function (text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
      text = text
        .replace(/^\s*\[ \]\s*/, '<i class="empty checkbox">&#xf35f;</i> ')
        .replace(/^\s*\[x\]\s*/, '<i class="checked checkbox">&#xf35e;</i> ');
      return '<li class="task-list">' + text + '</li>';
    } else {
      return '<li>' + text + '</li>';
    }
  };
  return marked(contents, {
    renderer: renderer
  });
}

module.exports = parser

